"use client";

import { useEffect, useState } from "react";

export type MonitorSettings = {
  /** 探测频率（分钟） */
  interval: number;
  /** 缺货到货桌面提醒 */
  restockAlert: boolean;
  /** 探测完成提示音 */
  sound: boolean;
  /** 前台自动刷新 */
  autoRefresh: boolean;
};

const DEFAULTS: MonitorSettings = {
  interval: 10,
  restockAlert: true,
  sound: false,
  autoRefresh: true,
};

export function loadSettings(): MonitorSettings {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem("vpsm-settings") ?? "{}") };
  } catch {
    return DEFAULTS;
  }
}

export function SettingsModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [s, setS] = useState<MonitorSettings>(DEFAULTS);

  useEffect(() => {
    if (open) setS(loadSettings());
  }, [open]);

  if (!open) return null;

  const save = () => {
    localStorage.setItem("vpsm-settings", JSON.stringify(s));
    import("./Toast").then(({ toast }) => toast("监控设置已保存"));
    onClose();
  };

  const field = "w-full rounded-lg border border-line bg-bg px-3 py-2 text-[13px] outline-none focus:border-primary";

  return (
    <div
      className="fixed inset-0 z-[90] grid place-items-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md rounded-2xl border border-line bg-card p-5 shadow-2xl">
        <div className="mb-4 text-[15px] font-semibold">监控设置</div>

        <label className="mb-3 block space-y-1.5">
          <span className="text-[12.5px] text-muted">自动探测频率</span>
          <select
            className={field}
            value={s.interval}
            onChange={(e) => setS({ ...s, interval: +e.target.value })}
          >
            <option value={5}>每 5 分钟</option>
            <option value={10}>每 10 分钟</option>
            <option value={30}>每 30 分钟</option>
            <option value={60}>每 60 分钟</option>
          </select>
        </label>

        {(
          [
            ["restockAlert", "缺货产品到货提醒"],
            ["sound", "探测完成提示音"],
            ["autoRefresh", "前台自动刷新库存"],
          ] as const
        ).map(([key, label]) => (
          <label
            key={key}
            className="mb-2.5 flex cursor-pointer items-center justify-between rounded-lg px-1 py-1 text-[13px] hover:bg-soft"
          >
            {label}
            <input
              type="checkbox"
              checked={s[key]}
              onChange={(e) => setS({ ...s, [key]: e.target.checked })}
              className="h-4 w-4 accent-[var(--primary)]"
            />
          </label>
        ))}

        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg border border-line px-3.5 py-2 text-[13px] text-muted hover:text-fg"
          >
            取消
          </button>
          <button
            onClick={save}
            className="rounded-lg bg-primary px-3.5 py-2 text-[13px] font-medium text-primary-fg hover:opacity-90"
          >
            保存设置
          </button>
        </div>
      </div>
    </div>
  );
}
