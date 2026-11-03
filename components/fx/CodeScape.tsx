"use client";

import { useEffect, useRef } from "react";
import { CHAPTER_IDS, type ChapterId } from "../../data/portfolio";

/**
 * Fondo global de programación (Canvas 2D):
 *  - Un símbolo de código formado por partículas que se transforma en cada sección.
 *  - Un cursor de terminal que parpadea junto al símbolo.
 *  - Fragmentos de código flotando con parallax al hacer scroll.
 * Las partículas se apartan del ratón. Con los efectos desactivados se dibuja estático.
 * En el tema claro ([data-theme="light"]) dibuja en morado oscuro sobre blanco.
 */

// Símbolo y pose de cada sección: [x, y (desde el centro, fracción de pantalla), escala, opacidad]
const SCENES: Record<ChapterId, { glyph: string; pose: [number, number, number, number] }> = {
  inicio: { glyph: "</>", pose: [0.27, 0.02, 1, 1] },
  perfil: { glyph: "{ }", pose: [0.3, 0.12, 0.7, 0.32] },
  misiones: { glyph: "=>", pose: [0, -0.32, 0.85, 0.22] },
  historia: { glyph: "git", pose: [0.32, 0.06, 0.7, 0.3] },
  arena: { glyph: "fn()", pose: [-0.3, 0.02, 0.7, 0.3] },
  aliados: { glyph: "//", pose: [0.32, 0.08, 0.7, 0.32] },
  contacto: { glyph: "@", pose: [0.3, 0.05, 0.8, 0.32] },
};

const TOKENS = [
  "const", "let", "=>", "{ }", "[ ]", "</>", "async", "await", "return", "import", "export", "type", "interface",
  "useState()", "useEffect()", ".map()", ".filter()", "npm run dev", "git commit", "git push", "console.log()",
  "fn()", "if (ok)", "else", "while", "for", "try", "catch", "null", "true", "false", "0x1F", "1010", "&&", "||",
  "===", "!==", "<div>", "</div>", "SELECT *", "JSON", "API", "HTTP 200", "#!/bin/bash", "λ", "∑", "// TODO", "/* */", ";",
];

const MONO_FONT = '"JetBrains Mono", ui-monospace, Consolas, monospace';
const RAIN_CHARS = "01{}[]<>/=;:$#*+-λ&|!?".split("");

/** Manchas de color que se desplazan lentamente: [x, y, velocidad x, velocidad y, fase, color oscuro, color claro] */
const AURORAS: [number, number, number, number, number, string, string][] = [
  [0.2, 0.25, 0.11, 0.07, 0, "124,58,237", "196,181,253"],
  [0.8, 0.7, 0.08, 0.12, 2, "192,38,211", "245,208,254"],
  [0.55, 0.15, 0.06, 0.09, 4, "67,56,202", "199,210,254"],
];

const SAMPLE_W = 640;
const SAMPLE_H = 420;

type Pt = { x: number; y: number; t: number };
type Glyph = { pts: Pt[]; maxX: number; minY: number; maxY: number };

