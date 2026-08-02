// Design Ref: §5.3 ConfigGenerator — .aidev.json 미리보기 + 다운로드

"use client";

import { useState } from "react";
import type { AiDevConfig } from "@/types/aidev";
import { configToJson, configToBlob } from "@/lib/config-generator";

interface Props {
  config: AiDevConfig;
}

export function ConfigGenerator({ config }: Props) {
  const [copied, setCopied] = useState(false);
  const json = configToJson(config);

  function handleCopy() {
    navigator.clipboard.writeText(json).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleDownload() {
    const blob = configToBlob(config);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = ".aidev.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="bg-canvas rounded-lg border border-hairline p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-caption-strong text-ink">.aidev.json 미리보기</h2>
          <p className="text-xs text-ink-muted-48 mt-0.5">
            프로젝트: {config.project.name} &middot; 팀: {config.teamPersonas.length}개 &middot; 도메인: {config.domainPersonas.length}개
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-[15px] py-2 text-button-utility border border-hairline rounded-sm hover:bg-parchment transition-colors"
          >
            {copied ? "✓ 복사됨" : "복사"}
          </button>
          <button
            onClick={handleDownload}
            className="px-[15px] py-2 text-button-utility bg-ink text-white rounded-sm hover:bg-ink/90 active:scale-95 transition-all"
          >
            다운로드
          </button>
        </div>
      </div>

      <pre className="bg-surface-black text-green-400 rounded-lg p-4 text-xs overflow-auto max-h-80 font-mono leading-relaxed">
        {json}
      </pre>
    </div>
  );
}
