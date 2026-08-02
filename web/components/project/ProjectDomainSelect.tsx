"use client";

import { useState, useTransition } from "react";
import { setProjectDomains } from "@/app/actions";
import { DOMAINS } from "@/types/aidev";

interface Props {
  projectId: string;
  domains: string[];
}

export function ProjectDomainSelect({ projectId, domains: initial }: Props) {
  const [selected, setSelected] = useState(new Set(initial));
  const [isPending, startTransition] = useTransition();

  function toggle(domain: string) {
    const next = new Set(selected);
    if (next.has(domain)) next.delete(domain);
    else next.add(domain);
    setSelected(next);
    startTransition(() => {
      setProjectDomains(projectId, Array.from(next));
    });
  }

  return (
    <div className="space-y-2">
      {Object.entries(DOMAINS).map(([key, { label, description }]) => {
        const isSelected = selected.has(key);
        return (
          <label
            key={key}
            className={`flex items-start gap-3 p-3 rounded-md border cursor-pointer transition-colors ${
              isSelected
                ? "border-primary bg-primary/5"
                : "border-hairline hover:border-ink-muted-48"
            }`}
          >
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => toggle(key)}
              disabled={isPending}
              className="mt-0.5 accent-primary"
            />
            <div>
              <p className={`text-caption font-medium ${isSelected ? "text-primary" : "text-ink"}`}>
                {label}
              </p>
              <p className="text-xs text-ink-muted-48 mt-0.5">{description}</p>
            </div>
          </label>
        );
      })}
      {isPending && <p className="text-xs text-ink-muted-48 pt-1">저장 중...</p>}
    </div>
  );
}
