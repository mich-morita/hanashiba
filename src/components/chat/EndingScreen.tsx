"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

interface EndingScreenProps {
  onRestart: () => void;
}

export function EndingScreen({ onRestart }: EndingScreenProps) {
  const [visible, setVisible] = useState(false);

  // Slight delay before fade-in so the transition is perceivable
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`
        flex flex-col items-center justify-center min-h-screen px-6 text-center
        transition-opacity duration-700
        ${visible ? "opacity-100" : "opacity-0"}
      `}
    >
      <div className="max-w-xs w-full space-y-10">
        <div className="space-y-5">
          <p className="text-stone-500 text-base leading-loose">
            話してくれてありがとう。
          </p>
          <p className="text-stone-400 text-sm leading-loose">
            また話したくなったら、<br />
            いつでもここで待ってます。
          </p>
        </div>

        <Button variant="ghost" onClick={onRestart} className="text-xs text-stone-400">
          もどる
        </Button>
      </div>
    </div>
  );
}
