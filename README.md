## 정보

NextJS와 Prisma를 사용한 포켓몬 정보 조회 웹사이트

## 구현 기능

- [x] 포켓몬 정보 홈 조회
  - [x] Data Seeding
  - [x] SSR + CSR
  - [x] Infinite Scroll
  - [x] Virtual List
- [x] 포켓몬 상세 정보 조회
- [x] 포켓몬 검색
- [x] 로그인 / 회원가입
- [ ] 소셜 로그인
- [x] 북마크
- [x] ai 포켓몬 검색

## 주요 기능

### AI 포켓몬 검색

- Gemini API의 Context Window를 활용하여 데이터베이스 내의 포켓몬 목록 중 자연어 설명에 맞는 포켓몬을 검색
- 백만 개 이상의 토큰 처리가 가능한 성능을 바탕으로, 할루시네이션(환각) 없는 정확한 검색 결과 JSON 반환
- [구현 PR 링크](https://github.com/JaeHyunLee123/pokemon-db/pull/52)

https://github.com/user-attachments/assets/65866e80-eedd-4673-93e8-288f6ca5c544

### Virtual List

- Virtual list를 직접 구현하여 렌더링 최적화
- [구현 PR 링크](https://github.com/JaeHyunLee123/pokemon-db/pull/43)

https://github.com/user-attachments/assets/4897dd58-b425-4a98-8407-d720a86f24c5

### 풀스택 Auth

- Stateless Session을 통한 풀스택 auth 구현
- [구현 PR 링크](https://github.com/JaeHyunLee123/pokemon-db/pull/41)

https://github.com/user-attachments/assets/8a0d172a-e120-45dd-9697-66a26e9fb441

## 환경 변수

```
# Connect to Supabase via connection pooling
DATABASE_URL=

# Direct connection to the database. Used for migrations
DIRECT_URL=

# Secret key to generate JWT
SESSION_SECRET_KEY =

# API key for AI pokemon search
GEMINI_API_KEY=
```

## 기술 스택

<img width="70" height="70" alt="next-icon" src="https://github.com/user-attachments/assets/12c1b435-75ed-469e-8b56-e2f9a8df3c4d" />

<img width="70" height="70" alt="ts-icon" src="https://github.com/user-attachments/assets/99827a5b-0175-4b59-8896-e40424866fb0" />

<img width="70" height="70" alt="prisma-icon" src="https://github.com/user-attachments/assets/8c037740-556a-41af-80a0-5cf4b4839099" />

<img width="70" height="70" alt="tanstack-qeury-image" src="https://github.com/user-attachments/assets/297dc4e3-c3b6-45cc-b2a9-7042bd429950" />

<img width="70" height="70" alt="tailwind-css-image" src="https://github.com/user-attachments/assets/84c49b9f-cdff-4ec9-affd-75b12f179074" />
