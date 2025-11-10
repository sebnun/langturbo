CREATE TABLE "segments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"text" text NOT NULL,
	"start" double precision NOT NULL,
	"end" double precision NOT NULL,
	"words" jsonb,
	"language_code" "language_code" NOT NULL,
	"episode_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "translations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"translation" text NOT NULL,
	"language_code" "language_code" NOT NULL,
	"segment_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "segments" ADD CONSTRAINT "segments_episode_id_episodes_id_fk" FOREIGN KEY ("episode_id") REFERENCES "public"."episodes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "translations" ADD CONSTRAINT "translations_segment_id_segments_id_fk" FOREIGN KEY ("segment_id") REFERENCES "public"."segments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "segments_language_code_idx" ON "segments" USING btree ("language_code");--> statement-breakpoint
CREATE INDEX "translations_language_code_idx" ON "translations" USING btree ("language_code");