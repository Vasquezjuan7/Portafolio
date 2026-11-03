"use client";

import { useEffect, useRef } from "react";
import { GraduationCap, Languages, MapPin, Sparkles } from "lucide-react";
import Chapter from "../game/Chapter";
import AttributeRadar from "../fx/Radar";
import { useGame } from "../game/GameProvider";

/** Párrafo cuyas palabras se iluminan según avanza el scroll. */
function Manifesto({ text, highlights }: { text: string; highlights: string[] }) {
  const ref = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const words = Array.from(el.querySelectorAll<HTMLElement>("[data-word]"));
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.35)));
      const lit = progress * words.length;
      words.forEach((w, i) => {
        const o = Math.min(1, Math.max(0.12, lit - i + 0.12));
        w.style.opacity = String(o);
        w.style.filter = o < 0.5 ? `blur(${(0.5 - o) * 4}px)` : "none";
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [text]);

  return (
    <p ref={ref} className="font-display max-w-5xl text-[clamp(1.9rem,4.6vw,4rem)] leading-[1.1] font-semibold tracking-[-0.03em] text-ink" aria-label={text}>
      {text.split(" ").map((w, i) => {
        const highlight = highlights.includes(w);
        return (
          <span key={`${text}-${i}`} data-word aria-hidden="true" className={`inline-block transition-[opacity,filter] duration-200 ${highlight ? "text-gradient" : ""}`} style={{ opacity: 0.12 }}>
            {w}&nbsp;
          </span>
        );
      })}
    </p>
  );
}

export default function Profile() {
  const { c, t } = useGame();
  const { profile } = c;
  const data = [
    { icon: MapPin, label: t.location, value: profile.location },
    { icon: GraduationCap, label: t.education, value: `${profile.career} · ${profile.university}` },
    { icon: Languages, label: t.languages, value: profile.languages.join(" · ") },
    { icon: Sparkles, label: t.status, value: profile.availability },
  ];

  return (
    <Chapter id="perfil" kicker={t.aboutKicker} title={<>{t.aboutTitle[0]}<span className="text-gradient">{t.aboutTitle[1]}</span></>}>
      <div className="reveal">
        <Manifesto text={t.manifesto} highlights={t.manifestoHighlights} />
      </div>

      <div className="mt-20 grid gap-6 lg:grid-cols-3">
        <div className="reveal panel panel-hover p-7 lg:col-span-2">
          <div className="grid gap-7 sm:grid-cols-[minmax(0,190px)_1fr]">
            <figure className="relative mx-auto w-full max-w-[220px] sm:mx-0">
              <div className="glow-border relative aspect-[3/4] overflow-hidden rounded-2xl border border-line bg-surface">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={profile.photo} alt={profile.fullName} className="h-full w-full object-cover" loading="lazy" draggable={false} />
                <span className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[rgb(0_0_0/0.45)] to-transparent" aria-hidden="true" />
              </div>
              <figcaption className="mt-3 text-center sm:text-left">
                <span className="font-display block text-sm font-semibold text-ink">{profile.fullName}</span>
                <span className="block font-mono text-[11px] text-subtle">{profile.location}</span>
              </figcaption>
            </figure>
            <div>
              <p className="font-mono text-xs tracking-[0.3em] text-primary-ink uppercase">{t.myStory}</p>
              <div className="mt-5 space-y-4">
                {profile.bio.map((p, i) => (
                  <p key={i} className={`leading-relaxed ${i === 0 ? "text-lg text-ink" : "text-muted"}`}>
                    {p}
                  </p>
                ))}
              </div>
            </div>
          </div>
          <dl className="mt-8 grid gap-3 sm:grid-cols-2">
            {data.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3 rounded-xl border border-line bg-white/[0.02] p-3.5">
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-fuchsia-300" aria-hidden="true" />
                <div>
                  <dt className="font-mono text-[10px] tracking-wider text-subtle uppercase">{label}</dt>
                  <dd className="text-sm font-medium text-ink">{value}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>

        <div className="reveal panel glow-border flex flex-col p-7" style={{ transitionDelay: "0.1s" }}>
          <p className="font-mono text-xs tracking-[0.3em] text-primary-ink uppercase">{t.techProfile}</p>
          <div className="flex flex-1 items-center">
            <AttributeRadar />
          </div>
        </div>

        {profile.interests.map((it, i) => (
          <div key={it.label} className={`reveal panel panel-hover p-6 ${i === 0 && profile.interests.length % 3 !== 0 ? "lg:col-span-2" : ""}`} style={{ transitionDelay: `${i * 0.06}s` }}>
            <span className="grid h-12 w-12 place-items-center rounded-xl border border-primary/30 bg-primary/10 text-2xl" aria-hidden="true">
              {it.icon}
            </span>
            <p className="font-display mt-4 text-xl font-semibold text-ink">{it.label}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{it.detail}</p>
          </div>
        ))}
      </div>
    </Chapter>
  );
}
