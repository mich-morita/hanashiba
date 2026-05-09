"use client";

import { Hero } from "@/components/lp/Hero";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { EndingScreen } from "@/components/chat/EndingScreen";
import { useChat } from "@/hooks/useChat";

/**
 * State machine:
 *   idle → session_active → chatting → ending → ended → idle
 */
export default function Home() {
  const {
    messages,
    chatState,
    isLoading,
    error,
    startSession,
    sendMessage,
    endSession,
    reset,
  } = useChat();

  if (chatState === "idle") {
    return <Hero onStart={startSession} isLoading={isLoading} />;
  }

  if (chatState === "ended") {
    return <EndingScreen onRestart={reset} />;
  }

  // session_active | chatting | ending
  return (
    <div className="h-screen flex flex-col max-w-lg mx-auto">
      <ChatWindow
        messages={messages}
        chatState={chatState}
        isLoading={isLoading}
        error={error}
        onSend={sendMessage}
        onEnd={endSession}
      />
    </div>
  );
}
