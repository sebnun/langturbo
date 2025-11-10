ALTER TABLE "captions" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "translations" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "captions" CASCADE;--> statement-breakpoint
DROP TABLE "translations" CASCADE;--> statement-breakpoint
ALTER TABLE "episodes" ALTER COLUMN "processed_seconds" SET DATA TYPE double precision;--> statement-breakpoint
ALTER TABLE "episodes" ALTER COLUMN "processed_seconds" SET DEFAULT -1;