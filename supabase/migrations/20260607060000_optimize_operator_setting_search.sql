-- Run this once from the Supabase SQL editor.
-- These expressions match Prisma's PostgreSQL JSON path equality filters.

CREATE INDEX CONCURRENTLY IF NOT EXISTS "UserOperatorSetting_slots_main_operator_idx"
ON "UserOperatorSetting" (("slots" #> ARRAY['main', 'operatorSlug']::text[]))
WHERE ("slots" #> ARRAY['main', 'operatorSlug']::text[]) IS NOT NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS "UserOperatorSetting_slots_member1_operator_idx"
ON "UserOperatorSetting" (("slots" #> ARRAY['member1', 'operatorSlug']::text[]))
WHERE ("slots" #> ARRAY['member1', 'operatorSlug']::text[]) IS NOT NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS "UserOperatorSetting_slots_member2_operator_idx"
ON "UserOperatorSetting" (("slots" #> ARRAY['member2', 'operatorSlug']::text[]))
WHERE ("slots" #> ARRAY['member2', 'operatorSlug']::text[]) IS NOT NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS "UserOperatorSetting_slots_member3_operator_idx"
ON "UserOperatorSetting" (("slots" #> ARRAY['member3', 'operatorSlug']::text[]))
WHERE ("slots" #> ARRAY['member3', 'operatorSlug']::text[]) IS NOT NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS "UserOperatorSetting_slots_main_weapon_idx"
ON "UserOperatorSetting" (("slots" #> ARRAY['main', 'form', 'weaponSlug']::text[]))
WHERE ("slots" #> ARRAY['main', 'form', 'weaponSlug']::text[]) IS NOT NULL;
