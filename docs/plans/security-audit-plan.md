# 보안 취약점 수정 계획

> 📄 **참고 문서**: `docs/security-audit-2026-04-13.md`
> OWASP Top 10 기반 수동 코드 리뷰 및 적대적 데이터 흐름 분석 결과를 바탕으로 합니다.

## 🔴 Phase 1: CRITICAL — 즉시 조치 (당일)

- [x] **C-01: 시크릿 로테이션 및 환경 변수 관리 강화**
  - `git log --all --diff-filter=A -- .env`으로 `.env` 커밋 이력 확인
  - 노출된 시크릿 전체 로테이션: Supabase DB 비밀번호, `SESSION_SECRET_KEY`, `GEMINI_API_KEY`
  - 프로덕션 환경에서는 Vercel Environment Variables 등 배포 플랫폼의 시크릿 관리 기능만 사용하도록 전환

- [x] **C-02: Next.js 미들웨어 생성 (`src/middleware.ts`)**
  - 보호 라우트 매칭 설정 (예: `/mypage`, `/api/bookmarks/*`)
  - 유효한 세션 쿠키가 없으면 `/login`으로 리다이렉트
  - 매 요청마다 `updateSession()` 호출로 세션 슬라이딩(만료 연장) 구현
  - 보안 헤더 주입 로직 포함 (M-01과 통합)

- [x] **C-03: AI 프롬프트 인젝션 방어**
  - `pokemon-services.ts`의 `searchByAI()` 리팩토링:
    - Gemini의 `systemInstruction` 필드를 사용하여 시스템 지시와 사용자 입력을 분리
    - 사용자 쿼리는 별도의 `user` 역할 메시지로만 전달
  - 입력 새니타이제이션: 따옴표, 제어 문자, 알려진 인젝션 패턴 제거/이스케이프
  - AI 출력 검증: 반환된 `aiNames`가 `pokemonNames`에 실제 존재하는지 사전 검증 로직 추가
  - 입력 길이 제한 (최대 200자) — H-04와 통합

## 🟠 Phase 2: HIGH — 다음 스프린트

- [x] **H-01: 로그인 에러 메시지 통합 (사용자 열거 방지)**
  - `src/app/api/auth/login/route.ts`: `NoUserError`와 `IncorrectPasswordError`를 동일한 401 응답으로 통합
    - 응답 메시지: `"Invalid email or password"`
  - `src/hooks/api/useLogin.ts`: 프론트엔드 에러 메시지도 동일하게 통합

- [x] **H-02: Rate Limiting 구현**
  - 인증 엔드포인트: `POST /api/auth/login` — 5회/분/IP
  - 인증 엔드포인트: `POST /api/auth/sign-up` — 5회/분/IP
  - AI 검색: `POST /api/search/ai` — 10회/분/세션
  - 구현 방식: Next.js 미들웨어 또는 `rate-limiter-flexible` 라이브러리 활용
  - 반복 실패 시 지수 백오프 또는 임시 잠금 고려

- [x] **H-03: 북마크 API `pokemonId` 존재 여부 검증**
  - `src/services/bookmark-services.ts`의 `addBookmark()` 수정:
    - 북마크 생성 전 `pokemonRepository.findById(pokemonId)` 호출로 존재 여부 확인
    - 존재하지 않으면 `NotFoundError` throw
  - `src/app/api/bookmarks/[id]/route.ts`에서 해당 에러를 404로 핸들링

- [x] **H-04: AI 검색 쿼리 입력 길이 검증**
  - `src/app/api/search/ai/route.ts`: Zod 스키마 검증 추가
    - `z.object({ query: z.string().min(1).max(200) })`
  - Zod 에러 시 400 응답 반환
  - (C-03 작업과 통합하여 진행 가능)

## 🟡 Phase 3: MEDIUM — 다음 스프린트

- [x] **M-01: 보안 헤더 설정**
  - `next.config.ts`에 `headers()` 함수 추가 또는 미들웨어에서 주입:
    - `X-Frame-Options: DENY`
    - `X-Content-Type-Options: nosniff`
    - `Referrer-Policy: strict-origin-when-cross-origin`
    - `Strict-Transport-Security: max-age=31536000; includeSubDomains`
    - `Permissions-Policy` (필요한 기능만 허용)
  - (C-02 미들웨어 작업과 통합하여 진행 가능)

- [x] **M-02: `getSession()` 에러 핸들링 수정**
  - `src/libs/session.ts`의 `getSession()` 리팩토링:
    - `decrypt` 호출을 try-catch로 감싸기
    - 세션 쿠키가 없거나(`!session`) 변조된 경우 모두 `null` 반환
    - 기존에는 변조된 쿠키에서 `VerifyFailError`가 catch 없이 throw됨

- [x] **M-03: `SESSION_SECRET_KEY` 시작 시 검증**
  - `src/constants.ts`에서 환경 변수 미설정 시 즉시 에러 throw:
    - `if (!SESSION_SECRET_KEY) throw new Error("FATAL: SESSION_SECRET_KEY is not set")`
  - 현재는 `undefined`가 `TextEncoder`로 인코딩되어 예측 가능한 키(`"undefined"`)로 JWT 서명됨

## 🟢 Phase 4: LOW / INFO — 지속적 개선

- [ ] **L-01: 구조화된 로깅 도입**
  - 모든 API 라우트의 `console.error(e)`를 구조화된 로거(예: `pino`)로 교체
  - 프로덕션에서는 에러 코드와 메시지만 로깅, 전체 스택 트레이스는 제외
  - DB URI, 내부 경로 등 민감 정보 필터링

- [ ] **L-02: 세션 쿠키 `secure` 플래그 통일**
  - `src/libs/session.ts`의 `updateSession()`: `secure: true` → `secure: process.env.NODE_ENV === "production"` 으로 변경
  - `createSession()`과 동일한 조건부 로직으로 통일

- [ ] **I-01: CSRF 보호 (선택사항)**
  - 현재 `SameSite: "lax"`로 부분적 완화 중
  - 프로덕션 배포 시 CSRF 토큰 추가 또는 `SameSite: "strict"` 전환 고려

- [ ] **I-02: 의존성 취약점 스캐닝 구성**
  - `.github/dependabot.yml` 생성하여 GitHub Dependabot 알림 활성화
  - CI/CD에 `npm audit` 단계 추가
  - 정기적인 의존성 업데이트 프로세스 수립
