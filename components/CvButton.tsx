"use client";

import { useState } from "react";
import { Download, Eye, Loader2 } from "lucide-react";
import { useGame } from "./game/GameProvider";
import { downloadCv, openCv } from "./cv";
import type { Lang } from "../data/portfolio";

/** Botón que genera el CV en PDF (descarga o vista) en el idioma actual o en el indicado. */
export default function CvButton({
  className = "",
  label,
  lang: forced,
  mode = "download",
  iconClass = "h-4 w-4",
}: {
  className?: string;
  label?: string;
  lang?: Lang;
  mode?: "download" | "view";
  iconClass?: string;
}) {
  const { lang, t, unlock } = useGame();
  const [busy, setBusy] = useState(false);
  const target = forced ?? lang;

  const run = async () => {
    if (busy) return;
    setBusy(true);
    try {
      if (mode === "view") await openCv(target);
      else await downloadCv(target);
      unlock("guardado");
    } finally {
      setBusy(false);
    }
  };

  const Icon = busy ? Loader2 : mode === "view" ? Eye : Download;
  return (
    <button type="button" onClick={run} disabled={busy} aria-busy={busy} className={className}>
      <Icon className={`${iconClass} ${busy ? "animate-spin" : ""}`} aria-hidden="true" />
      {busy ? t.generatingCv : (label ?? (mode === "view" ? t.viewCv : t.downloadCv))}
    </button>
  );
}
