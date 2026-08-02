// Design Ref: §5.1 /login — 로그인 페이지

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-display-md text-ink">로그인</h1>
          <p className="text-caption text-ink-muted-48 mt-2">AI Dev Team 대시보드</p>
        </div>

        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-caption-strong text-ink-muted-80 mb-1">
              이메일
            </label>
            <input
              id="email"
              type="email"
              name="email"
              required
              autoComplete="email"
              className="w-full border border-hairline rounded-md px-3 py-2 text-body text-ink focus:outline-none focus:ring-2 focus:ring-primary-focus"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-caption-strong text-ink-muted-80 mb-1">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              name="password"
              required
              autoComplete="current-password"
              className="w-full border border-hairline rounded-md px-3 py-2 text-body text-ink focus:outline-none focus:ring-2 focus:ring-primary-focus"
            />
          </div>

          <button
            type="submit"
            className="w-full py-[11px] bg-primary text-white text-body rounded-full hover:bg-primary/90 active:scale-95 transition-all"
          >
            로그인
          </button>
        </form>

        <p className="text-center text-caption text-ink-muted-48 mt-6">
          계정이 없으신가요?{" "}
          <a href="/signup" className="text-primary font-medium hover:underline">
            회원가입
          </a>
        </p>

        <div className="mt-6 rounded-md bg-blue-50 border border-blue-200 px-4 py-3 text-xs text-primary">
          bkend.ai 인증 연동 예정 (module-2 bkend.ai 계정 설정 후 활성화)
        </div>
      </div>
    </div>
  );
}
