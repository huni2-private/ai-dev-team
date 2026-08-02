// 페르소나 목록 — 팀/도메인 탭 분리
import Link from "next/link";
import { db as bkend } from "@/lib/db";
import { DEFAULT_TEAM_PERSONAS, DEFAULT_DOMAIN_PERSONAS } from "@/lib/default-personas";
import { PersonaCard } from "@/components/persona/PersonaCard";
import type { PersonaRecord } from "@/types/aidev";

export default async function PersonasPage() {
  let personas: PersonaRecord[] = [];
  let isConfigured = bkend.isConfigured;

  if (isConfigured) {
    try {
      const res = await bkend.personas.list();
      personas = res.data;
    } catch {
      isConfigured = false;
    }
  }

  const now = new Date().toISOString();

  const teamPersonas: PersonaRecord[] = isConfigured
    ? personas.filter((p) => p.personaType === "team")
    : DEFAULT_TEAM_PERSONAS.map((p, i) => ({
        ...p,
        _id: `default-team-${i}`,
        createdBy: "system",
        createdAt: now,
        updatedAt: now,
      }));

  const domainPersonas: PersonaRecord[] = isConfigured
    ? personas.filter((p) => p.personaType === "domain")
    : DEFAULT_DOMAIN_PERSONAS.map((p, i) => ({
        ...p,
        _id: `default-domain-${i}`,
        createdBy: "system",
        createdAt: now,
        updatedAt: now,
      }));

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-display-md text-ink">페르소나</h1>
          <p className="text-caption text-ink-muted-48 mt-1">
            개발팀 페르소나와 도메인 이해관계자 시뮬레이터를 관리합니다.
          </p>
        </div>
        <Link
          href="/personas/new"
          className="px-[22px] py-[11px] bg-primary text-white text-body rounded-full hover:bg-primary/90 active:scale-95 transition-all"
        >
          + 페르소나 추가
        </Link>
      </div>

      {!isConfigured && (
        <div className="mb-6 rounded-md bg-amber-50 border border-amber-200 px-4 py-3 text-caption text-amber-800">
          Firebase가 설정되지 않아 기본 페르소나 템플릿을 표시합니다.
        </div>
      )}

      {/* 팀 페르소나 */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-tagline text-ink">개발팀 페르소나</h2>
          <span className="text-xs text-ink-muted-48 bg-parchment px-2 py-0.5 rounded-full">
            SDLC 워크플로우
          </span>
          <span className="text-xs text-ink-muted-48">{teamPersonas.length}개</span>
        </div>
        <p className="text-xs text-ink-muted-48 mb-4">
          PM → TechLead → Dev → QA → DevOps 순서로 개발 사이클을 담당합니다.
        </p>
        {teamPersonas.length === 0 ? (
          <div className="rounded-lg border border-dashed border-hairline p-10 text-center">
            <p className="text-ink-muted-48 text-caption">팀 페르소나가 없습니다.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {teamPersonas.map((p) => (
              <PersonaCard key={p._id} persona={p} />
            ))}
          </div>
        )}
      </section>

      {/* 도메인 페르소나 */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-tagline text-ink">도메인 페르소나</h2>
          <span className="text-xs text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">
            이해관계자 시뮬레이터
          </span>
          <span className="text-xs text-ink-muted-48">{domainPersonas.length}개</span>
        </div>
        <p className="text-xs text-ink-muted-48 mb-4">
          고객·이해관계자 관점을 AI로 시뮬레이션합니다. 기능 설계 전 "이 사람이라면 어떻게 반응할까?"를 검증하는 데 사용합니다.
        </p>
        {domainPersonas.length === 0 ? (
          <div className="rounded-lg border border-dashed border-purple-200 p-10 text-center">
            <p className="text-ink-muted-48 text-caption">도메인 페르소나가 없습니다.</p>
            <Link
              href="/personas/new"
              className="mt-4 inline-block px-[22px] py-[11px] bg-primary text-white text-body rounded-full hover:bg-primary/90 active:scale-95 transition-all"
            >
              도메인 페르소나 추가
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {domainPersonas.map((p) => (
              <PersonaCard key={p._id} persona={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
