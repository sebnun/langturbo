ALTER TABLE "episodes" ADD COLUMN "id" text PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "segments" ADD COLUMN "episode_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "segments" ADD CONSTRAINT "segments_episode_id_episodes_id_fk" FOREIGN KEY ("episode_id") REFERENCES "public"."episodes"("id") ON DELETE cascade ON UPDATE no action;