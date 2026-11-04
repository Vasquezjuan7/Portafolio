"use client";

import { useState } from "react";
import { ArrowUpRight, CheckCircle2, Loader2, Mail, Radio, Send } from "lucide-react";
import Chapter from "../game/Chapter";
import { useGame } from "../game/GameProvider";
import { sfx } from "../game/sfx";
import { GithubIcon, LinkedinIcon, WhatsAppIcon } from "../Icons";
import type { Dict } from "../../data/i18n";

// Opcional: crea un formulario gratuito en formspree.io y define
// NEXT_PUBLIC_FORMSPREE_ID en .env.local para recibir los mensajes por correo.
// Sin esa variable, el formulario abre el cliente de correo del visitante.
const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID;

type Field = "name" | "email" | "message";
type Status = "idle" | "sending" | "sent" | "mailto" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(values: Record<Field, string>, t: Dict) {
  const errors: Partial<Record<Field, string>> = {};
  if (values.name.trim().length < 2) errors.name = t.errName;
  if (!EMAIL_RE.test(values.email.trim())) errors.email = t.errEmail;
  if (values.message.trim().length < 10) errors.message = t.errMessage;
  return errors;
}

export default function Contact() {
  const { unlock, showBanner, c, t } = useGame();
  const { profile } = c;
  const CHANNELS = [
    { label: t.emailChannel, value: profile.email, href: `mailto:${profile.email}`, Icon: Mail, freq: "CH-01" },
    { label: "LinkedIn", value: profile.linkedinLabel, href: profile.linkedin, Icon: LinkedinIcon, freq: "CH-02" },
    { label: "GitHub", value: profile.githubLabel, href: profile.github, Icon: GithubIcon, freq: "CH-03" },
    { label: "WhatsApp", value: profile.phoneDisplay, href: profile.whatsapp, Icon: WhatsAppIcon, freq: "CH-04" },
  ];
  const [values, setValues] = useState<Record<Field, string>>({ name: "", email: "", message: "" });
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");

  const errors = validate(values, t);
  const show = (f: Field) => (touched[f] ? errors[f] : undefined);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, message: true });
    if (Object.keys(errors).length > 0) {
      sfx.fail();
      const first = (["name", "email", "message"] as Field[]).find((f) => errors[f]);
      if (first) document.getElementById(`contact-${first}`)?.focus();
      return;
    }

    sfx.click();
    if (FORMSPREE_ID) {
      setStatus("sending");
      try {
        const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(values),
        });
        if (!res.ok) throw new Error(String(res.status));
        setStatus("sent");
      } catch {
        sfx.fail();
        setStatus("error");
        return;
      }
    } else {
      const subject = encodeURIComponent(`${t.mailSubject} — ${values.name}`);
      const body = encodeURIComponent(`${values.message}\n\n— ${values.name} (${values.email})`);
      window.location.assign(`mailto:${profile.email}?subject=${subject}&body=${body}`);
      setStatus("mailto");
    }

    unlock("senal");
    void import("canvas-confetti").then(({ default: confetti }) => {
      const opts = { particleCount: 80, spread: 70, startVelocity: 45, colors: ["#8b5cf6", "#c084fc", "#e879f9", "#ffffff"] };
      confetti({ ...opts, angle: 60, origin: { x: 0, y: 0.7 } });
      confetti({ ...opts, angle: 120, origin: { x: 1, y: 0.7 } });
    });
    showBanner(t.sentBanner);
  };

  const reset = () => {
    sfx.click();
    setValues({ name: "", email: "", message: "" });
    setTouched({});
    setStatus("idle");
  };

  const input = (f: Field) =>
    `w-full rounded-xl border bg-black/30 px-4 py-3.5 text-sm text-ink outline-none backdrop-blur transition-all duration-300 placeholder:text-subtle focus:border-fuchsia-400 focus:bg-black/40 focus:shadow-[0_0_0_4px_rgb(168_85_247/0.15),0_0_30px_-8px_#a855f7] ${
      show(f) ? "border-rose-500" : "border-line"
    }`;

  return (
    <Chapter
      id="contacto"
      kicker={t.contactKicker}
      title={<>{t.contactTitle[0]}<span className="text-gradient">{t.contactTitle[1]}</span></>}
      intro={t.contactIntro}
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
        {/* Canales */}
        <div className="reveal min-w-0 space-y-3">
          {CHANNELS.map(({ label, value, href, Icon, freq }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("mailto:") ? undefined : "_blank"}
              rel="noopener noreferrer"
              onClick={() => sfx.click()}
              className="panel panel-hover group relative flex items-center gap-4 p-4"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md border border-primary/40 bg-primary/10 text-primary-ink transition-transform group-hover:scale-110">
                <Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="font-hud block text-xs font-bold tracking-[0.2em] text-subtle uppercase">{label}</span>
                <span className="block truncate font-semibold text-ink group-hover:text-primary-ink">{value}</span>
              </span>
              <span className="font-mono text-[10px] text-subtle transition-opacity group-hover:opacity-0">{freq}</span>
              <ArrowUpRight className="absolute right-4 h-5 w-5 -translate-x-2 text-fuchsia-300 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" aria-hidden="true" />
            </a>
          ))}
          <p className="flex items-center gap-2 rounded-md border border-accent/40 bg-accent/10 px-4 py-3 text-sm font-semibold text-accent-ink">
            <Radio className="h-4 w-4" aria-hidden="true" /> {profile.availability}
          </p>
        </div>

        {/* Formulario */}
        <div className="reveal panel glow-border min-w-0 p-6 sm:p-8" style={{ transitionDelay: "0.1s" }}>
          {status === "sent" || status === "mailto" ? (
            <div className="anim-pop py-10 text-center" role="status">
              <CheckCircle2 className="mx-auto h-14 w-14 text-accent-ink" aria-hidden="true" />
              <h3 className="font-display mt-4 text-3xl font-bold text-ink">{status === "sent" ? t.sentTitle : t.mailtoTitle}</h3>
              <p className="mx-auto mt-2 max-w-md text-muted">
                {status === "sent" ? t.sentText : t.mailtoText(profile.email)}
              </p>
              <button type="button" onClick={reset} className="btn btn-ghost mt-6 px-5 py-2.5 text-xs">
                {t.writeAnother}
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="space-y-5">
              <p className="font-hud text-xs font-bold tracking-[0.25em] text-primary-ink uppercase">{t.directMessage}</p>

              {(
                [
                  { f: "name", label: t.nameLabel, type: "text", placeholder: t.namePlaceholder, auto: "name" },
                  { f: "email", label: t.emailLabel, type: "email", placeholder: t.emailPlaceholder, auto: "email" },
                ] as const
              ).map(({ f, label, type, placeholder, auto }) => (
                <div key={f}>
                  <label htmlFor={`contact-${f}`} className="font-hud mb-1.5 block text-sm font-bold tracking-wider text-ink uppercase">
                    {label} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id={`contact-${f}`}
                    type={type}
                    autoComplete={auto}
                    placeholder={placeholder}
                    value={values[f]}
                    onChange={(e) => setValues({ ...values, [f]: e.target.value })}
                    onBlur={() => setTouched({ ...touched, [f]: true })}
                    aria-invalid={Boolean(show(f))}
                    aria-describedby={show(f) ? `contact-${f}-error` : undefined}
                    className={input(f)}
                  />
                  {show(f) && (
                    <p id={`contact-${f}-error`} className="mt-1.5 text-xs text-rose-500">
                      {show(f)}
                    </p>
                  )}
                </div>
              ))}

              <div>
                <label htmlFor="contact-message" className="font-hud mb-1.5 flex justify-between text-sm font-bold tracking-wider text-ink uppercase">
                  <span>
                    {t.messageLabel} <span className="text-rose-500">*</span>
                  </span>
                  <span className="font-mono text-[11px] font-normal tracking-normal text-subtle normal-case">{values.message.trim().length} / {t.min10}</span>
                </label>
                <textarea
                  id="contact-message"
                  rows={5}
                  placeholder={t.messagePlaceholder}
                  value={values.message}
                  onChange={(e) => setValues({ ...values, message: e.target.value })}
                  onBlur={() => setTouched({ ...touched, message: true })}
                  aria-invalid={Boolean(show("message"))}
                  aria-describedby={show("message") ? "contact-message-error" : undefined}
                  className={`${input("message")} resize-y`}
                />
                {show("message") && (
                  <p id="contact-message-error" className="mt-1.5 text-xs text-rose-500">
                    {show("message")}
                  </p>
                )}
              </div>

              {status === "error" && (
                <p className="rounded-md border border-rose-500/50 bg-rose-500/10 px-4 py-3 text-sm text-rose-500" role="alert">
                  {t.sendError(profile.email)}
                </p>
              )}

              <button type="submit" disabled={status === "sending"} className="btn btn-primary magnetic w-full px-6 py-4 text-sm disabled:opacity-60">
                {status === "sending" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> {t.sending}
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" aria-hidden="true" /> {t.send}
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </Chapter>
  );
}
