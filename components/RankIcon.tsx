import { BookOpen, Crown, Rocket, Sprout, Wrench, type LucideIcon } from "lucide-react";
import type { SkillNode } from "../data/portfolio";

type Rank = SkillNode["rank"];

/** Símbolo de cada nivel: Aprendiz → Experto. */
export const RANK_ICONS: Record<Rank, LucideIcon> = {
  1: Sprout,
  2: BookOpen,
  3: Wrench,
  4: Rocket,
  5: Crown,
};

/** Convierte un valor 0–100 en uno de los cinco niveles. */
export function valueToRank(value: number): Rank {
  if (value >= 90) return 5;
  if (value >= 78) return 4;
  if (value >= 60) return 3;
  if (value >= 40) return 2;
  return 1;
}

export default function RankIcon({ rank, className }: { rank: Rank; className?: string }) {
  const Icon = RANK_ICONS[rank];
  return <Icon className={className} aria-hidden="true" />;
}