/** Dibuja el texto fuera de pantalla y devuelve n puntos normalizados que lo rellenan. */
function sampleGlyph(text: string, n: number): Glyph {
  const cv = document.createElement("canvas");
  cv.width = SAMPLE_W;
  cv.height = SAMPLE_H;
  const ctx = cv.getContext("2d", { willReadFrequently: true })!;
  let size = 300;
  ctx.font = `700 ${size}px ${MONO_FONT}`;
  const w = ctx.measureText(text).width;
  size = Math.min(size * ((SAMPLE_W * 0.92) / Math.max(1, w)), SAMPLE_H * 0.85);
  ctx.font = `700 ${size}px ${MONO_FONT}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#fff";
  ctx.fillText(text, SAMPLE_W / 2, SAMPLE_H / 2);

  const data = ctx.getImageData(0, 0, SAMPLE_W, SAMPLE_H).data;
  const found: Pt[] = [];
  const step = 3;
  for (let y = 0; y < SAMPLE_H; y += step) {
    for (let x = 0; x < SAMPLE_W; x += step) {
      if (data[(y * SAMPLE_W + x) * 4 + 3] > 140) {
        found.push({ x: x / SAMPLE_W - 0.5, y: (y - SAMPLE_H / 2) / SAMPLE_W, t: x / SAMPLE_W });
      }
    }
  }
  // Barajar y repetir (con un pequeño desvío) hasta tener exactamente n puntos.
  for (let i = found.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [found[i], found[j]] = [found[j], found[i]];
  }
  const pts: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const p = found[i % Math.max(1, found.length)] ?? { x: 0, y: 0, t: 0.5 };
    // Pequeño desvío para que no se note la rejilla del muestreo.
    const jitter = (step / SAMPLE_W) * (i >= found.length ? 1.6 : 1.1);
    pts.push({ x: p.x + (Math.random() - 0.5) * jitter, y: p.y + (Math.random() - 0.5) * jitter, t: p.t });
  }
  let maxX = -1;
  let minY = 1;
  let maxY = -1;
  for (const p of found) {
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }
  return { pts, maxX, minY, maxY };
}

export default function CodeScape() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const html = document.documentElement;

    let w = 0;
    let h = 0;
    let n = 0;
    let glyphs = {} as Record<ChapterId, Glyph>;
    let px = new Float32Array(0);
    let py = new Float32Array(0);
    let vx = new Float32Array(0);
    let vy = new Float32Array(0);
    let tokens: { text: string; x: number; y: number; size: number; depth: number; speed: number; phase: number }[] = [];
    let rain: { x: number; y: number; speed: number; len: number; size: number; chars: string[] }[] = [];
    let tops: number[] = [];
    let scene: ChapterId = "inicio";
    const pose = [...SCENES.inicio.pose];
    const mouse = { x: -9999, y: -9999 };
    let raf = 0;
    let last = performance.now();
    let time = 0;

    const animated = () => html.getAttribute("data-fx") !== "off";
    const light = () => html.getAttribute("data-theme") === "light";

    const measure = () => {
      tops = CHAPTER_IDS.map((id) => {
        const el = document.getElementById(id);
        return el ? el.getBoundingClientRect().top + window.scrollY : 0;
      });
    };

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = w < 768 ? 900 : 1700;
      if (count !== n) {
        n = count;
        px = new Float32Array(n);
        py = new Float32Array(n);
        vx = new Float32Array(n);
        vy = new Float32Array(n);
        for (let i = 0; i < n; i++) {
          px[i] = Math.random() * w;
          py[i] = Math.random() * h;
        }
      }
      glyphs = Object.fromEntries(CHAPTER_IDS.map((id) => [id, sampleGlyph(SCENES[id].glyph, n)])) as Record<ChapterId, Glyph>;

      const tokenCount = Math.round(Math.min(60, (w * h) / 26000));
      tokens = Array.from({ length: tokenCount }, () => {
        const depth = Math.random();
        return {
          text: TOKENS[Math.floor(Math.random() * TOKENS.length)],
          x: Math.random() * w,
          y: Math.random() * h,
          size: 10 + depth * 9,
          depth,
          speed: 4 + depth * 10,
          phase: Math.random() * Math.PI * 2,
        };
      });
      // Columnas de "lluvia de código"
      const cols = Math.round(Math.min(18, w / 85));
      rain = Array.from({ length: cols }, (_, i) => {
        const size = 12 + Math.random() * 4;
        return {
          x: ((i + Math.random() * 0.8) / cols) * w,
          y: Math.random() * h * 1.5 - h * 0.5,
          speed: 40 + Math.random() * 90,
          len: 8 + Math.floor(Math.random() * 12),
          size,
          chars: Array.from({ length: 22 }, () => RAIN_CHARS[Math.floor(Math.random() * RAIN_CHARS.length)]),
        };
      });
      measure();
    };

    /** Sección en el centro de la pantalla. */
    const currentScene = (): ChapterId => {
      const center = window.scrollY + h * 0.5;
      let i = 0;
      while (i < tops.length - 1 && center >= tops[i + 1]) i++;
      return CHAPTER_IDS[i];
    };

    const frame = (now: number) => {
      const anim = animated();
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (anim) time += dt;
      const isLight = light();
      const narrow = w < 900;

      // Cambio de escena: las partículas salen disparadas y se recomponen.
      const next = currentScene();
      if (next !== scene) {
        scene = next;
        if (anim) {
          for (let i = 0; i < n; i++) {
            vx[i] += (Math.random() - 0.5) * 14;
            vy[i] += (Math.random() - 0.5) * 14;
          }
        }
      }
      const target = SCENES[scene].pose;
      for (let k = 0; k < 4; k++) pose[k] += (target[k] - pose[k]) * (anim ? 0.05 : 1);

      // El símbolo "respira" y flota suavemente.
      const breath = anim ? 1 + Math.sin(time * 1.1) * 0.03 : 1;
      const box = Math.min(w * (narrow ? 0.8 : 0.42), h * 0.8) * pose[2] * breath;
      const cx = w / 2 + (narrow ? pose[0] * 0.25 : pose[0]) * w + (anim ? Math.sin(time * 0.45) * 10 : 0);
      const cy = h / 2 + pose[1] * h + (anim ? Math.sin(time * 0.7) * 12 : 0);
      const alpha = pose[3] * (narrow ? 0.55 : 1);
      const baseAlpha = alpha;
      const g = glyphs[scene];

      ctx.clearRect(0, 0, w, h);
      const scroll = window.scrollY;

      // --- Auroras: manchas de color que se mueven despacio ---
      const R = Math.max(w, h) * 0.55;
      for (const [ax, ay, sx, sy, ph, dark, lite] of AURORAS) {
        const x = (ax + Math.sin(time * sx + ph) * 0.22) * w;
        const y = (ay + Math.cos(time * sy + ph) * 0.2) * h;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, R);
        grad.addColorStop(0, isLight ? `rgba(${lite},0.45)` : `rgba(${dark},0.2)`);
        grad.addColorStop(1, isLight ? `rgba(${lite},0)` : `rgba(${dark},0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }

      // --- Suelo de rejilla en perspectiva que avanza hacia la pantalla ---
      const horizon = h * 0.62;
      const floorH = h - horizon;
      ctx.lineWidth = 1;
      const gridRGB = isLight ? "109,40,217" : "167,139,250";
      const shift = anim ? (time * 0.35) % 1 : 0;
      for (let i = 0; i < 14; i++) {
        const z = (i + shift) / 14; // 0 = horizonte, 1 = borde inferior
        const y = horizon + floorH * z * z;
        ctx.strokeStyle = `rgba(${gridRGB},${(isLight ? 0.16 : 0.13) * z})`;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      for (let i = -12; i <= 12; i++) {
        const xb = w / 2 + (i / 12) * w * 1.3;
        const grad = ctx.createLinearGradient(0, horizon, 0, h);
        grad.addColorStop(0, `rgba(${gridRGB},0)`);
        grad.addColorStop(1, `rgba(${gridRGB},${isLight ? 0.16 : 0.12})`);
        ctx.strokeStyle = grad;
        ctx.beginPath();
        ctx.moveTo(w / 2 + (i / 12) * w * 0.08, horizon);
        ctx.lineTo(xb, h);
        ctx.stroke();
      }

      // --- Lluvia de código ---
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      for (const col of rain) {
        if (anim) {
          col.y += col.speed * dt;
          if (col.y - col.len * col.size > h) {
            col.y = -Math.random() * h * 0.5;
            col.speed = 40 + Math.random() * 90;
          }
          if (Math.random() < 0.08) col.chars[Math.floor(Math.random() * col.chars.length)] = RAIN_CHARS[Math.floor(Math.random() * RAIN_CHARS.length)];
        }
        ctx.font = `500 ${col.size}px ${MONO_FONT}`;
        for (let k = 0; k < col.len; k++) {
          const y = col.y - k * col.size * 1.15;
          if (y < -20 || y > h + 20) continue;
          const fade = 1 - k / col.len;
          const a = k === 0 ? (isLight ? 0.55 : 0.6) : (isLight ? 0.22 : 0.2) * fade;
          ctx.fillStyle = k === 0 ? (isLight ? `rgba(192,38,211,${a})` : `rgba(240,171,252,${a})`) : isLight ? `rgba(109,40,217,${a})` : `rgba(167,139,250,${a})`;
          ctx.fillText(col.chars[k % col.chars.length], col.x, y);
        }
      }
      ctx.textAlign = "start";

      // --- Código flotante de fondo ---
      ctx.textBaseline = "middle";
      for (const tk of tokens) {
        if (anim) {
          tk.y -= tk.speed * dt;
          if (tk.y < -30) {
            tk.y = h + 30;
            tk.x = Math.random() * w;
            tk.text = TOKENS[Math.floor(Math.random() * TOKENS.length)];
          }
        }
        const y = (((tk.y - scroll * (0.05 + tk.depth * 0.2)) % (h + 60)) + h + 60) % (h + 60) - 30;
        const tw = anim ? 0.6 + 0.4 * Math.sin(time * 1.3 + tk.phase) : 0.8;
        const a = (0.05 + tk.depth * 0.13) * tw;
        ctx.font = `500 ${tk.size}px ${MONO_FONT}`;
        ctx.fillStyle = isLight ? `rgba(109,40,217,${a * 0.9})` : `rgba(196,181,253,${a})`;
        ctx.fillText(tk.text, tk.x, y);
      }

      // --- Halo detrás del símbolo ---
      const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, box * 0.75);
      halo.addColorStop(0, isLight ? `rgba(167,139,250,${0.3 * alpha})` : `rgba(139,92,246,${0.28 * alpha})`);
      halo.addColorStop(0.5, isLight ? `rgba(232,121,249,${0.1 * alpha})` : `rgba(217,70,239,${0.08 * alpha})`);
      halo.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = halo;
      ctx.fillRect(cx - box, cy - box, box * 2, box * 2);

      // --- Partículas del símbolo ---
      const wave = anim ? time * 1.6 : 0;
      const bands = 6;
      const buckets: number[][] = Array.from({ length: bands }, () => []);
      for (let i = 0; i < n; i++) {
        const p = g.pts[i];
        const tx = cx + p.x * box + (anim ? Math.sin(wave + p.y * 18) * 1.5 : 0);
        const ty = cy + p.y * box + (anim ? Math.cos(wave + p.x * 14) * 1.5 : 0);
        if (anim) {
          const dx = px[i] - mouse.x;
          const dy = py[i] - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 9000) {
            const f = (1 - d2 / 9000) * 2.2;
            const d = Math.sqrt(d2) || 1;
            vx[i] += (dx / d) * f;
            vy[i] += (dy / d) * f;
          }
          vx[i] = (vx[i] + (tx - px[i]) * 0.035) * 0.86;
          vy[i] = (vy[i] + (ty - py[i]) * 0.035) * 0.86;
          px[i] += vx[i];
          py[i] += vy[i];
        } else {
          px[i] = tx;
          py[i] = ty;
          vx[i] = 0;
          vy[i] = 0;
        }
        buckets[Math.min(bands - 1, Math.floor(p.t * bands))].push(i);
      }
      // Sobre fondo oscuro las partículas suman luz; sobre blanco se pintan normal.
      ctx.globalCompositeOperation = isLight ? "source-over" : "lighter";
      const s = narrow ? 1.6 : 1.9;
      for (let b = 0; b < bands; b++) {
        const k = b / (bands - 1);
        // Destello que recorre el símbolo de izquierda a derecha.
        const shine = anim ? 0.7 + 0.3 * Math.sin(time * 2.4 - b * 0.9) : 1;
        const alpha = baseAlpha * shine;
        if (isLight) {
          // Morado profundo → fucsia
          const r = Math.round(109 + (192 - 109) * k);
          const gg = Math.round(40 + (38 - 40) * k);
          const bl = Math.round(217 + (211 - 217) * k);
          ctx.fillStyle = `rgba(${r},${gg},${bl},${0.8 * alpha})`;
        } else {
          // Violeta → fucsia
          const r = Math.round(139 + (217 - 139) * k);
          const gg = Math.round(92 + (70 - 92) * k);
          const bl = Math.round(246 + (239 - 246) * k);
          ctx.fillStyle = `rgba(${r},${gg},${bl},${0.85 * alpha})`;
        }
        for (const i of buckets[b]) ctx.fillRect(px[i] - s / 2, py[i] - s / 2, s, s);
      }
      ctx.globalCompositeOperation = "source-over";

      // --- Cursor de terminal parpadeante ---
      const blink = anim ? Math.floor(time * 1.8) % 2 === 0 : true;
      if (blink && g) {
        const height = Math.min((g.maxY - g.minY) * box, box * 0.3);
        const caretW = Math.max(3, box * 0.03);
        const caretX = Math.min(cx + g.maxX * box + box * 0.04, w - (narrow ? 24 : 90) - caretW);
        const top = cy + g.maxY * box - height;
        ctx.fillStyle = isLight ? `rgba(192,38,211,${0.75 * alpha})` : `rgba(240,171,252,${0.75 * alpha})`;
        ctx.fillRect(caretX, top, caretW, height);
      }

      raf = anim ? requestAnimationFrame(frame) : 0;
    };

    const start = () => {
      cancelAnimationFrame(raf);
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    build();
    start();
    // Cuando cargan las fuentes, el símbolo se vuelve a muestrear con la tipografía correcta.
    void document.fonts?.ready.then(() => {
      build();
      start();
    });

    const onResize = () => {
      build();
      start();
    };
    const onScroll = () => {
      if (!animated() && !raf) raf = requestAnimationFrame(frame);
    };
    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else start();
    };
    const attrObserver = new MutationObserver(start);
    attrObserver.observe(html, { attributes: true, attributeFilter: ["data-fx", "data-theme"] });
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      attrObserver.disconnect();
      ro.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="codescape-bg pointer-events-none fixed inset-0 z-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
