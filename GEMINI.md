# AI 포켓몬 검색 기능 구현 계획

## 1. 프로젝트 구조 파악

현재 프로젝트는 **Next.js 15 (App Router)** 기반으로 구축되어 있으며 주요 기술 스택은 다음과 같습니다.

- **프론트엔드**: React 19, Tailwind CSS v4, Zustand (상태 관리), TanStack React Query (데이터 페칭), React Hook Form + Zod
- **백엔드 & DB**: Next.js Server (API Routes/Server Actions), Prisma ORM, PostgreSQL (Supabase)

**주요 디렉토리 구조**:

- `src/app/` : Next.js App Router 라우팅 및 페이지 구성
- `src/components/` : 재사용 가능한 UI 컴포넌트
- `src/services/` & `src/repositories/` : 비즈니스 로직 및 DB 접근 계층 (Prisma 클라이언트 사용)
- `prisma/schema.prisma` : 데이터베이스 스키마 정의 (`Pokemon`, `User`, `PokemonBookmark` 등)
- `package.json` : 의존성 관리 및 프로젝트 메타데이터

---

## 2. AI 검색 실행 계획 (아키텍처 설계)

### 최종 확정 방향: 방식 A (컨텍스트 주입 + DB 기반 AI 검색)

"AI가 사전 지식을 활용해 찾되, **오직 DB에 있는 1,000개의 포켓몬 이름 안에서만** 제안"하도록 **프롬프트 컨텍스트(Context Injection) 기법**을 사용합니다.

현재 Gemini 모델은 백만 개(1M) 이상의 토큰을 한 번에 처리할 수 있을 만큼 입력 창(Context Window)이 매우 커서, 포켓몬 1,000마리의 이름 목록(약 5,000자 내외)을 통째로 프롬프트에 넣어서 질문해도 성능과 비용에 전혀 무리가 없습니다.

- **동작 방식**:
  1.  **사전 준비**: Next.js 서버에서 DB(`Prisma`)를 조회해 현재 저장된 1,000마리의 모든 포켓몬 이름 리스트를 가져옵니다. (매번 DB 조회를 막기 위해 Redis 캐싱, 메모리 캐싱(`unstable_cache`) 또는 정적 파일로 저장하여 최적화)
  2.  **시스템 프롬프트 주입**: Gemini API 요청 시 시스템 프롬프트(지시문)에 해당 리스트를 넣어 제한합니다.
      > "사용자의 설명에 맞는 포켓몬을 최대 5개 찾아주세요. **조건: 반드시 아래 제공된 [DB 포켓몬 이름 목록]에 적힌 이름 중에서만 존재해야 하며, 띄어쓰기와 맞춤법을 목록과 정확히 일치시켜서 JSON 배열로만 반환하세요.** \n\n[DB 포켓몬 이름 목록]: 이상해씨, 이상해풀, 이상해꽃, 파이리, ... (1,000개)"
  3.  **AI 응답**: `["이상해씨", "이상해풀", "치코리타", "모부기", "잎새코"]`
  4.  **DB 조회**: `prisma.pokemon.findMany({ where: { name: { in: names } } })`
- **장점**: 개발이 간단하고, 추가 인프라(벡터 DB) 구축 없이 AI의 풍부한 성능과 DB의 정확성을 100% 매칭할 수 있습니다.
- **해결된 문제**: 번역 차이로 인한 문제, DB에 없는 세대(팔데아 등)의 포켓몬이 나오는 환각(Hallucination) 현상, 쿼리 실패 위험이 완전히 차단됩니다.

> 📝 **참고 (방식 B: 벡터 기반 RAG 검색)**
> 질문을 의미 기반(Vector)으로 변환해 DB 안에서만 유사도로 검색하는 방식입니다. 하지만 도감 내용에 '네 발' 같은 설명이 누락된 항목을 찾기 어렵다는 치명적인 한계가 있어, 포켓몬 검색에는 위에서 채택한 **컨텍스트 주입 기반의 방식 A**가 압도적으로 유리합니다.

---

## 3. 진행해야 할 일 (To-Do List)

- [x] **환경 설정**
  - `@google/generative-ai` 패키지 설치
  - `.env` 파일에 `GEMINI_API_KEY` 환경 변수 추가
