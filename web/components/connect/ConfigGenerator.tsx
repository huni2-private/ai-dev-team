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
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">.aidev.json 미리보기</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            프로젝트: {config.project.name} &middot; 페르소나: {config.personas.length}개
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {copied ? "✓ 복사됨" : "복사"}
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-1.5 text-xs bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            다운로드
          </button>
        </div>
      </div>

      <pre className="bg-gray-950 text-green-400 rounded-xl p-4 text-xs overflow-auto max-h-80 font-mono leading-relaxed">
        {json}
      </pre>
    </div>
  );
}
