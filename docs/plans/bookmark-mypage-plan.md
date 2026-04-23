# 북마크 및 마이페이지 기능 구현 계획

## 제한 사항 반영 체크리스트 및 구현 전략

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
  - [x] `src/components/PokemonCard.tsx` 구조 변경

- [x] **2. 백엔드 계층 분리 (Repository & Service)**
  - [x] `src/repositories/bookmark-repository.ts` 생성
  - [x] `src/services/bookmark-services.ts` 생성

- [x] **3. API 연결 및 인증 검증 로직**
  - [x] 클라이언트와 통신할 API Route 작성
  - [x] 북마크 토글 및 리스트 조회 요청 처리 과정에서의 로그인 토큰/세션 검증

- [x] **4. 북마크 상태 관리 (Optimistic UI & 디바운스)**
  - [x] 북마크 처리를 담당하는 커스텀 훅 작성 (`useBookmarks`, `useToggleBookmark`, `useBookmarkAction`)
  - [x] 미로그인 사용자 접근 제어 로직 추가
  - [x] 디바운스 기술 적용
  - [x] Optimistic Updates 적용 (React Query)

- [x] **5. 마이페이지 화면 작성**
  - [x] `/src/app/mypage/page.tsx` 라우트 설정
  - [x] 서버 컴포넌트 또는 React Query를 이용한 북마크된 포켓몬 목록(`GET`) 페칭
  - [x] `PokemonCard`를 활용하여 그리드 레이아웃(Grid)의 북마크 뷰(View) 렌더링
  - [x] 북마크 내역이 없을 경우 엠프티 스테이트(Empty State) 화면 구성
