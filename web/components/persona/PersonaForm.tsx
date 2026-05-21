// Design Ref: §5.3 PersonaForm — 3-파트 편집기 + canDo/cannotDo 태그 입력

"use client";

import type { PersonaRecord, PersonaRole } from "@/types/aidev";
import { PERSONA_LABELS } from "@/types/aidev";
import { SystemPromptEditor } from "./SystemPromptEditor";

const ROLES = Object.entries(PERSONA_LABELS) as [PersonaRole, string][];

interface Props {
  defaultValues?: Partial<PersonaRecord>;
  action: (formData: FormData) => Promise<void>;
  submitLabel?: string;
}

export function PersonaForm({ defaultValues, action, submitLabel = "저장" }: Props) {
  return (
    <form action={action} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
            역할 <span className="text-red-500">*</span>
          </label>
          <select
            id="role"
            name="role"
            required
            defaultValue={defaultValues?.role ?? "dev"}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white"
          >
            {ROLES.map(([value, label]) => (
              <option key={value} value={value}>
                {value} — {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
            표시 이름 <span className="text-red-500">*</span>
          </label>
          <input
            id="displayName"
            name="displayName"
            type="text"
            required
            defaultValue={defaultValues?.displayName}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Senior Developer"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          시스템 프롬프트 <span className="text-red-500">*</span>
        </label>
        <SystemPromptEditor defaultValue={defaultValues?.systemPrompt} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="canDo" className="block text-sm font-medium text-gray-700 mb-1">
            할 수 있는 것 (줄바꿈으로 구분)
          </label>
          <textarea
            id="canDo"
            name="canDo"
            rows={5}
            defaultValue={defaultValues?.canDo?.join("\n")}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-black resize-y"
            placeholder={"설계 문서 기반 구현\n코드 리뷰 수행\n기술 부채 해결"}
          />
        </div>

        <div>
          <label htmlFor="cannotDo" className="block text-sm font-medium text-gray-700 mb-1">
            할 수 없는 것 (줄바꿈으로 구분)
          </label>
          <textarea
            id="cannotDo"
            name="cannotDo"
            rows={5}
            defaultValue={defaultValues?.cannotDo?.join("\n")}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-black resize-y"
            placeholder={"아키텍처 결정\n요구사항 변경\n배포 작업"}
          />
        </div>
      </div>

      <div>
        <label htmlFor="delegateTo" className="block text-sm font-medium text-gray-700 mb-1">
          역할 초과 시 위임 대상
        </label>
        <select
          id="delegateTo"
          name="delegateTo"
          defaultValue={defaultValues?.delegateTo ?? ""}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white"
        >
          <option value="">위임 없음</option>
          {ROLES.map(([value, label]) => (
            <option key={value} value={value}>
              {value} — {label}
            </option>
          ))}
        </select>
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