- [x] **백엔드 (포켓몬 목록 정적 파일 추출 및 API 로직 개발)**
  - 포켓몬 이름 정적 파일 추출 스크립트 작성: 1회성으로 DB에서 1,000개 이름을 불러와 `src/constants/pokemonNames.json` (또는 txt) 로 저장하는 로직 작성 (DB 부하 방지)
  - Gemini AI 호출 로직 구현: 정적 파일에 저장된 전체 이름 목록과 유저의 검색어를 결합하여 **프롬프트 튜닝** 적용 (JSON 모드 활용)
  - 리턴된 JSON 이름 배열로 Prisma에서 전체 정보를 조회하여 반환 (`/api/search/ai` 형태)
- [x] **프론트엔드 (UI 컴포넌트 개발)**
  - 검색창/채팅창 UI 개발 (사용자 입력 폼, 로딩 스피너 작동)
  - 검색 결과 UI 리스트 개발 (결과가 없을 때의 처리 포함)
  - React Query 연동을 통한 비동기 상태 관리 및 결과 표시 로직

## 4. 데이터 언어 확인 (완료)

- `name`, `description`: 한국어
- `types`: 영어 문자열 배열 (`["GRASS", "POISON"]` 등)
- DB 이름과의 정확한 매칭을 위해 프롬프트로 강제 매핑 지시를 줍니다.

---

## 5. 북마크 및 마이페이지 기능 구현 계획

### 제한 사항 반영 체크리스트 및 구현 전략

1. **북마크 아이콘 (`HeartIcon.tsx`) 적용 및 수정**
   - `src/components/icons/HeartIcon.tsx`를 가져와 사용합니다.
   - 현재 하트 아이콘이 꽉 찬(fill) 형태만 지원하고 있으므로, 북마크 여부에 따라 빈 하트와 꽉 찬 하트를 토글할 수 있도록 props와 SVG `path`를 수정할 예정입니다.
2. **`PokemonCard` 컴포넌트 내 위치**
   - 포켓몬 카드 우측 상단 등 적절한 위치에 하트 아이콘을 렌더링합니다.
   - 카드 전체가 `<Link>` 태그이므로, 하트 클릭 시 상세 페이지로 이동하지 않도록 `e.preventDefault()` 및 `e.stopPropagation()` 처리를 추가합니다.
3. **로그인 상태 확인 및 토스트 메시지**
   - 사용자 인증 상태를 구독하고, 로그인하지 않은 상태에서 북마크 클릭 시 팝업/토스트 알림("로그인이 필요합니다")을 띄웁니다.
4. **백엔드 아키텍처 (Service & Repository 분리)**
   - **Repository 계층 (`src/repositories/bookmark-repository.ts`)**: Prisma를 통해 `PokemonBookmark` 테이블의 순수 데이터베이스 액션(조회, 추가, 삭제)만 수행합니다.
   - **Service 계층 (`src/services/bookmark-services.ts`)**: 유효성 검증(유저 존재여부, 중복 확인 등)과 비즈니스 로직을 처리 후 레포지토리 메서드를 호출합니다.
5. **Optimistic UI 및 디바운싱 적용**
   - **디바운싱**: 연속적인 클릭(따닥)으로 인한 API 중복 호출을 막기 위해 클라이언트 단에서 debounce 처리를 합니다.
   - **Optimistic UI**: 서버의 응답을 기다리지 않고 React Query의 `onMutate`를 이용해 화면 UI를 먼저 변경(북마크 채움/비움)하고, 실패 시 `onError`에서 이전 상태로 롤백합니다.
6. **마이페이지 (북마크 목록 뷰)**
   - `/mypage` 경로(또는 `/bookmarks` 등)를 생성합니다.
   - 로그인된 유저가 북마크한 포켓몬 목록 조회 API를 통해 `PokemonCard` 리스트를 그려냅니다.

### 진행해야 할 일 (To-Do List)

- [x] **1. 프론트엔드 컴포넌트 업데이트**
  - [x] `src/components/icons/HeartIcon.tsx` 수정
    - props에 `isFilled` 혹은 `filled` 상태를 추가하여, SVG 패스를 빈 하트와 꽉 찬 하트로 분기하여 렌더링
  - [x] `src/components/PokemonCard.tsx` 구조 변경
    - 카드 내부 우측 상단(또는 하단)에 북마크 전용 버튼(또는 아이콘) 배치
    - 클릭 시의 페이지(`/pokemon/[id]`) 라우팅을 방지하기 위해 `e.preventDefault()`, `e.stopPropagation()` 처리

