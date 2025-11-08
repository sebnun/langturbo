ALTER TABLE "sentences" DROP CONSTRAINT "sentences_lists_id_lists_id_fk";
--> statement-breakpoint
ALTER TABLE "lists" DROP COLUMN "id";--> statement-breakpoint
ALTER TABLE "sentences" DROP COLUMN "id";--> statement-breakpoint
ALTER TABLE "sentences" DROP COLUMN "lists_id";