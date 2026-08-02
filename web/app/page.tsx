// Design Ref: §5.1 Landing (/) — 소개 + 사용법, Apple 스타일 tile 스택

import Link from "next/link";
import { PERSONA_LABELS } from "@/types/aidev";
import type { PersonaRole } from "@/types/aidev";

const PROBLEMS = [
  {
    title: "역할 혼재",
    body: "PM/TechLead/Dev/QA/DevOps 페르소나와 GUARD 규칙으로 AI가 담당 범위를 벗어나지 않게 합니다.",
  },
  {
    title: "방향 이탈",
    body: "설계 문서 없이 구현을 시도하면 즉시 감지하고 경고합니다.",
  },
  {
    title: "컨텍스트 손실",
    body: ".aidev.json 한 파일로 팀 규칙을 다른 프로젝트에 그대로 이식합니다.",
  },
];

const WORKFLOW: { role: PersonaRole; phase: string; desc: string }[] = [
  { role: "pm", phase: "Plan", desc: "요구사항 분석, PRD, 우선순위" },
  { role: "techlead", phase: "Design", desc: "아키텍처 설계, 기술 결정, 코드 리뷰" },
  { role: "dev", phase: "Implement", desc: "설계 기반 구현, 기술 문제 해결" },
  { role: "qa", phase: "Verify", desc: "테스트 전략, 버그 탐지, 배포 승인" },
  { role: "devops", phase: "Deploy", desc: "CI/CD, 환경 설정, 배포, 모니터링" },
];

const STEPS = [
  {
    title: "프로젝트 생성",
    desc: "대시보드에서 프로젝트를 만들고 .aidev.json을 다운로드합니다.",
  },
  {
    title: "대상 프로젝트에 복사",
    desc: ".aidev.json과 .claude/ 폴더를 연동할 프로젝트 루트에 복사합니다.",
  },
  {
    title: "CLAUDE.md에 스니펫 추가",
    desc: "대상 프로젝트 CLAUDE.md 최상단에 연동 스니펫을 붙여넣습니다.",
  },
  {
    title: "페르소나 활성화",
    desc: "Claude Code 세션에서 /activate-persona로 역할을 시작합니다.",
  },
];

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-parchment">
        <div className="max-w-3xl mx-auto px-4 py-20 md:py-24 text-center">
          <p className="text-caption-strong text-primary mb-3">AI DEV TEAM</p>
          <h1 className="text-display-lg text-ink">
            역할을 지키는 AI 개발팀
          </h1>
          <p className="text-lead text-ink-muted-80 mt-4">
            PM → TechLead → Dev → QA → DevOps. 페르소나가 역할을 지키고,
            설계 없는 구현을 막습니다.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              href="/dashboard"
              className="px-[22px] py-[11px] bg-primary text-white text-body rounded-full hover:bg-primary/90 active:scale-95 transition-all"
            >
              대시보드로 이동
            </Link>
            <a
              href="#how-it-works"
              className="px-[22px] py-[11px] text-primary text-body border border-primary rounded-full hover:bg-primary/5 active:scale-95 transition-all"
            >
              사용법 보기
            </a>
          </div>
        </div>
      </section>

      {/* Problems */}
      <section className="bg-tile-1">
        <div className="max-w-5xl mx-auto px-4 py-20 md:py-24">
          <h2 className="text-display-md text-white text-center">
            AI와 협업할 때 생기는 세 가지 문제
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {PROBLEMS.map((p) => (
              <div key={p.title}>
                <h3 className="text-tagline text-white">{p.title}</h3>
                <p className="text-caption text-body-muted mt-2 leading-relaxed">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Personas */}
      <section className="bg-canvas">
        <div className="max-w-5xl mx-auto px-4 py-20 md:py-24">
          <h2 className="text-display-md text-ink text-center">다섯 가지 페르소나</h2>
          <p className="text-caption text-ink-muted-48 text-center mt-2">
            각 페르소나는 ROLE(역할 선언) · SCOPE(담당 범위) · GUARD(역할 가드) 3-파트로 정의됩니다.
          </p>
          <div className="mt-12 flex flex-col md:flex-row items-stretch gap-3">
            {WORKFLOW.map((w, i) => (
              <div key={w.role} className="flex items-center gap-3 flex-1">
                <div className="flex-1 bg-canvas border border-hairline rounded-lg p-5">
                  <p className="text-xs font-semibold text-primary">{w.phase}</p>
                  <h3 className="text-tagline text-ink mt-1">{PERSONA_LABELS[w.role]}</h3>
                  <p className="text-xs text-ink-muted-48 mt-2 leading-relaxed">{w.desc}</p>
                </div>
                {i < WORKFLOW.length - 1 && (
                  <span className="hidden md:block text-ink-muted-48 shrink-0">→</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-tile-1 scroll-mt-11">
        <div className="max-w-3xl mx-auto px-4 py-20 md:py-24">
          <h2 className="text-display-md text-white text-center">4단계로 연동하기</h2>
          <ol className="mt-12 space-y-8">
            {STEPS.map((step, i) => (
              <li key={step.title} className="flex gap-4">
                <div className="shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                  {i + 1}
                </div>
                <div>
                  <p className="text-body-strong text-white">{step.title}</p>
                  <p className="text-caption text-body-muted mt-0.5">{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-parchment">
        <div className="max-w-3xl mx-auto px-4 py-20 md:py-24 text-center">
          <h2 className="text-display-md text-ink">지금 바로 시작하세요</h2>
          <p className="text-caption text-ink-muted-48 mt-2">
            첫 프로젝트를 만들고 5분 안에 연동을 마칠 수 있습니다.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              href="/projects/new"
              className="px-[22px] py-[11px] bg-primary text-white text-body rounded-full hover:bg-primary/90 active:scale-95 transition-all"
            >
              프로젝트 생성하기
            </Link>
            <Link
              href="/personas"
              className="px-[22px] py-[11px] text-primary text-body border border-primary rounded-full hover:bg-primary/5 active:scale-95 transition-all"
            >
              페르소나 둘러보기
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