- [x] **2. 백엔드 계층 분리 (Repository & Service)**
  - [x] `src/repositories/bookmark-repository.ts` 생성
    - `findBookmark(userId, pokemonId)`: 단건 조회 (북마크 등록 여부 확인)
    - `createBookmark(userId, pokemonId)`: 북마크 추가
    - `deleteBookmark(userId, pokemonId)`: 북마크 취소
    - `findBookmarksByUserId(userId)`: 해당 유저의 북마크 포켓몬 목록 조회 (Join/Include 활용)
  - [x] `src/services/bookmark-services.ts` 생성
    - `toggleBookmarkService`: 유저 존재 유무 검증 뒤 북마크 유무를 판단하여 추가/삭제 레포지토리 로직 분기 실행
    - `getUserBookmarksService`: 북마크 목록을 클라이언트에 맞게 포맷팅

- [x] **3. API 연결 및 인증 검증 로직**
  - [x] 클라이언트와 통신할 API Route 작성
  - [x] 북마크 토글 및 리스트 조회 요청 처리 과정에서의 로그인 토큰/세션 검증

- [x] **4. 북마크 상태 관리 (Optimistic UI & 디바운스)**
  - [x] 북마크 처리를 담당하는 커스텀 훅 작성 (`useBookmarks`, `useToggleBookmark`, `useBookmarkAction`)
  - [x] 미로그인 사용자 접근 제어 로직 추가: 클릭 시 API 호출을 중도 차단하고 `"로그인이 필요합니다"`는 토스트(Toast) 알림 노출
  - [x] 디바운스 기술 적용: 짧은 시간 안에 연속으로 클릭(`따닥`)하는 것을 방지 (300ms 디바운스 적용)
  - [x] Optimistic Updates 적용 (React Query): API 서버 응답을 기다리지 않고 `HeartIcon` UI를 미리 채우거나 비우고, 요청 실패(`onError`) 시 이전 캐시 데이터로 롤백 수행

- [x] **5. 마이페이지 화면 작성**
  - [x] `/src/app/mypage/page.tsx` (혹은 적합한 경로) 라우트 설정
  - [x] 서버 컴포넌트 또는 React Query를 이용한 북마크된 포켓몬 목록(`GET`) 페칭
  - [x] `PokemonCard`를 활용하여 그리드 레이아웃(Grid)의 북마크 뷰(View) 렌더링
  - [x] 북마크 내역이 없을 경우 엠프티 스테이트(Empty State) 화면 구성

---

## 6. 포켓몬 스피드 퀴즈 기능 구현 계획

### 요구사항 및 규칙

스피드 퀴즈는 다음의 규칙을 따릅니다:

1. 랜덤 포켓몬 이미지를 유저에게 보여줍니다. (조건: `@src/constants/pokemonNames`에 존재하는 포켓몬만 등장해야 함)
2. 유저가 해당 포켓몬의 이름을 입력합니다.
3. 유저가 올바른 포켓몬 이름을 입력하면 **정답 처리**를 합니다.
4. 유저가 틀린 이름을 입력하거나, **5초 이내에** 이름을 입력하지 못하면 자동 **오답 처리**를 합니다.
5. 위 과정을 **총 10번 반복**한 후 오버뷰 형태의 **결과창(총점 및 내역)**을 보여줍니다.

### 구현 전략 및 세부 설계

1. **상태 관리 설계 (게임 로직)**
   - **게임 상태**: 대기(시작 전), 진행 중, 결과창
   - **게임 데이터**: 현재 라운드(1~10), 정답 횟수, 각 라운드별 제출 결과 내역
   - **타이머 상태**: 남은 시간(최대 5초)

2. **퀴즈 문제 생성 (포켓몬 랜덤 추출)**
   - `@src/constants/pokemonNames` 배열에서 중복을 피하여 랜덤으로 10마리의 포켓몬 이름을 추출합니다.
   - 추출된 이름을 바탕으로 `/api/pokemon?name=[포켓몬이름]` API를 호출하여 포켓몬 정보를 가져옵니다. 다른 쿼리 훅(예: `useAISearch.ts`)을 참고하여 동일한 형태의 **Tanstack Query 훅(`useGetPokemonByName`)**을 제작해 데이터를 매핑합니다.

3. **타이머 기능 (카운트다운 로직)**
   - 문제당 5초 카운트다운을 수행하는 `useEffect` 또는 `setInterval` 커스텀 훅 개발.
   - 시간이 0이 되면 자동으로 다음 라운드로 이동(오답 처리)하도록 구현합니다.

4. **화면 UI 구성**
   - **메인 게임 화면**:
     - 상단: 현재 라운드 표시 (`Round 3/10`), 시각적인 5초 카운트다운 프로그레스 바.
     - 중앙: 무작위 포켓몬의 공식 이미지 렌더링.
     - 하단: 포켓몬 이름을 입력할 텍스트 Input, 제출 버튼.
   - **결과 화면**:
     - 최종 맞힌 갯수 및 스코어 표시.
     - "다시 하기" 버튼 제공.

