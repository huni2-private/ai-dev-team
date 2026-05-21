// Design Ref: §5.3 IntegrationGuide — 5단계 연동 가이드
// Plan SC: FR-12 연동 가이드 제공

"use client";

import { useState } from "react";
import { generateClaudeSnippet } from "@/lib/config-generator";

interface Step {
  num: number;
  title: string;
  desc: string;
  code: string | null;
  isSnippet?: boolean;
}

const STEPS: Step[] = [
  {
    num: 1,
    title: ".aidev.json 다운로드",
    desc: '위의 "다운로드" 버튼을 눌러 .aidev.json 파일을 저장합니다.',
    code: null,
  },
  {
    num: 2,
    title: "대상 프로젝트 루트에 복사",
    desc: "다운로드한 .aidev.json을 연동할 프로젝트의 루트 디렉토리에 복사합니다.",
    code: "cp .aidev.json /path/to/your-project/",
  },
  {
    num: 3,
    title: ".claude/ 폴더 복사",
    desc: "AI Dev Team 커맨드(.claude/ 폴더)를 대상 프로젝트에 복사합니다.",
    code: "cp -r /path/to/ai-dev-team/.claude/ /path/to/your-project/",
  },
  {
    num: 4,
    title: "CLAUDE.md 상단에 스니펫 추가",
    desc: "대상 프로젝트의 CLAUDE.md 최상단에 아래 내용을 추가합니다.",
    code: null,
    isSnippet: true,
  },
  {
    num: 5,
    title: "페르소나 활성화",
    desc: "Claude Code 세션을 시작하고 역할을 선택합니다.",
    code: "/activate-persona pm",
  },
];

interface Props {
  projectName: string;
}

export function IntegrationGuide({ projectName }: Props) {
  const [copiedStep, setCopiedStep] = useState<number | null>(null);
  const snippet = generateClaudeSnippet(projectName);

  function handleCopy(text: string, step: number) {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedStep(step);
      setTimeout(() => setCopiedStep(null), 2000);
    });
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-sm font-semibold text-gray-900 mb-5">5단계 연동 가이드</h2>

      <ol className="space-y-5">
        {STEPS.map((step) => {
          const codeText = step.isSnippet ? snippet : step.code;
          return (
            <li key={step.num} className="flex gap-4">
              <div className="shrink-0 w-7 h-7 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">
                {step.num}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{step.title}</p>
                <p className="text-sm text-gray-500 mt-0.5">{step.desc}</p>

                {codeText && (
                  <div className="mt-2 relative group">
                    <pre className="bg-gray-100 rounded-lg px-3 py-2 text-xs font-mono text-gray-800 overflow-auto whitespace-pre-wrap">
                      {codeText}
                    </pre>
                    <button
                      onClick={() => handleCopy(codeText, step.num)}
                      className="absolute top-1.5 right-1.5 px-2 py-1 text-xs bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      {copiedStep === step.num ? "✓" : "복사"}
                    </button>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
