"use client";

import { useEffect, useState } from "react";
import { CircleCheck, CircleAlert } from "lucide-react";

type Item = { id: number; msg: string; type: "ok" | "err" };

/** 全局轻提示：toast("已复制") / toast("失败", "err") */
export function toast(msg: string, type: "ok" | "err" = "ok") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("vpsm:toast", { detail: { msg, type } }));
}

export function ToastHost() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    let n = 0;
    const on = (e: Event) => {
      const { msg, type } = (e as CustomEvent).detail as { msg: string; type: "ok" | "err" };
      const id = ++n;
      setItems((s) => [...s.slice(-2), { id, msg, type }]);
      setTimeout(() => setItems((s) => s.filter((i) => i.id !== id)), 2600);
    };
    window.addEventListener("vpsm:toast", on);
    return () => window.removeEventListener("vpsm:toast", on);
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-[100] flex -translate-x-1/2 flex-col items-center gap-2">
      {items.map((i) => (
        <div
          key={i.id}
          className="toast-in pointer-events-auto flex items-center gap-2 rounded-full border border-line bg-card px-4 py-2 text-[13px] shadow-lg shadow-black/10"
        >
          {i.type === "ok" ? (
            <CircleCheck size={15} className="text-ok" />
          ) : (
            <CircleAlert size={15} className="text-bad" />
          )}
          {i.msg}
        </div>
      ))}
    </div>
  );
}