### 진행해야 할 일 (To-Do List)

- [x] **1. 포켓몬 데이터 페칭 API 훅 (`useGetPokemonByName`) 개발**
  - `/api/pokemon?name=[포켓몬이름]` API를 호출하는 Tanstack Query 커스텀 훅(`useGetPokemonByName`) 작성.
  - `useAISearch` 등 기존 프로젝트 내 API 훅의 형태와 에러 핸들링 패턴을 똑같이 참고하여 구현.
- [x] **2. 포켓몬 랜덤 추출 유틸리티 개발**
  - `@src/constants/pokemonNames`에서 10개의 고유한 포켓몬 목록을 랜덤하게 뽑아내는 함수 작성.
- [x] **3. 스피드 퀴즈 상태 관리 훅 작성 (`useSpeedQuiz`)**
  - 현재 라운드 번호 (1~10), 라운드별 정답 여부 목록, 게임 진행 상태(대기/진행/결과) 제어 로직 구현.
- [x] **4. 카운트다운 타이머 훅 개발 (`useSpeedQuizTimer`)**
  - 5초 카운트다운 로직 구현.
  - 시간 초과 시 '오답'으로 간주하고 자동으로 다음 라운드로 넘기는 통합 이벤트 발생.
- [x] **5. 스피드 퀴즈 컴포넌트 마크업 & 스타일링**
  - 타이머 프로그레스 바 UI, 포켓몬 이미지 렌더링 컴포넌트 개발.
  - 사용자 입력 폼(Input) 및 제출 버튼 UI 작성 (엔터키 제출 지원).
- [x] **6. 게임 로직 통합 (인풋 및 이벤트 처리)**
  - 정답 제출 시 맞는 이름인지 검증하는 로직 추가.
  - 첫 문제 로딩 완료 후 타이머 시작 등 비동기 데이터와 결합된 게임 흐름 완성.
- [x] **7. 최종 결과창 페이지/컴포넌트 추가 및 테스트**
  - 결과 화면에 총점 표기 및 재시작(`다시 하기`) 로직 구현.
  - 엣지 케이스 점검 (잘못된 이름, 연속 클릭, API 딜레이 등 대응).

---

## 7. 모바일 헤더 및 사이드바 구조 변경

### 요구사항 및 규칙

- 모바일 환경에서는 "포켓몬 DB" 타이틀(메인 로고)만 상단 헤더에 보이도록 유지.
- 우측 상단에 햄버거 아이콘(`lucide-react`의 `Menu` 아이콘 사용)을 두어, 클릭 시 사이드바가 나타나도록 처리.
- 데스크탑 환경(`md:` Breakpoint 이상)에서는 기존처럼 전체 메뉴 보이게 하고, 햄버거 및 사이드바는 숨김 처리.

### 진행해야 할 일 (To-Do List)

- [x] **1. `lucide-react` 아이콘 적용 및 상태 추가**
  - 메뉴 토글(사이드바 열림/닫힘) 기능에 쓰일 `useState` 훅 추가 (클라이언트 컴포넌트).
  - `Menu`, `X` (닫기) 아이콘 적용.
- [x] **2. Header 레이아웃 분리 및 Sidebar UI 추가**
  - 기존 버튼들(스피드 퀴즈, 로그인, 마이페이지 등)을 모바일에서는 숨김 처리(`hidden md:flex`).
  - Sidebar UI를 작성하여 모바일에서 햄버거 메뉴를 클릭했을 때 기능들(스피드 퀴즈, 개인정보 등)이 포함된 메뉴가 슬라이드등으로 나타나도록 반영.
  - 사이드바 바깥(dim) 클릭 시 또는 X버튼 클릭 시 메뉴 닫히는 기능.

---

## 8. 보안 취약점 수정 계획

> 📄 **참고 문서**: `docs/security-audit-2026-04-13.md`
> OWASP Top 10 기반 수동 코드 리뷰 및 적대적 데이터 흐름 분석 결과를 바탕으로 합니다.

### 🔴 Phase 1: CRITICAL — 즉시 조치 (당일)

- [ ] **C-01: 시크릿 로테이션 및 환경 변수 관리 강화**
  - `git log --all --diff-filter=A -- .env`으로 `.env` 커밋 이력 확인
  - 노출된 시크릿 전체 로테이션: Supabase DB 비밀번호, `SESSION_SECRET_KEY`, `GEMINI_API_KEY`
  - 프로덕션 환경에서는 Vercel Environment Variables 등 배포 플랫폼의 시크릿 관리 기능만 사용하도록 전환

