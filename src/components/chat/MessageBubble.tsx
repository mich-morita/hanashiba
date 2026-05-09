import { Message } from "@/types";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`
          max-w-[75%] px-5 py-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
          ${isUser
            ? "bg-stone-700 text-stone-50 rounded-br-sm"
            : "bg-stone-100 text-stone-700 rounded-bl-sm"
          }
        `}
      >
        {message.content}
      </div>
    </div>
  );
}
