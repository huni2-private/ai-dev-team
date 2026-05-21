// Design Ref: §5.1 /projects/new — 프로젝트 생성 폼

"use client";

import { useRef } from "react";
import type { ProjectRecord, SdlcPhase } from "@/types/aidev";
import { SDLC_PHASES } from "@/types/aidev";

const PHASES = Object.entries(SDLC_PHASES) as [SdlcPhase, { label: string }][];

interface Props {
  defaultValues?: Partial<ProjectRecord>;
  action: (formData: FormData) => Promise<void>;
  submitLabel?: string;
}

export function ProjectForm({ defaultValues, action, submitLabel = "생성" }: Props) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} action={action} className="space-y-5">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          프로젝트 이름 <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={defaultValues?.name}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="my-awesome-project"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          설명
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={defaultValues?.description}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-y"
          placeholder="프로젝트 목적과 범위를 간략히 설명하세요."
        />
      </div>

      <div>
        <label htmlFor="sdlcPhase" className="block text-sm font-medium text-gray-700 mb-1">
          현재 SDLC 단계 <span className="text-red-500">*</span>
        </label>
        <select
          id="sdlcPhase"
          name="sdlcPhase"
          required
          defaultValue={defaultValues?.sdlcPhase ?? "plan"}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white"
        >
          {PHASES.map(([value, meta]) => (
            <option key={value} value={value}>
              {meta.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="gitUrl" className="block text-sm font-medium text-gray-700 mb-1">
          Git URL
        </label>
        <input
          id="gitUrl"
          name="gitUrl"
          type="url"
          defaultValue={defaultValues?.gitUrl ?? ""}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="https://github.com/username/repo"
        />
      </div>

      <button
        type="submit"
        className="w-full py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
      >
        {submitLabel}
      </button>
    </form>
  );
}
