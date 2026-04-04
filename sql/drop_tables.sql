-- Drop existing tables (if any) before creating new schema
-- WARNING: This will delete all data in these tables

-- Drop tables in reverse order of dependencies
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS virality_predictions CASCADE;
DROP TABLE IF EXISTS trend_analyses CASCADE;
DROP TABLE IF EXISTS platform_analyses CASCADE;
DROP TABLE IF EXISTS content_optimizations CASCADE;
DROP TABLE IF EXISTS content_plans CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- Drop any existing policies (they will be recreated)
-- Note: This is optional as CASCADE should handle it