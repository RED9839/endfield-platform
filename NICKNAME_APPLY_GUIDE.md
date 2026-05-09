# 적용 방법

압축을 풀어서 프로젝트 루트에 그대로 덮어쓰기합니다.

## 들어가는 파일

```txt
auth.ts
lib/prisma.ts
prisma/schema.prisma
types/next-auth.d.ts
app/api/auth/[...nextauth]/route.ts
app/components/auth/AuthButtons.tsx
app/login/page.tsx
app/setup-profile/page.tsx
```

## .env.local 확인

```env
AUTH_SECRET="endfield-secret-key"
AUTH_URL="http://localhost:3000"

GOOGLE_CLIENT_ID="구글 클라이언트 ID"
GOOGLE_CLIENT_SECRET="구글 클라이언트 시크릿"

DATABASE_URL="file:./dev.db"
```

## 실행 명령어

PowerShell에서 프로젝트 폴더 기준:

```powershell
$env:DATABASE_URL="file:./dev.db"
npx prisma migrate dev --name add-nickname
npx prisma generate
npm run dev
```

## 기능

```txt
Google 로그인
최초 로그인 시 닉네임 없으면 /setup-profile 이동
닉네임 2~16자 제한
한글/영문/숫자/_ 허용
중복 닉네임 불가
저장 후 홈으로 이동
```

## 참고

이미 기존 DB에 User 테이블이 있어도 migrate가 nickname 컬럼을 추가합니다.
만약 schema 변경이 없다고 뜨는데 타입 오류가 남으면 `npx prisma generate` 후 VSCode에서 TypeScript 서버를 재시작하세요.
