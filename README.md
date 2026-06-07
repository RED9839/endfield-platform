# Endfield Platform

명일방주: 엔드필드의 오퍼레이터, 무기, 장비 정보를 탐색하고 성장 재화와
파밍 계획을 계산할 수 있는 Next.js 웹 애플리케이션입니다.

## 주요 기능

- 오퍼레이터, 무기, 장비 목록 및 상세 정보
- 오퍼레이터와 무기 성장 재화 시뮬레이터
- 보유 재화를 반영한 파밍 계산
- Google 로그인과 사용자 프로필
- 개인 오퍼레이터 세팅 저장, 수정, 공유, 추천
- 관리자용 사용자 및 세팅 관리

## 기술 구성

- Next.js 16 App Router, React 19, TypeScript
- Tailwind CSS 4
- NextAuth 5와 Google OAuth
- Prisma 6, PostgreSQL, Supabase
- Node.js 내장 테스트 러너와 `tsx`
- GitHub Actions

## 로컬 실행

Node.js 24와 npm을 권장합니다.

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Windows PowerShell에서는 다음 명령을 사용할 수 있습니다.

```powershell
Copy-Item .env.example .env.local
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 엽니다.

## 환경변수

`.env.example`을 기준으로 `.env.local`을 작성합니다.

필수:

- `AUTH_SECRET`: NextAuth 서명 비밀값
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`: Google OAuth 자격 증명
- `SUPABASE_DATABASE_URL`: 애플리케이션용 PostgreSQL 연결 주소
- `SUPABASE_DIRECT_URL`: Prisma 마이그레이션용 직접 연결 주소

기능에 따라 필요:

- `AUTH_URL`: 배포 환경의 애플리케이션 URL
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`: 브라우저 Supabase 클라이언트
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`: 관리자 API

Google OAuth 콜백 URL:

```text
http://localhost:3000/api/auth/callback/google
https://<배포 도메인>/api/auth/callback/google
```

비밀값이 포함된 `.env.local`은 커밋하지 않습니다.

## 데이터베이스

개발 데이터베이스에 Prisma 마이그레이션을 적용합니다.

```bash
npx prisma migrate dev
npx prisma generate
```

배포 전에는 직접 연결 주소를 사용해 마이그레이션을 적용합니다.

```bash
npx prisma migrate deploy
```

오퍼레이터 세팅 JSON 검색 인덱스는 Supabase SQL Editor에서 다음 파일을
별도로 실행합니다.

```text
supabase/migrations/20260607060000_optimize_operator_setting_search.sql
```

자세한 내용은 [데이터베이스 최적화 문서](docs/database-optimization.md)를
참고하세요. 빌드 명령은 데이터베이스 마이그레이션을 실행하지 않습니다.

## 품질 검사

```bash
npm run lint -- --quiet
npm test
npm run build
```

GitHub Actions의 `Quality` 워크플로도 pull request와 `main` push에서 같은
순서로 실행됩니다.

## 프로젝트 구조

```text
app/                 페이지, 서버 컴포넌트, API 라우트
data/                오퍼레이터, 무기, 장비 및 파밍 데이터
lib/                 인증, DB, 계산 및 공용 서버 로직
prisma/              Prisma 스키마와 마이그레이션
supabase/migrations/ 추가 검색 인덱스
tests/               핵심 계산과 API 경계 단위 테스트
docs/                운영 및 데이터베이스 문서
```

## 운영 참고

- `/api/env-check`는 개발 및 테스트 환경에서만 사용할 수 있습니다.
- 쓰기, 추천, 조회수 API에는 기본적인 요청 제한이 적용됩니다.
- 현재 요청 제한은 프로세스 메모리 기반입니다. 여러 서버 인스턴스로
  확장할 때는 Redis 같은 공유 저장소 기반 제한기로 교체해야 합니다.
