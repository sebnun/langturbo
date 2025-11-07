CREATE TABLE "lists" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"word" text NOT NULL,
	"frequency" integer NOT NULL,
	"language_code" "language_code" NOT NULL,
	"duration" real NOT NULL,
	"voice" text NOT NULL,
	"en_translation" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sentences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"lists_id" uuid NOT NULL,
	"sentence" text NOT NULL,
	"en_translation" text NOT NULL,
	"context" text NOT NULL,
	"duration" real NOT NULL,
	"voice" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sentences" ADD CONSTRAINT "sentences_lists_id_lists_id_fk" FOREIGN KEY ("lists_id") REFERENCES "public"."lists"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "lists_language_code_idx" ON "lists" USING btree ("language_code");--> statement-breakpoint
CREATE INDEX "lists_frequency_idx" ON "lists" USING btree ("frequency");