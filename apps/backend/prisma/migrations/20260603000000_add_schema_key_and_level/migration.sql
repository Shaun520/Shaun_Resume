-- Add schema_key column (nullable first, then fill data, then set NOT NULL)
ALTER TABLE "templates" ADD COLUMN "schema_key" TEXT;
ALTER TABLE "templates" ADD COLUMN "level" INTEGER NOT NULL DEFAULT 1;

-- Migrate data: derive schema_key from component_name
UPDATE "templates" SET "schema_key" = "component_name" WHERE "component_name" IN ('classic', 'modern', 'minimal');
UPDATE "templates" SET "schema_key" = "component_name" WHERE "schema_key" IS NULL;

-- Now set NOT NULL
ALTER TABLE "templates" ALTER COLUMN "schema_key" SET NOT NULL;

-- Add unique constraint on schema_key
CREATE UNIQUE INDEX "templates_schema_key_key" ON "templates"("schema_key");

-- Drop old component_name unique index and column
DROP INDEX IF EXISTS "templates_component_name_key";
ALTER TABLE "templates" DROP COLUMN "component_name";