- [ ] **C-02: Next.js 미들웨어 생성 (`src/middleware.ts`)**
  - 보호 라우트 매칭 설정 (예: `/mypage`, `/api/bookmarks/*`)
  - 유효한 세션 쿠키가 없으면 `/login`으로 리다이렉트
  - 매 요청마다 `updateSession()` 호출로 세션 슬라이딩(만료 연장) 구현
  - 보안 헤더 주입 로직 포함 (M-01과 통합)

- [ ] **C-03: AI 프롬프트 인젝션 방어**
  - `pokemon-services.ts`의 `searchByAI()` 리팩토링:
    - Gemini의 `systemInstruction` 필드를 사용하여 시스템 지시와 사용자 입력을 분리
    - 사용자 쿼리는 별도의 `user` 역할 메시지로만 전달
  - 입력 새니타이제이션: 따옴표, 제어 문자, 알려진 인젝션 패턴 제거/이스케이프
  - AI 출력 검증: 반환된 `aiNames`가 `pokemonNames`에 실제 존재하는지 사전 검증 로직 추가
  - 입력 길이 제한 (최대 200자) — H-04와 통합

### 🟠 Phase 2: HIGH — 다음 스프린트

- [ ] **H-01: 로그인 에러 메시지 통합 (사용자 열거 방지)**
  - `src/app/api/auth/login/route.ts`: `NoUserError`와 `IncorrectPasswordError`를 동일한 401 응답으로 통합
    - 응답 메시지: `"Invalid email or password"`
  - `src/hooks/api/useLogin.ts`: 프론트엔드 에러 메시지도 동일하게 통합

- [ ] **H-02: Rate Limiting 구현**
  - 인증 엔드포인트: `POST /api/auth/login` — 5회/분/IP
  - 인증 엔드포인트: `POST /api/auth/sign-up` — 5회/분/IP
  - AI 검색: `POST /api/search/ai` — 10회/분/세션
  - 구현 방식: Next.js 미들웨어 또는 `rate-limiter-flexible` 라이브러리 활용
  - 반복 실패 시 지수 백오프 또는 임시 잠금 고려

- [ ] **H-03: 북마크 API `pokemonId` 존재 여부 검증**
  - `src/services/bookmark-services.ts`의 `addBookmark()` 수정:
    - 북마크 생성 전 `pokemonRepository.findById(pokemonId)` 호출로 존재 여부 확인
    - 존재하지 않으면 `NotFoundError` throw
  - `src/app/api/bookmarks/[id]/route.ts`에서 해당 에러를 404로 핸들링

- [ ] **H-04: AI 검색 쿼리 입력 길이 검증**
  - `src/app/api/search/ai/route.ts`: Zod 스키마 검증 추가
    - `z.object({ query: z.string().min(1).max(200) })`
  - Zod 에러 시 400 응답 반환
  - (C-03 작업과 통합하여 진행 가능)

### 🟡 Phase 3: MEDIUM — 다음 스프린트

- [ ] **M-01: 보안 헤더 설정**
  - `next.config.ts`에 `headers()` 함수 추가 또는 미들웨어에서 주입:
    - `X-Frame-Options: DENY`
    - `X-Content-Type-Options: nosniff`
    - `Referrer-Policy: strict-origin-when-cross-origin`
    - `Strict-Transport-Security: max-age=31536000; includeSubDomains`
    - `Permissions-Policy` (필요한 기능만 허용)
  - (C-02 미들웨어 작업과 통합하여 진행 가능)

- [ ] **M-02: `getSession()` 에러 핸들링 수정**
  - `src/libs/session.ts`의 `getSession()` 리팩토링:
    - `decrypt` 호출을 try-catch로 감싸기
    - 세션 쿠키가 없거나(`!session`) 변조된 경우 모두 `null` 반환
    - 기존에는 변조된 쿠키에서 `VerifyFailError`가 catch 없이 throw됨

- [ ] **M-03: `SESSION_SECRET_KEY` 시작 시 검증**
  - `src/constants.ts`에서 환경 변수 미설정 시 즉시 에러 throw:
    - `if (!SESSION_SECRET_KEY) throw new Error("FATAL: SESSION_SECRET_KEY is not set")`
  - 현재는 `undefined`가 `TextEncoder`로 인코딩되어 예측 가능한 키(`"undefined"`)로 JWT 서명됨

### 🟢 Phase 4: LOW / INFO — 지속적 개선

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
