"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Bug, Heart, RotateCcw, Shield, Sparkles, Swords, Zap } from "lucide-react";
import Chapter from "../game/Chapter";
import { useGame } from "../game/GameProvider";
import { sfx } from "../game/sfx";
import RankIcon from "../RankIcon";
import type { SkillNode } from "../../data/portfolio";
import type { Dict } from "../../data/i18n";

/* ---------------- Árbol de técnicas ---------------- */

function SkillItem({ node }: { node: SkillNode }) {
  const { c } = useGame();
  return (
    <li className="group flex items-center gap-4 rounded-2xl border border-line bg-white/[0.02] p-3 transition-colors hover:border-fuchsia-400/40 hover:bg-fuchsia-500/[0.05]">
      <span className="grid w-10 shrink-0 place-items-center transition-transform group-hover:scale-110" title={c.rankLabels[node.rank]}>
        <RankIcon rank={node.rank} className="h-7 w-7 text-fuchsia-300" />
      </span>
      <span className="min-w-0">
        <span className="block font-semibold text-ink">{node.name}</span>
        <span className="mt-0.5 block text-xs leading-snug text-muted">{node.detail}</span>
      </span>
    </li>
  );
}

function SkillTree() {
  const { c } = useGame();
  const { skillTree } = c;
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {skillTree.map((branch, bi) => (
        <div key={branch.branch} className="reveal panel glow-border p-6" style={{ transitionDelay: `${bi * 0.12}s` }}>
          <div className="flex items-center justify-between">
            <p className="font-display flex items-center gap-3 text-xl font-semibold text-ink">
              <span className="grid h-10 w-10 place-items-center rounded-xl border border-primary/30 bg-primary/10 text-lg" aria-hidden="true">
                {branch.icon}
              </span>
              {branch.branch}
            </p>
            <span className="font-mono text-xs text-subtle">{String(bi + 1).padStart(2, "0")}</span>
          </div>
          <ul className="mt-6 space-y-2.5">
            {branch.nodes.map((n) => (
              <SkillItem key={n.name} node={n} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/* ---------------- Combate ---------------- */

/** Daño de cada ataque del bug; los nombres están en data/i18n.ts (t.intents). */
const INTENTS = [12, 18, 26, 32];

const BOSS_MAX = 200;
const ULT_COST = 60;

interface Battle {
  hp: number;
  energy: number;
  boss: number;
  shield: boolean;
  intent: number;
  busy: boolean;
  result: "playing" | "win" | "lose";
  log: string[];
  hitBoss: number;
  hitPlayer: number;
  turn: number;
}

const initialBattle = (t: Dict): Battle => ({
  hp: 100,
  energy: 30,
  boss: BOSS_MAX,
  shield: false,
  intent: 0,
  busy: false,
  result: "playing",
  log: [t.battleStart],
  hitBoss: 0,
  hitPlayer: 0,
  turn: 0,
});

const roll = (min: number, max: number) => Math.round(min + Math.random() * (max - min));

function Combat() {
  const { world, current, unlock, showBanner, c, t } = useGame();
  const { profile } = c;
  const [b, setB] = useState<Battle>(() => initialBattle(t));
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const win = useCallback(() => {
    sfx.achievement();
    unlock("cazador");
    showBanner(t.winBanner);
    void import("canvas-confetti").then(({ default: confetti }) =>
      confetti({ particleCount: 140, spread: 85, origin: { y: 0.6 }, colors: [world.primary, world.accent, "#ffffff"] }),
    );
  }, [unlock, showBanner, world, t]);

  const act = useCallback(
    (move: "attack" | "shield" | "ultimate") => {
      if (b.busy || b.result !== "playing") return;
      if (move === "ultimate" && b.energy < ULT_COST) return;

      let dmg = 0;
      let next: Battle = { ...b, busy: true, turn: b.turn + 1, hitBoss: 0, hitPlayer: 0 };
      let line = "";

      if (move === "attack") {
        sfx.attack();
        dmg = roll(22, 32);
        next = { ...next, boss: Math.max(0, b.boss - dmg), energy: Math.min(100, b.energy + 20), hitBoss: dmg };
        line = t.attackLine(dmg);
      } else if (move === "shield") {
        sfx.shield();
        next = { ...next, hp: Math.min(100, b.hp + 15), energy: Math.min(100, b.energy + 15), shield: true };
        line = t.shieldLine;
      } else {
        sfx.ultimate();
        dmg = roll(62, 78);
        next = { ...next, boss: Math.max(0, b.boss - dmg), energy: b.energy - ULT_COST, hitBoss: dmg };
        line = t.ultLine(t.ultimate, dmg);
      }

      if (next.boss <= 0) {
        setB({ ...next, busy: false, result: "win", log: [t.winLine, line, ...b.log].slice(0, 6) });
        win();
        return;
      }

      const afterPlayer: Battle = { ...next, log: [line, ...b.log].slice(0, 6) };
      setB(afterPlayer);

      // Turno del bug (mientras tanto las acciones están bloqueadas por "busy")
      timer.current = setTimeout(() => {
        const cur = afterPlayer;
        const raw = INTENTS[cur.intent] + roll(-2, 3);
        const taken = cur.shield ? Math.round(raw * 0.3) : raw;
        const hp = Math.max(0, cur.hp - taken);
        const enemyLine = t.enemyLine(t.intents[cur.intent], taken, cur.shield);
        sfx.hit();
        if (hp <= 0) {
          sfx.fail();
          showBanner({ ...t.loseBanner, tone: "fail" });
          setB({ ...cur, hp: 0, busy: false, result: "lose", shield: false, hitBoss: 0, hitPlayer: taken, log: [t.loseLine, enemyLine, ...cur.log].slice(0, 6) });
          return;
        }
        // Más peligroso a medida que pierde vida
        const pool = cur.boss < BOSS_MAX * 0.4 ? [1, 2, 3] : [0, 1, 2];
        const intentNext = pool[Math.floor(Math.random() * pool.length)];
        setB({ ...cur, hp, busy: false, shield: false, intent: intentNext, hitBoss: 0, hitPlayer: taken, log: [enemyLine, ...cur.log].slice(0, 6) });
      }, 750);
    },
    [b, win, showBanner, t],
  );

  const reset = () => {
    sfx.click();
    if (timer.current) clearTimeout(timer.current);
    setB(initialBattle(t));
  };

  // Atajos 1 / 2 / 3 cuando la arena está en pantalla
  useEffect(() => {
    if (current !== "arena") return;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
      if (e.key === "1") act("attack");
      if (e.key === "2") act("shield");
      if (e.key === "3") act("ultimate");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, act]);

  const intentName = t.intents[b.intent];
  const intentDmg = INTENTS[b.intent];
  const disabled = b.busy || b.result !== "playing";

  return (
    <div className="panel corners overflow-hidden p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
        <div>
          <h3 className="font-display text-2xl font-bold text-ink">{profile.name} {t.vsBug}</h3>
          <p className="text-sm text-muted">{t.combatIntro}</p>
        </div>
        <button type="button" onClick={reset} className="btn btn-ghost px-3 py-2 text-xs">
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> {t.restart}
        </button>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {/* Jugador */}
        <div className={`relative rounded-md border p-4 ${b.shield ? "border-accent shadow-[0_0_24px_-6px_var(--accent)]" : "border-line"} bg-surface/60`}>
          <div className="flex items-center gap-3">
            <span key={`p-${b.turn}-${b.hitPlayer}`} className={`font-display grid h-12 w-12 place-items-center rounded-md border-2 border-primary bg-primary/20 text-lg font-bold text-primary-ink ${b.hitPlayer ? "anim-shake" : ""}`}>
              {profile.initials}
            </span>
            <div>
              <p className="font-hud font-bold tracking-wider text-ink uppercase">{profile.name} · {t.player1}</p>
              <p className="font-mono text-[11px] text-subtle">{b.shield ? t.shieldActive : `LVL ${profile.level}`}</p>
            </div>
          </div>
          <div className="mt-4 space-y-2.5 font-mono text-xs">
            <div>
              <div className="mb-1 flex justify-between text-muted">
                <span className="flex items-center gap-1">
                  <Heart className="h-3.5 w-3.5 text-rose-500" aria-hidden="true" /> {t.hp}
                </span>
                <span>{b.hp} / 100</span>
              </div>
              <div className="bar h-3" role="meter" aria-label={t.playerHp} aria-valuenow={b.hp} aria-valuemin={0} aria-valuemax={100}>
                <span style={{ width: `${b.hp}%`, background: "linear-gradient(90deg,#16a34a,#4ade80)" }} />
              </div>
            </div>
            <div>
              <div className="mb-1 flex justify-between text-muted">
                <span className="flex items-center gap-1">
                  <Zap className="h-3.5 w-3.5 text-primary-ink" aria-hidden="true" /> {t.energy}
                </span>
                <span>{b.energy} / 100</span>
              </div>
              <div className="bar h-3" role="meter" aria-label={t.energy} aria-valuenow={b.energy} aria-valuemin={0} aria-valuemax={100}>
                <span style={{ width: `${b.energy}%` }} />
              </div>
            </div>
          </div>
          {b.hitPlayer > 0 && (
            <span key={`dp-${b.turn}`} className="font-display anim-rise absolute top-3 right-4 text-2xl font-bold text-rose-500">
              -{b.hitPlayer}
            </span>
          )}
        </div>

        {/* Enemigo */}
        <div className="relative rounded-md border border-rose-500/40 bg-rose-500/5 p-4">
          <div className="flex items-center gap-3">
            <span key={`b-${b.turn}-${b.hitBoss}`} className={`grid h-12 w-12 place-items-center rounded-md border-2 border-rose-500 bg-rose-500/15 text-2xl ${b.hitBoss ? "anim-shake" : "anim-float"}`} aria-hidden="true">
              👾
            </span>
            <div>
              <p className="font-hud font-bold tracking-wider text-rose-500 uppercase">{t.bossName}</p>
              <p className="font-mono text-[11px] text-subtle">{t.bossWeakness}</p>
            </div>
          </div>
          <div className="mt-4 font-mono text-xs">
            <div className="mb-1 flex justify-between text-muted">
              <span className="flex items-center gap-1">
                <Bug className="h-3.5 w-3.5 text-rose-500" aria-hidden="true" /> {t.bossHp}
              </span>
              <span>
                {b.boss} / {BOSS_MAX}
              </span>
            </div>
            <div className="bar h-3" role="meter" aria-label={t.bossHp} aria-valuenow={b.boss} aria-valuemin={0} aria-valuemax={BOSS_MAX}>
              <span style={{ width: `${(b.boss / BOSS_MAX) * 100}%`, background: "linear-gradient(90deg,#e11d48,#f59e0b)" }} />
            </div>
          </div>
          {b.result === "playing" && (
            <p className="mt-3 rounded border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-ink">
              <span className="font-hud font-bold tracking-wider text-rose-500 uppercase">{t.prepares}</span> {intentName} (~{intentDmg} {t.damage})
            </p>
          )}
          {b.hitBoss > 0 && (
            <span key={`db-${b.turn}`} className="font-display anim-rise absolute top-3 right-4 text-3xl font-bold text-amber-400">
              -{b.hitBoss}
            </span>
          )}
        </div>
      </div>

      {/* Acciones */}
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <button type="button" onClick={() => act("attack")} disabled={disabled} className="group rounded-md border border-line bg-primary/10 p-4 text-left transition-all hover:border-primary disabled:cursor-not-allowed disabled:opacity-50">
          <span className="flex items-center justify-between">
            <span className="font-hud flex items-center gap-2 font-bold tracking-wider text-ink uppercase">
              <Swords className="h-4 w-4 text-primary-ink" aria-hidden="true" /> {t.attackName}
            </span>
            <span className="kbd">1</span>
          </span>
          <span className="mt-1 block text-xs text-muted">{t.attackHint}</span>
        </button>
        <button type="button" onClick={() => act("shield")} disabled={disabled} className="group rounded-md border border-line bg-accent/10 p-4 text-left transition-all hover:border-accent disabled:cursor-not-allowed disabled:opacity-50">
          <span className="flex items-center justify-between">
            <span className="font-hud flex items-center gap-2 font-bold tracking-wider text-ink uppercase">
              <Shield className="h-4 w-4 text-accent-ink" aria-hidden="true" /> {t.shieldName}
            </span>
            <span className="kbd">2</span>
          </span>
          <span className="mt-1 block text-xs text-muted">{t.shieldHint}</span>
        </button>
        <button
          type="button"
          onClick={() => act("ultimate")}
          disabled={disabled || b.energy < ULT_COST}
          className="rounded-md border border-transparent p-4 text-left text-on-primary transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
          style={{ background: "linear-gradient(120deg, var(--primary), var(--accent))" }}
        >
          <span className="flex items-center justify-between">
            <span className="font-hud flex items-center gap-2 font-bold tracking-wider uppercase">
              <Sparkles className="h-4 w-4" aria-hidden="true" /> {t.ultName}
            </span>
            <span className="kbd">3</span>
          </span>
          <span className="mt-1 block text-xs opacity-90">
            {t.ultimate} · 62–78 · {t.costs} {ULT_COST}
          </span>
        </button>
      </div>

      {/* Registro */}
      <div className="mt-5 rounded-md border border-line bg-[#0b0814] p-4 font-mono text-xs text-slate-200" aria-live="polite">
        {b.log.map((l, i) => (
          <p key={`${b.turn}-${i}`} className={i === 0 ? "font-bold text-amber-300" : "opacity-70"}>
            <span className="text-primary-ink">&gt;</span> {l}
          </p>
        ))}
      </div>

      {b.result !== "playing" && (
        <div className="anim-pop mt-5 flex flex-wrap items-center justify-between gap-4 rounded-md border-2 p-4" style={{ borderColor: b.result === "win" ? "var(--accent)" : "#ef4444" }}>
          <p className="font-display text-xl font-bold text-ink">{b.result === "win" ? t.winResult : "💀 Game over"}</p>
          <button type="button" onClick={reset} className="btn btn-primary px-5 py-2.5 text-xs">
            <RotateCcw className="h-4 w-4" aria-hidden="true" /> {b.result === "win" ? t.playAgain : t.retry}
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------------- Sección ---------------- */

export default function Arena() {
  const { t } = useGame();
  const [tab, setTab] = useState<"tree" | "combat">("tree");

  return (
    <Chapter
      id="arena"
      kicker={t.skillsKicker}
      title={<>{t.skillsTitle[0]}<span className="text-gradient">{t.skillsTitle[1]}</span></>}
      intro={t.skillsIntro}
    >
      <div className="reveal mb-8 inline-flex rounded-lg border border-line bg-surface/60 p-1" role="tablist" aria-label={t.skillsKicker}>
        {(
          [
            ["tree", t.skillsTab],
            ["combat", t.combatTab],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => {
              sfx.click();
              setTab(id);
            }}
            className={`font-hud rounded-md px-5 py-2 text-sm font-bold tracking-wider uppercase transition-all ${
              tab === id ? "bg-primary text-on-primary" : "text-muted hover:text-ink"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div key={tab} className="anim-fade" role="tabpanel">
        {tab === "tree" ? <SkillTree /> : <Combat />}
      </div>
    </Chapter>
  );
}
