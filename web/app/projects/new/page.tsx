// Design Ref: §5.1 /projects/new — 프로젝트 생성

import { createProject } from "@/app/actions";
import { ProjectForm } from "@/components/project/ProjectForm";

export default function NewProjectPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-display-md text-ink">새 프로젝트</h1>
        <p className="text-caption text-ink-muted-48 mt-1">
          프로젝트를 생성하면 .aidev.json 연동 config를 다운로드할 수 있습니다.
        </p>
      </div>

      <div className="bg-canvas rounded-lg border border-hairline p-6">
        <ProjectForm action={createProject} submitLabel="프로젝트 생성" />
      </div>
    </div>
  );
}
