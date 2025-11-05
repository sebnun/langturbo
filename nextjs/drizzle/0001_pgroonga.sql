-- Custom SQL migration file, put your code below! --
-- This is needed even on their docker image
CREATE EXTENSION pgroonga;

CREATE INDEX shows_fts_idx
ON shows
USING pgroonga (fts);

CREATE INDEX captions_caption_idx
ON captions
USING pgroonga (caption);