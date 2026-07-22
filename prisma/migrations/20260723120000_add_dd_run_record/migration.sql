-- CreateTable: DDRunRecord (닼던류 원정 기록 — 학습·밸런스 분석용)
CREATE TABLE IF NOT EXISTS "DDRunRecord" (
  "id" TEXT NOT NULL,
  "userId" TEXT,
  "result" TEXT NOT NULL,
  "floorReached" INTEGER NOT NULL,
  "totalFloors" INTEGER NOT NULL,
  "durationSec" INTEGER NOT NULL,
  "battles" INTEGER NOT NULL DEFAULT 0,
  "rounds" INTEGER NOT NULL DEFAULT 0,
  "dmgDealt" INTEGER NOT NULL DEFAULT 0,
  "data" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "DDRunRecord_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "DDRunRecord_userId_idx" ON "DDRunRecord"("userId");
CREATE INDEX IF NOT EXISTS "DDRunRecord_createdAt_idx" ON "DDRunRecord"("createdAt");
CREATE INDEX IF NOT EXISTS "DDRunRecord_result_idx" ON "DDRunRecord"("result");

ALTER TABLE "DDRunRecord"
ADD CONSTRAINT "DDRunRecord_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
