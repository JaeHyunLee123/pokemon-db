# Pokemon DB API Specification

본 문서는 `src/app/api` 디렉토리 하위에 위치한 서버사이드 API 라우트들의 명세서입니다.

## 1. Authentication (`/api/auth/*`)

### 로그인

- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Description**: 사용자 로그인을 처리합니다.
- **Rate Limit**: 5 requests / 60 seconds (IP 기준)
- **Request Body** (`application/json`):
  - `email` (string, required): 이메일 주소
  - `password` (string, required): 비밀번호
- **Response**:
  - `200 OK`: 로그인 성공 (Set-Cookie로 세션 토큰 부여됨)
  - `400 Bad Request`: 입력 형식이 유효하지 않음 (Zod Error)
  - `401 Unauthorized`: 이메일이나 비밀번호가 올바르지 않음
  - `429 Too Many Requests`: 요청 한도 초과
  - `500 Server Error`: 서버 내부 오류

### 회원가입

- **URL**: `/api/auth/sign-up`
- **Method**: `POST`
- **Description**: 신규 사용자를 등록합니다.
- **Rate Limit**: 5 requests / 60 seconds (IP 기준)
- **Request Body** (`application/json`):
  - `email` (string, required): 이메일 형식
  - `password` (string, required): 비밀번호
- **Response**:
  - `201 Created`: 회원가입 성공
  - `400 Bad Request`: 입력 형식이 유효하지 않음 (Zod Error)
  - `409 Conflict`: 이미 사용 중인 이메일
  - `429 Too Many Requests`: 요청 한도 초과
  - `500 Server Error`: 서버 내부 오류

### 로그아웃

- **URL**: `/api/auth/logout`
- **Method**: `POST`
- **Description**: 현재 세션을 삭제하여 로그아웃합니다.
- **Response**:
  - `204 No Content`: 정상 처리됨
  - `500 Server Error`: 서버 내부 오류

---

## 2. User (`/api/user`)

### 유저 정보 조회

- **URL**: `/api/user`
- **Method**: `GET`
- **Auth Required**: **Yes** (Session Cookie)
- **Description**: 로그인된 사용자의 핵심 프로필 정보를 반환합니다.
- **Response**:
  - `200 OK`: `{ email: string, id: number, createdAt: Date, updatedAt: Date }`
  - `401 Unauthorized`: 세션 쿠키가 없음
  - `404 Not Found`: 존재하지 않는 사용자
  - `500 Server Error`: 서버 내부 오류

---

## 3. Pokemons (`/api/pokemon/*`)

### 포켓몬 목록 조회

- **URL**: `/api/pokemon`
- **Method**: `GET`
- **Description**: 포켓몬 도감 목록을 페이지네이션(무한 스크롤)하여 반환합니다.
- **Request Query Parameters**:
  - `cursor` (number, optional): 페이지 커서 (기본값: 1)
  - `name` (string, optional): 포켓몬 이름 검색 필터
- **Response**:
  - `200 OK`: 포켓몬 목록 및 페이지네이션 데이터
  - `500 Server Error`: 조회 실패

### 포켓몬 상세 조회

- **URL**: `/api/pokemon/[id]`
- **Method**: `GET`
- **Description**: 특정 ID를 가진 단일 포켓몬의 세부 정보를 반환합니다.
- **Path Parameters**:
  - `id` (number): 포켓몬 ID (도감 번호)
- **Response**:
  - `200 OK`: 대상 포켓몬 상세 데이터 객체
  - `500 Server Error`: 조회 실패

---

## 4. Bookmarks (`/api/bookmarks/*`)

### 북마크 목록 조회

- **URL**: `/api/bookmarks`
- **Method**: `GET`
- **Auth Required**: **Yes**
- **Description**: 현재 로그인한 유저가 북마크한 포켓몬 목록을 반환합니다.
- **Response**:
  - `200 OK`: 북마크된 `Pokemon` 배열 객체 목록
  - `401 Unauthorized`: 세션이 존재하지 않음
  - `500 Server Error`: 내부 서버 오류

### 북마크 등록 (추가)

- **URL**: `/api/bookmarks/[id]`
- **Method**: `POST`
- **Auth Required**: **Yes**
- **Description**: 특정 포켓몬을 유저의 북마크에 추가합니다.
- **Path Parameters**:
  - `id` (string): 북마크할 포켓몬 ID
- **Response**:
  - `200 OK`: `{ "isBookmarked": true }`
  - `400 Bad Request`: 올바르지 않은 ID 형식 (Not a Number)
  - `401 Unauthorized`: 세션이 존재하지 않음
  - `404 Not Found`: 등록하려는 ID의 포켓몬이 DB에 실존하지 않음
  - `500 Server Error`: 서버 내부 오류

### 북마크 취소 (삭제)

- **URL**: `/api/bookmarks/[id]`
- **Method**: `DELETE`
- **Auth Required**: **Yes**
- **Description**: 유저의 북마크에서 특정 포켓몬을 제거합니다.
- **Path Parameters**:
  - `id` (string): 북마크 삭제할 포켓몬 ID
- **Response**:
  - `200 OK`: 삭제 결과 데이터 (`{ "isBookmarked": false }` 형태)
  - `400 Bad Request`: 올바르지 않은 ID 형식 (Not a Number)
  - `401 Unauthorized`: 세션이 존재하지 않음
  - `500 Server Error`: 서버 내부 오류

---

## 5. AI Search (`/api/search/ai`)

### AI 기반 포켓몬 검색

- **URL**: `/api/search/ai`
- **Method**: `POST`
- **Description**: Google Gemini AI를 이용하여 사용자의 서술형 문장 서치에 가장 적합한 포켓몬들을 추천받아 반환합니다.
- **Rate Limit**: 10 requests / 60 seconds (IP 또는 Session 기준)
- **Request Body** (`application/json`):
  - `query` (string, 1~200자): 검색할 설명 텍스트
- **Response**:
  - `200 OK`: 추천된 포켓몬 배열 객체 (`{ pokemons: Pokemon[] }`)
  - `400 Bad Request`: `query` 필드의 누락 또는 글자 수 초과/미달 방어
  - `429 Too Many Requests`: 요청 한도 초과 (Rate Limiting)
  - `503 Service Unavailable`: AI 모델 사용량 폭주로 인한 지연 접속 불가
  - `500 Server Error`: Google API Key 미설정, 파싱 실패 등의 내부 서버 문제
