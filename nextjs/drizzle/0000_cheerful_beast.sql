CREATE TYPE "public"."language_code" AS ENUM('aa', 'ab', 'ae', 'af', 'ak', 'am', 'an', 'ar', 'as', 'av', 'ay', 'az', 'ba', 'be', 'bg', 'bi', 'bm', 'bn', 'bo', 'br', 'bs', 'ca', 'ce', 'ch', 'co', 'cr', 'cs', 'cu', 'cv', 'cy', 'da', 'de', 'dv', 'dz', 'ee', 'el', 'en', 'eo', 'es', 'et', 'eu', 'fa', 'ff', 'fi', 'fj', 'fo', 'fr', 'fy', 'ga', 'gd', 'gl', 'gn', 'gu', 'gv', 'ha', 'he', 'hi', 'ho', 'hr', 'ht', 'hu', 'hy', 'hz', 'ia', 'id', 'ie', 'ig', 'ii', 'ik', 'io', 'is', 'it', 'iu', 'ja', 'jv', 'ka', 'kg', 'ki', 'kj', 'kk', 'kl', 'km', 'kn', 'ko', 'kr', 'ks', 'ku', 'kv', 'kw', 'ky', 'la', 'lb', 'lg', 'li', 'ln', 'lo', 'lt', 'lu', 'lv', 'mg', 'mh', 'mi', 'mk', 'ml', 'mn', 'mr', 'ms', 'mt', 'my', 'na', 'nb', 'nd', 'ne', 'ng', 'nl', 'nn', 'no', 'nr', 'nv', 'ny', 'oc', 'oj', 'om', 'or', 'os', 'pa', 'pi', 'pl', 'ps', 'pt', 'qu', 'rm', 'rn', 'ro', 'ru', 'rw', 'sa', 'sc', 'sd', 'se', 'sg', 'si', 'sk', 'sl', 'sm', 'sn', 'so', 'sq', 'sr', 'ss', 'st', 'su', 'sv', 'sw', 'ta', 'te', 'tg', 'th', 'ti', 'tk', 'tl', 'tn', 'to', 'tr', 'ts', 'tt', 'tw', 'ty', 'ug', 'uk', 'ur', 'uz', 've', 'vi', 'vo', 'wa', 'wo', 'xh', 'yi', 'yo', 'za', 'zh', 'zu');--> statement-breakpoint
CREATE TYPE "public"."show_type" AS ENUM('podcast', 'youtube', 'other');--> statement-breakpoint
CREATE TABLE "captions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"caption" text NOT NULL,
	"start" real NOT NULL,
	"words" text[] DEFAULT '{}'::text[] NOT NULL,
	"language_code" "language_code" NOT NULL,
	"episode_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "episodes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"last_played_at" timestamp DEFAULT now() NOT NULL,
	"title" text NOT NULL,
	"file_name" text NOT NULL,
	"language_code" "language_code" NOT NULL,
	"processed_seconds" real DEFAULT -1,
	"show_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shows" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"author" text,
	"fts" text GENERATED ALWAYS AS (("title" || ' ' || "author")) STORED,
	"explicit" boolean,
	"image_url" text NOT NULL,
	"show_url" text,
	"source_url" text,
	"country" text,
	"category_ids" smallint[] NOT NULL,
	"popularity" integer DEFAULT 0 NOT NULL,
	"language_code" "language_code" NOT NULL,
	"show_type" "show_type" DEFAULT 'podcast' NOT NULL,
	"health_checked_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "shows_source_id_unique" UNIQUE("source_id")
);
--> statement-breakpoint
CREATE TABLE "translations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"translation" text NOT NULL,
	"language_code" "language_code" NOT NULL,
	"caption_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "captions" ADD CONSTRAINT "captions_episode_id_episodes_id_fk" FOREIGN KEY ("episode_id") REFERENCES "public"."episodes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "episodes" ADD CONSTRAINT "episodes_show_id_shows_id_fk" FOREIGN KEY ("show_id") REFERENCES "public"."shows"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "translations" ADD CONSTRAINT "translations_caption_id_captions_id_fk" FOREIGN KEY ("caption_id") REFERENCES "public"."captions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "captions_language_code_idx" ON "captions" USING btree ("language_code");--> statement-breakpoint
CREATE INDEX "episodes_language_code_idx" ON "episodes" USING btree ("language_code");--> statement-breakpoint
CREATE INDEX "episodes_last_played_at_idx" ON "episodes" USING btree ("last_played_at");--> statement-breakpoint
CREATE INDEX "shows_source_id_idx" ON "shows" USING btree ("source_id");--> statement-breakpoint
CREATE INDEX "shows_category_ids_idx" ON "shows" USING btree ("category_ids");--> statement-breakpoint
CREATE INDEX "shows_language_code_idx" ON "shows" USING btree ("language_code");--> statement-breakpoint
CREATE INDEX "shows_popularity_idx" ON "shows" USING btree ("popularity");--> statement-breakpoint
CREATE INDEX "shows_show_type_idx" ON "shows" USING btree ("show_type");--> statement-breakpoint
CREATE INDEX "shows_health_checked_at_idx" ON "shows" USING btree ("health_checked_at");--> statement-breakpoint
CREATE INDEX "translations_language_code_idx" ON "translations" USING btree ("language_code");