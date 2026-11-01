"use client";

import { useGame } from "./game/GameProvider";

/** Firma fija abajo a la izquierda con el nombre. */
export default function NameTag() {
  const { c } = useGame();
  return (
    <div
      className="pointer-events-none fixed bottom-5 left-5 z-40 hidden items-center gap-2.5 rounded-full border border-line bg-black/40 py-1.5 pr-4 pl-1.5 backdrop-blur-md sm:flex"
      aria-hidden="true"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={c.profile.avatar} alt="" className="h-7 w-7 rounded-full object-cover ring-2 ring-fuchsia-400/60" draggable={false} />
      <span className="font-hud text-xs font-semibold tracking-wide text-ink">{c.profile.fullName}</span>
    </div>
  );
}
