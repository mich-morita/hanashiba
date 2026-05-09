"use client";

import { useState, useCallback, useEffect } from "react";
import { Message, ChatState, CreateSessionResponse } from "@/types";

// Must exceed the CSS fade-out duration (700ms)
const ENDING_DELAY_MS = 800;

interface UseChatReturn {
  messages: Message[];
  sessionId: string | null;
  chatState: ChatState;
  isLoading: boolean;
  error: string | null;
  startSession: () => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  endSession: () => Promise<void>;
  reset: () => void;
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [chatState, setChatState] = useState<ChatState>("idle");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Return-visit detection via localStorage (no user identity, just boolean flag)
  useEffect(() => {
    const STORAGE_KEY = "hanashiba_visited";
    if (typeof window === "undefined") return;

    const alreadyVisited = localStorage.getItem(STORAGE_KEY);
    if (alreadyVisited) {
      fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event: "return_visit" }),
      }).catch(() => {});
    } else {
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
    }
  }, []);

  const startSession = useCallback(async () => {
    setError(null);
    const res = await fetch("/api/session", { method: "POST" });
    if (!res.ok) {
      setError("セッションを開始できませんでした。もう一度お試しください。");
      return;
    }
    const data: CreateSessionResponse = await res.json();
    setSessionId(data.sessionId);
    setMessages([]);
    setChatState("session_active");
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!sessionId || isLoading) return;

      // Optimistically append user message
      const optimisticMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content,
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, optimisticMessage]);
      setChatState("chatting");
      setIsLoading(true);
      setError(null);

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, content }),
      });

      setIsLoading(false);

      if (!res.ok) {
        const message =
          res.status === 410
            ? "セッションの有効期限が切れました。もう一度はじめてください。"
            : "メッセージを送れませんでした。もう一度お試しください。";
        setError(message);
        return;
      }

      const data = await res.json();
      setMessages((prev) => [...prev, data.message]);
    },
    [sessionId, isLoading]
  );

  const endSession = useCallback(async () => {
    // 1. Trigger fade-out animation
    setChatState("ending");

    // 2. Wait for the CSS transition to complete
    await new Promise<void>((resolve) => setTimeout(resolve, ENDING_DELAY_MS));

    // 3. Delete session data from server
    if (sessionId) {
      await fetch(`/api/session/${sessionId}`, { method: "DELETE" }).catch(() => {});
    }

    // 4. Clear local state and show ending screen
    setSessionId(null);
    setMessages([]);
    setChatState("ended");
  }, [sessionId]);

  const reset = useCallback(() => {
    setSessionId(null);
    setMessages([]);
    setError(null);
    setChatState("idle");
  }, []);

  return {
    messages,
    sessionId,
    chatState,
    isLoading,
    error,
    startSession,
    sendMessage,
    endSession,
    reset,
  };
}
