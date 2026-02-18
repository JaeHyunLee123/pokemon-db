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
- [ ] 북마크

## 환경 변수

```
# Connect to Supabase via connection pooling
DATABASE_URL=

# Direct connection to the database. Used for migrations
DIRECT_URL=

# Secret key to generate JWT
SESSION_SECRET_KEY =
```

# API Specification

## Authentication

### POST /api/auth/sign-up

Creates a new user account.

**Request Body:**

```
{
"email": "user@example.com",
"password": "yourpassword"
}
```

**Responses:**
| Status Code | Description |
| :---------- | :----------------------- |
| `201 Created` | User created successfully. |
| `400 Bad Request` | Invalid request body. |
| `409 Conflict` | Email already in use. |
| `500 Internal Server Error` | Server error. |

### POST /api/auth/login

Logs in a user and sets a session cookie.

**Request Body:**

```
{
"email": "user@example.com",
"password": "yourpassword"
}
```

**Responses:**

| Status Code                 | Description                |
| :-------------------------- | :------------------------- |
| `200 OK`                    | Login successful.          |
| `400 Bad Request`           | Missing email or password. |
| `401 Unauthorized`          | Incorrect password.        |
| `404 Not Found`             | User not found.            |
| `500 Internal Server Error` | Unknown server error.      |

## User

### GET /api/user

Retrieves the currently authenticated user's information based on their session.

**Responses:**

| Status Code                 | Description                 |
| :-------------------------- | :-------------------------- |
| `200 OK`                    | Returns the user object.    |
| `401 Unauthorized`          | No active session.          |
| `404 Not Found`             | User not found for session. |
| `500 Internal Server Error` | Unknown server error.       |

## Pokemon

### GET /api/pokemon

Retrieves a paginated list of Pokémon. Can be filtered by name.

**Query Parameters:**

| Name     | Type     | Default | Description                                |
| :------- | :------- | :------ | :----------------------------------------- |
| `cursor` | `number` | `1`     | The starting ID for the list (pagination). |
| `name`   | `string` | ` `     | A search term to filter Pokémon by name.   |

**Responses:**

| Status Code                 | Description                   |
| :-------------------------- | :---------------------------- |
| `200 OK`                    | Returns a list of Pokémon.    |
| `500 Internal Server Error` | Failed to fetch Pokémon list. |

### GET /api/pokemon/:id

Retrieves a single Pokémon by its ID.

**Path Parameters:**

| Name | Type     | Description            |
| :--- | :------- | :--------------------- |
| `id` | `number` | The ID of the Pokémon. |

**Responses:**

| Status Code                 | Description                 |
| :-------------------------- | :-------------------------- |
| `200 OK`                    | Returns the Pokémon object. |
| `500 Internal Server Error` | Failed to fetch Pokémon.    |
