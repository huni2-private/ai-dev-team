// Design Ref: §5.2 신규 사용자: 회원가입 → 기본 페르소나 5개 자동 생성 → 대시보드

export default function SignupPage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">회원가입</h1>
          <p className="text-sm text-gray-500 mt-2">
            가입 후 기본 페르소나 5개가 자동으로 생성됩니다.
          </p>
        </div>

        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              이메일
            </label>
            <input
              id="email"
              type="email"
              name="email"
              required
              autoComplete="email"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              name="password"
              required
              autoComplete="new-password"
              minLength={8}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            회원가입
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          이미 계정이 있으신가요?{" "}
          <a href="/login" className="text-black font-medium hover:underline">
            로그인
          </a>
        </p>

        <div className="mt-6 rounded-lg bg-blue-50 border border-blue-200 px-4 py-3 text-xs text-blue-700">
          bkend.ai 인증 연동 예정 (bkend.ai 계정 설정 후 활성화)
        </div>
      </div>
    </div>
  );
}
