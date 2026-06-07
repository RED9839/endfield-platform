ALTER TABLE "UserOperatorSetting"
ADD COLUMN "operatorSlugs" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "mainWeaponSlug" TEXT;

UPDATE "UserOperatorSetting"
SET
  "operatorSlugs" = ARRAY(
    SELECT DISTINCT slug
    FROM unnest(ARRAY[
      "slots"->'main'->>'operatorSlug',
      "slots"->'member1'->>'operatorSlug',
      "slots"->'member2'->>'operatorSlug',
      "slots"->'member3'->>'operatorSlug',
      "slots"->'member4'->>'operatorSlug',
      "slots"->'menber1'->>'operatorSlug',
      "slots"->'menber2'->>'operatorSlug',
      "slots"->'menber3'->>'operatorSlug',
      "slots"->'menber4'->>'operatorSlug'
    ]) AS slug
    WHERE slug IS NOT NULL AND slug <> ''
  ),
  "mainWeaponSlug" = NULLIF("slots"->'main'->'form'->>'weaponSlug', '');

CREATE INDEX "UserOperatorSetting_mainWeaponSlug_idx"
ON "UserOperatorSetting"("mainWeaponSlug");

CREATE INDEX "UserOperatorSetting_operatorSlugs_idx"
ON "UserOperatorSetting" USING GIN ("operatorSlugs");
