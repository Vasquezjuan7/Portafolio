"use client";

import { useEffect, useRef } from "react";

/** Cursor personalizado con anillo, etiquetas ([data-cursor]) y botones magnéticos (.magnetic). */
export default function Cursor() {
  const dot = useRef<HTMLDivElement | null>(null);
  const ring = useRef<HTMLDivElement | null>(null);
  const label = useRef<HTMLSpanElement | null>(null);
  const layer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const html = document.documentElement;
    html.classList.add("has-cursor");

    const pos = { x: -100, y: -100, rx: -100, ry: -100 };
    let raf = 0;
    let magnet: HTMLElement | null = null;

    const loop = () => {
      pos.rx += (pos.x - pos.rx) * 0.18;
      pos.ry += (pos.y - pos.ry) * 0.18;
      if (dot.current) dot.current.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
      if (ring.current) ring.current.style.transform = `translate(${pos.rx}px, ${pos.ry}px)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onMove = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      const target = e.target as HTMLElement | null;
      const m = target?.closest?.<HTMLElement>(".magnetic") ?? null;
      if (magnet && magnet !== m) magnet.style.transform = "";
      magnet = m;
      if (m && html.getAttribute("data-fx") !== "off") {
        const r = m.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        m.style.transform = `translate(${dx * 0.25}px, ${dy * 0.35}px)`;
      }
    };

    const onOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      const labelled = target?.closest?.<HTMLElement>("[data-cursor]");
      const interactive = target?.closest?.("a, button, [role='button'], input, textarea, label");
      const r = ring.current;
      if (!r) return;
      r.dataset.state = labelled ? "label" : interactive ? "hover" : "";
      if (label.current) label.current.textContent = labelled?.dataset.cursor ?? "";
    };

    const onDown = (e: PointerEvent) => {
      ring.current?.setAttribute("data-down", "1");
      const host = layer.current;
      if (!host || html.getAttribute("data-fx") === "off") return;
      // Ráfaga de chispas en el punto del clic.
      for (let i = 0; i < 12; i++) {
        const a = (Math.PI * 2 * i) / 12 + Math.random() * 0.4;
        const d = 30 + Math.random() * 40;
        const sp = document.createElement("span");
        sp.className = "spark";
        sp.style.left = `${e.clientX}px`;
        sp.style.top = `${e.clientY}px`;
        sp.style.setProperty("--dx", `${Math.cos(a) * d}px`);
        sp.style.setProperty("--dy", `${Math.sin(a) * d}px`);
        host.appendChild(sp);
        setTimeout(() => sp.remove(), 700);
      }
    };
    const onUp = () => ring.current?.removeAttribute("data-down");
    const onLeave = () => {
      pos.x = -100;
      pos.y = -100;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      html.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={layer} className="cursor-layer" aria-hidden="true">
      <div ref={ring} className="cursor-ring">
        <span ref={label} className="cursor-label" />
      </div>
      <div ref={dot} className="cursor-dot" />
    </div>
  );
}
