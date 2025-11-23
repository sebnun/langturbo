CREATE INDEX "episodes_show_id_idx" ON "episodes" USING btree ("show_id");--> statement-breakpoint
CREATE INDEX "segments_episode_id_idx" ON "segments" USING btree ("episode_id");--> statement-breakpoint
CREATE INDEX "translations_segment_id_idx" ON "translations" USING btree ("segment_id");