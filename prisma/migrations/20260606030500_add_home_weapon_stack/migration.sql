CREATE TABLE IF NOT EXISTS "HomeWeaponStack" (
    "id" TEXT NOT NULL,
    "weaponId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "stack" INTEGER NOT NULL,
    "group" TEXT NOT NULL DEFAULT 'normal',
    "image" TEXT NOT NULL,
    "detailImage" TEXT,
    "bannerImage" TEXT,
    "articleImage" TEXT,
    "thumbnail" TEXT,
    "href" TEXT NOT NULL,
    "publishedAt" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "HomeWeaponStack_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "HomeWeaponStack_weaponId_key"
ON "HomeWeaponStack"("weaponId");

CREATE TABLE IF NOT EXISTS "HomeStackState" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "HomeStackState_pkey" PRIMARY KEY ("key")
);
