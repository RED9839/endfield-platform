CREATE TABLE IF NOT EXISTS "UserOperatorSetting" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "slots" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "UserOperatorSetting_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "UserOperatorSetting_userId_idx" ON "UserOperatorSetting"("userId");
CREATE INDEX IF NOT EXISTS "UserOperatorSetting_userId_type_idx" ON "UserOperatorSetting"("userId", "type");

ALTER TABLE "UserOperatorSetting"
ADD CONSTRAINT "UserOperatorSetting_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
