"use client";

import { useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/#$%&*";

/** Texto que se "decodifica" carácter a carácter al montarse. */
export function Scramble({ text, delay = 0, className = "" }: { text: string; delay?: number; className?: string }) {
  const [out, setOut] = useState(text);
  useEffect(() => {
    if (document.documentElement.getAttribute("data-fx") === "off") return;
    let frame = 0;
    let raf = 0;
    let start: ReturnType<typeof setTimeout> | undefined;
    const total = text.length * 3 + 12;
    const run = () => {
      start = setTimeout(() => {
      const tick = () => {
        frame++;
        setOut(
          text
            .split("")
            .map((ch, i) => (ch === " " || frame > i * 3 + 12 ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
            .join(""),
        );
        if (frame < total) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      }, delay);
    };
    // Espera a que termine la intro para que el efecto se vea.
    const html = document.documentElement;
    const ready = () => html.getAttribute("data-intro") === "seen" || html.hasAttribute("data-intro-start");
    const watcher = new MutationObserver(() => {
      if (ready()) {
        watcher.disconnect();
        run();
      }
    });
    if (ready()) run();
    else watcher.observe(html, { attributes: true, attributeFilter: ["data-intro", "data-intro-start"] });
    return () => {
      watcher.disconnect();
      if (start) clearTimeout(start);
      cancelAnimationFrame(raf);
    };
  }, [text, delay]);
  return (
    <span className={className} aria-label={text}>
      <span aria-hidden="true">{out}</span>
    </span>
  );
}

/** Rota frases escribiéndolas y borrándolas. */
export function RotatingText({ items, className = "" }: { items: string[]; className?: string }) {
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const word = items[index];

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    if (!deleting && count === word.length) t = setTimeout(() => setDeleting(true), 1800);
    else if (deleting && count === 0) {
      t = setTimeout(() => {
        setDeleting(false);
        setIndex((i) => (i + 1) % items.length);
      }, 250);
    } else t = setTimeout(() => setCount((c) => c + (deleting ? -1 : 1)), deleting ? 28 : 55);
    return () => clearTimeout(t);
  }, [count, deleting, word.length, items.length]);

  return (
    <span className={className}>
      <span className="sr-only">{items.join(", ")}</span>
      <span aria-hidden="true">
        {word.slice(0, count)}
        <span className="anim-blink ml-0.5 inline-block h-[0.9em] w-[3px] translate-y-[0.1em] bg-fuchsia-400" />
      </span>
    </span>
  );
}

/** Número que cuenta hacia arriba cuando entra en pantalla. */
export function CountUp({ value, className = "" }: { value: string; className?: string }) {
  const match = /^(\d+)(.*)$/.exec(value);
  const valid = match !== null;
  const target = match ? Number(match[1]) : 0;
  const suffix = match ? match[2] : value;
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !valid) return;
    let raf = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - start) / 1400);
        setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [target, valid]);

  return (
    <span ref={ref} className={className}>
      {valid ? `${n}${suffix}` : value}
    </span>
  );
}
