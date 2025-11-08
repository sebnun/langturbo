ALTER TABLE "lists" ADD COLUMN "id" numeric PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "sentences" ADD COLUMN "id" numeric PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "sentences" ADD COLUMN "lists_id" numeric NOT NULL;--> statement-breakpoint
ALTER TABLE "sentences" ADD CONSTRAINT "sentences_lists_id_lists_id_fk" FOREIGN KEY ("lists_id") REFERENCES "public"."lists"("id") ON DELETE cascade ON UPDATE no action;