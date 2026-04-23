# 프로젝트 가이드라인 (GEMINI.md)

## 1. 프로젝트 구조

현재 프로젝트는 **Next.js 15 (App Router)** 기반으로 구축되어 있으며 주요 기술 스택은 다음과 같습니다.

- **프론트엔드**: React 19, Tailwind CSS v4, Zustand (상태 관리), TanStack React Query (데이터 페칭), React Hook Form + Zod
- **백엔드 & DB**: Next.js Server (API Routes/Server Actions), Prisma ORM, PostgreSQL (Supabase)

**주요 디렉토리 구조**:

- `src/app/` : Next.js App Router 라우팅 및 페이지 구성
- `src/components/` : 재사용 가능한 UI 컴포넌트
- `src/services/` & `src/repositories/` : 비즈니스 로직 및 DB 접근 계층 분리
- `prisma/schema.prisma` : 데이터베이스 스키마 정의 (`Pokemon`, `User`, `PokemonBookmark` 등)
- `docs/plans/` : 개발/개선 계획 문서 모음

## 2. 구현된 기능 및 계획 문서

아래는 프로젝트의 기능별 구현 계획 문서 및 완료 여부 파악입니다.

- [x] **AI 포켓몬 검색 기능** [@/docs/plans/ai-search-plan.md](./docs/plans/ai-search-plan.md)
- [x] **북마크 및 마이페이지 기능** [@/docs/plans/bookmark-mypage-plan.md](./docs/plans/bookmark-mypage-plan.md)
- [x] **포켓몬 스피드 퀴즈 기능** [@/docs/plans/speed-quiz-plan.md](./docs/plans/speed-quiz-plan.md)
- [x] **모바일 헤더 및 사이드바 구조 변경** [@/docs/plans/mobile-header-sidebar-plan.md](./docs/plans/mobile-header-sidebar-plan.md)
- [x] **보안 취약점 수정 계획** [@/docs/plans/security-audit-plan.md](./docs/plans/security-audit-plan.md)
- [ ] **PostHog 도입 및 활용 계획** [@/docs/plans/posthog-plan.md](./docs/plans/posthog-plan.md)

## 3. 코드 컨벤션 및 규칙

1. **디렉토리 / 아키텍처 패턴**
   - **계층 분리**: API 라우트나 UI 컴포넌트 내부에서 데이터베이스(Prisma) 로직을 직접 수행하지 않고 `src/services/` 와 `src/repositories/` 계층으로 역할을 철저히 분리합니다.
   - **절대 경로 사용 (사용자 전역 규칙)**: 모듈을 Import 할 때는 항상 절대 경로(`@/*` 등)를 사용합니다. 상대경로(`../../`) 사용을 지양합니다.

2. **React 및 컴포넌트 규칙**
   - **React 19 주의사항 (사용자 전역 규칙)**: `forwardRef`의 사용은 React 19에서 지원 중단 구문(Deprecated)이 되었으므로, 컴포넌트에서 순수 `ref` prop으로 바로 전달하여 사용합니다.
   - **CSS/스타일링**: Tailwind CSS v4를 메인으로 사용하며 일관성을 유지하고, 모바일 우선주의 반응형 (`lg`, `md` 기준 브레이크포인트)으로 설계합니다.

3. **상태 관리 및 비동기 처리**
   - **글로벌 상태**: `zustand`를 활용하여 가볍게 전역 상태를 캐싱/관리합니다.
   - **비동기 통신**: `TanStack React Query (v5)`를 사용해 낙관적 업데이트(Optimistic Update) 및 디바운스 적용 등 서버 요청의 상태와 UI 상태를 효과적으로 동기화합니다.

4. **보안 및 인증 정책**
   - **검증 체계**: `Zod` 및 `React Hook Form`으로 사용자 입력 유효성을 사전에 체크합니다.
   - **백엔드 보안**: 모든 AI 프롬프트와 API는 인젝션 방어, 환경변수 시크릿 로테이션 및 Next.js 미들웨어를 이용한 보안 헤더와 유저 세션 쿠키 보호를 철저하게 적용해야 합니다.
