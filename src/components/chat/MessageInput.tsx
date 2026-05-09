"use client";

import { useState, KeyboardEvent, useRef, useEffect } from "react";

interface MessageInputProps {
  onSend: (content: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export function MessageInput({ onSend, isLoading, disabled }: MessageInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || isLoading || disabled) return;
    onSend(trimmed);
    setValue("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-end gap-3 p-4 border-t border-stone-100 bg-white">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="ここに気持ちを書いてください…"
        disabled={disabled || isLoading}
        rows={1}
        className="
          flex-1 resize-none rounded-xl border border-stone-200 bg-stone-50
          px-4 py-3 text-sm text-stone-700 placeholder-stone-300
          focus:outline-none focus:border-stone-400 focus:bg-white
          transition-colors duration-200 max-h-40 overflow-y-auto
          disabled:opacity-40 disabled:cursor-not-allowed
        "
      />
      <button
        onClick={handleSend}
        disabled={!value.trim() || isLoading || disabled}
        aria-label="送信"
        className="
          w-10 h-10 flex items-center justify-center rounded-full
          bg-stone-700 text-white flex-shrink-0
          hover:bg-stone-800 transition-colors duration-200
          disabled:opacity-30 disabled:cursor-not-allowed
        "
      >
        {isLoading ? (
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        )}
      </button>
    </div>
  );
}
