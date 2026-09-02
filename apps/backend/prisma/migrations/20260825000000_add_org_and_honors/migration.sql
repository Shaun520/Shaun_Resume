-- AlterTable
ALTER TABLE "resume_contents" ADD COLUMN "org_experience" JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "resume_contents" ADD COLUMN "honors" JSONB NOT NULL DEFAULT '[]';