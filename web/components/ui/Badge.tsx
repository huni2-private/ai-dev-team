// Design Ref: §5.3 컴포넌트 목록 — SDLC / 역할 배지

import { clsx } from "clsx";
import type { SdlcPhase, PersonaRole } from "@/types/aidev";

const SDLC_COLORS: Record<SdlcPhase, string> = {
  plan: "bg-blue-100 text-blue-800",
  design: "bg-purple-100 text-purple-800",
  implement: "bg-orange-100 text-orange-800",
  verify: "bg-yellow-100 text-yellow-800",
  deploy: "bg-green-100 text-green-800",
  maintain: "bg-gray-100 text-gray-700",
};

const ROLE_COLORS: Record<PersonaRole, string> = {
  pm: "bg-pink-100 text-pink-800",
  techlead: "bg-indigo-100 text-indigo-800",
  dev: "bg-cyan-100 text-cyan-800",
  qa: "bg-amber-100 text-amber-800",
  devops: "bg-emerald-100 text-emerald-800",
};

interface BadgeProps {
  variant?: "sdlc" | "role" | "default";
  value: string;
  className?: string;
}

export function Badge({ variant = "default", value, className }: BadgeProps) {
  const color =
    variant === "sdlc"
      ? (SDLC_COLORS[value as SdlcPhase] ?? "bg-gray-100 text-gray-700")
      : variant === "role"
      ? (ROLE_COLORS[value as PersonaRole] ?? "bg-gray-100 text-gray-700")
      : "bg-gray-100 text-gray-700";

  return (
    <span
      className={clsx(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
        color,
        className
      )}
    >
      {value}
    </span>
  );
}
