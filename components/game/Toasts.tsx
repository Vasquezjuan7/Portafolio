"use client";

import { useGame } from "./GameProvider";

/** Notificaciones de juego: zonas descubiertas y logros. */
export default function Toasts() {
  const { toasts } = useGame();
  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-50 flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-2 max-sm:[&>*:not(:last-child)]:hidden sm:top-20 sm:bottom-auto" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className="panel corners anim-slide flex items-start gap-3 p-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-primary/50 bg-primary/15 text-xl" aria-hidden="true">
            {t.icon}
          </span>
          <div className="min-w-0">
            <p className="font-hud text-[11px] font-bold tracking-[0.2em] text-primary-ink uppercase">{t.kicker}</p>
            <p className="font-display text-base leading-tight font-bold text-ink">{t.title}</p>
            {t.text && <p className="mt-0.5 text-xs text-muted">{t.text}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
