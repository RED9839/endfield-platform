# Database optimization

Database migrations are intentionally not executed from `npm run build`.
Vercel builds must not depend on a live Supabase connection.

## Operator setting search indexes

Run the following file once in the Supabase SQL editor:

`supabase/migrations/20260607060000_optimize_operator_setting_search.sql`

The statements use `CREATE INDEX CONCURRENTLY`, so run them without wrapping
the script in an explicit transaction. They are idempotent and can be retried.

After applying the file, verify the indexes:

```sql
SELECT indexname
FROM pg_indexes
WHERE tablename = 'UserOperatorSetting'
  AND indexname LIKE 'UserOperatorSetting_slots_%'
ORDER BY indexname;
```

Five rows should be returned.
