# Google 로그인 적용 방법

## 1. 패키지 설치

```bash
npm install next-auth@beta @auth/prisma-adapter @prisma/client
npm install -D prisma
```

## 2. 파일 복사

압축 안의 파일을 프로젝트 루트 기준으로 그대로 복사합니다.

```txt
auth.ts
lib/prisma.ts
prisma/schema.prisma
app/api/auth/[...nextauth]/route.ts
app/login/page.tsx
app/components/auth/AuthButtons.tsx
types-next-auth.d.ts
```

## 3. .env.local 작성

```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="32자 이상 랜덤 문자열"
AUTH_GOOGLE_ID="구글 클라이언트 ID"
AUTH_GOOGLE_SECRET="구글 클라이언트 SECRET"
```

AUTH_SECRET 생성 예시:

```bash
openssl rand -base64 32
```

Windows PowerShell 예시:

```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

## 4. Prisma DB 생성

```bash
npx prisma migrate dev --name init-auth
npx prisma generate
```

## 5. Google Cloud Console 설정

OAuth 2.0 클라이언트 ID를 만들고 승인된 리디렉션 URI에 아래 주소를 추가합니다.

```txt
http://localhost:3000/api/auth/callback/google
```

배포 후에는 배포 주소도 추가합니다.

```txt
https://배포도메인/api/auth/callback/google
```
