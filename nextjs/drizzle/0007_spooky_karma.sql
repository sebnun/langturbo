ALTER TABLE "segments" DROP CONSTRAINT "segments_episode_id_episodes_id_fk";
--> statement-breakpoint
ALTER TABLE "episodes" DROP COLUMN "id";--> statement-breakpoint
ALTER TABLE "segments" DROP COLUMN "episode_id";