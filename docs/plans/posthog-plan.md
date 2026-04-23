# PostHog 도입 및 활용 계획

## PostHog 개요
PostHog는 제품 분석, 세션 리플레이, 기능 플래그(Feature Flags), A/B 테스트 등을 제공하는 올인원(All-in-one) 오픈소스 프로덕트 분석 플랫폼입니다. 구글 애널리틱스와 달리 사용자 행동 분석(Funnels, Paths)과 엔지니어링 오픈소스 도구(Feature Flags, Session Replay)가 결합되어 있어, 개발자가 사용자 경험을 최적화하고 에러를 추적하는 데 매우 강력합니다.

## 현재 서비스(포켓몬 DB)에 적용하면 좋은 PostHog 기능

1. **제품 분석 (Product Analytics - Funnels & Trends)**
   - **AI 검색 전환율 분석 (Funnel)**: 유저가 메인 페이지 진입 -> 검색창 클릭 -> AI 검색어 입력 -> 검색 결과 성공의 단계를 분석하여, 사용자가 어느 구간에서 이탈하는지(예: 타이핑을 하다 마는지, 검색 결과가 없어 나가는지) 파악합니다.
   - **북마크 인게이지먼트 (Trends)**: 북마크 기능(하트 아이콘 클릭)의 일별/주별 사용 빈도를 분석하여 유저들의 실질적인 참여도를 측정합니다.
   - **계정 전환율 (Funnel)**: 비로그인 유저가 북마크를 클릭하여 팝업을 본 뒤, 실제 회원가입 및 로그인으로 이어지는 과정을 추적합니다.

2. **세션 리플레이 (Session Replay)**
   - **스피드 퀴즈 UX 분석**: 유저들이 5초라는 시간 제한 내에 어떻게 반응하는지, 정답을 급하게 입력하다가 오타를 내는지, 특정 포켓몬 이미지에서 멈칫하는지 등 화면 녹화를 통해 세밀한 UX 이슈를 발견합니다.
   - **에러 발생 상황 복기**: 프론트엔드 에러 스택(Sentry 등)과 연동하거나 단독으로 사용하여 사용자에게 UI 버그나 에러 메시지가 떴을 때 유저가 실제로 어떤 조작을 했는지 시각적으로 확인합니다.

3. **기능 플래그 (Feature Flags)**
   - **AI 프롬프트/UI 점진적 배포**: 새로운 AI 프롬프트를 적용하거나, 스피드 퀴즈의 난이도를 조정할 때 전체 사용자에게 한 번에 적용하지 않고 20%의 유저에게만 먼저 노출해보고 에러가 없는지 검증합니다.

4. **사용자 식별 (Identify)**
   - 로그인한 유저의 ID를 PostHog에 매핑하여(익명 세션과 로그인 세션 병합), 특정 파워 유저(북마크를 많이 하는 유저, 스피드 퀴즈 고득점자)가 어떤 경로로 서비스를 이용하는지 상세 분석합니다.

## 진행해야 할 일 (To-Do List)

- [ ] **1. PostHog 프로젝트 셋업 및 패키지 설치**
  - PostHog 클라우드 가입 및 새 프로젝트 생성
  - `posthog-js` 패키지 설치
  - `.env`에 `NEXT_PUBLIC_POSTHOG_KEY` 및 `NEXT_PUBLIC_POSTHOG_HOST` 환경 변수 추가

- [ ] **2. Next.js App Router 초기화 (Provider 설정)**
  - `src/components/providers/PostHogProvider.tsx` 생성 및 PostHog 클라이언트 초기화 로직 작성
  - `src/app/layout.tsx`에서 전역 Provider로 감싸기
  - 서버 사이드 렌더링(SSR) 환경과 클라이언트 환경을 분리하여 안전하게 트래킹되도록 구성

- [ ] **3. 커스텀 이벤트 트래킹 구현**
  - AI 검색 요청 성공/실패 시점 이벤트 전송 (`track('ai_search_executed')`)
  - 포켓몬 북마크 토글 이벤트 전송 (`track('bookmark_toggled', { isPinned: true/false })`)
  - 스피드 퀴즈 게임 완료 시 결과 데이터 전송 (`track('speed_quiz_completed', { score: 10 })`)

- [ ] **4. 사용자 식별 (Identify) 및 속성 설정**
  - 유저 로그인 성공 시 `identify({ email, name })` 호출
  - 로그아웃 시 `reset()` 호출하여 세션 분리

- [ ] **5. 기능 플래그 (Feature Flags) 연동 (선택사항)**
  - 향후 스피드 퀴즈 모드 업데이트를 대비한 플래그 연동 로직 테스트
