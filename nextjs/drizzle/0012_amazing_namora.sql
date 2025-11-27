CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"type" text NOT NULL,
	"language_code" "language_code" NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "playback" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"percentage" double precision NOT NULL,
	"language_code" "language_code" NOT NULL,
	"episode_id" text NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "saved" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"show_id" uuid NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "words" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"word" text NOT NULL,
	"language_code" "language_code" NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playback" ADD CONSTRAINT "playback_episode_id_episodes_id_fk" FOREIGN KEY ("episode_id") REFERENCES "public"."episodes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playback" ADD CONSTRAINT "playback_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved" ADD CONSTRAINT "saved_show_id_shows_id_fk" FOREIGN KEY ("show_id") REFERENCES "public"."shows"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved" ADD CONSTRAINT "saved_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "words" ADD CONSTRAINT "words_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "events_language_code_idx" ON "events" USING btree ("language_code");--> statement-breakpoint
CREATE INDEX "events_created_at_idx" ON "events" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "events_type_idx" ON "events" USING btree ("type");--> statement-breakpoint
CREATE INDEX "events_user_id_idx" ON "events" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "playback_language_code_idx" ON "playback" USING btree ("language_code");--> statement-breakpoint
CREATE INDEX "playback_episode_id_idx" ON "playback" USING btree ("episode_id");--> statement-breakpoint
CREATE INDEX "playback_user_id_idx" ON "playback" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "saved_show_id_idx" ON "saved" USING btree ("show_id");--> statement-breakpoint
CREATE INDEX "saved_user_id_idx" ON "saved" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "words_language_code_idx" ON "words" USING btree ("language_code");--> statement-breakpoint
CREATE INDEX "words_word_idx" ON "words" USING btree ("word");--> statement-breakpoint
CREATE INDEX "words_user_id_idx" ON "words" USING btree ("user_id");