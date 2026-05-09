"use client";

import { useEffect, useRef } from "react";
import { Message, ChatState } from "@/types";
import { MessageBubble } from "./MessageBubble";
import { MessageInput } from "./MessageInput";

interface ChatWindowProps {
  messages: Message[];
  chatState: ChatState;
  isLoading: boolean;
  error: string | null;
  onSend: (content: string) => void;
  onEnd: () => void;
}

export function ChatWindow({
  messages,
  chatState,
  isLoading,
  error,
  onSend,
  onEnd,
}: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const isEnding = chatState === "ending";

  useEffect(() => {
    if (isEnding) return;
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, isEnding]);

  return (
    <div
      className={`
        flex flex-col h-full
        transition-opacity duration-700
        ${isEnding ? "opacity-0 pointer-events-none" : "opacity-100"}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
        <span className="text-stone-400 text-sm tracking-widest select-none">はなしば</span>
        <button
          onClick={onEnd}
          disabled={isEnding}
          className="text-xs text-stone-300 hover:text-rose-400 transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          話し終える
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-5">
        {messages.length === 0 && (
          <p className="text-center text-stone-300 text-sm pt-8 leading-loose">
            気持ちを、そのまま話してください。<br />
            ここでは、ただ聞いています。
          </p>
        )}

        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {isLoading && <TypingIndicator />}

        {error && (
          <p className="text-center text-rose-300 text-xs leading-relaxed py-2">
            {error}
          </p>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <MessageInput onSend={onSend} isLoading={isLoading} disabled={isEnding} />
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-stone-100 rounded-2xl rounded-bl-sm px-5 py-4">
        <span className="flex gap-1.5 items-center">
          <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce [animation-delay:0ms]" />
          <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce [animation-delay:160ms]" />
          <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce [animation-delay:320ms]" />
        </span>
      </div>
    </div>
  );
}
