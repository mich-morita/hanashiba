"use client";

import { Button } from "@/components/ui/Button";

interface HeroProps {
  onStart: () => void;
  isLoading: boolean;
}

export function Hero({ onStart, isLoading }: HeroProps) {
  const label = isLoading ? "準備中…" : "話しはじめる";

  return (
    <main className="flex flex-col items-center justify-between min-h-screen px-6 py-12 text-center">
      {/* ─── Top: subtle talk button ─── */}
      <div className="w-full flex justify-end">
        <Button variant="ghost" onClick={onStart} disabled={isLoading} className="text-xs">
          {label}
        </Button>
      </div>

      {/* ─── Center: main content ─── */}
      <div className="max-w-xs w-full space-y-12">
        <div className="space-y-5">
          <h1 className="text-4xl font-light tracking-[0.25em] text-stone-600">
            はなしば
          </h1>
          <p className="text-stone-400 text-sm leading-loose">
            ここは、ただ話せる場所です。
          </p>
        </div>

        <div className="space-y-8 text-stone-300 text-xs leading-loose">
          <p>
            解決しなくていい。<br />
            答えなくていい。<br />
            ただ、聞いています。
          </p>

          <div className="border-t border-stone-100 pt-6 space-y-1">
            <p>アドバイスはしません</p>
            <p>解決策も出しません</p>
            <p>ただ、そこにいます</p>
          </div>
        </div>

        {/* Primary CTA */}
        <div className="space-y-4">
          <Button onClick={onStart} disabled={isLoading} className="w-full">
            {label}
          </Button>
          <p className="text-stone-300 text-xs leading-loose">
            アカウント不要・完全匿名<br />
            会話は24時間後に自動で消えます
          </p>
        </div>
      </div>

      {/* ─── Bottom: another entry point ─── */}
      <div className="w-full flex justify-center pt-8">
        <Button variant="ghost" onClick={onStart} disabled={isLoading} className="text-xs text-stone-300">
          {isLoading ? "準備中…" : "今すぐ話す →"}
        </Button>
      </div>
    </main>
  );
}
