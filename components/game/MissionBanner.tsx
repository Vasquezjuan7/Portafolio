"use client";

import { useGame } from "./GameProvider";

/** Gran banner central tipo "MISIÓN COMPLETADA". */
export default function MissionBanner() {
  const { banner } = useGame();
  if (!banner) return null;

  const color = banner.tone === "fail" ? "#ef4444" : banner.tone === "secret" ? "var(--accent)" : "var(--primary)";

  return (
    <div className="pointer-events-none fixed inset-0 z-[90] grid place-items-center" role="status" aria-live="assertive">
      <div className="w-full py-6 text-center" style={{ animation: "banner 3.2s ease both", background: "linear-gradient(90deg, transparent, rgb(0 0 0 / 0.78) 20%, rgb(0 0 0 / 0.78) 80%, transparent)" }}>
        <p className="font-display text-4xl font-bold tracking-wider uppercase sm:text-6xl" style={{ color, textShadow: `0 0 30px ${color}` }}>
          {banner.title}
        </p>
        {banner.subtitle && <p className="font-hud mt-2 text-sm tracking-[0.3em] text-white/85 uppercase sm:text-base">{banner.subtitle}</p>}
      </div>
    </div>
  );
}
