CREATE TABLE IF NOT EXISTS "stats" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "stats_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"distributedUpvotePrize" double precision DEFAULT 0 NOT NULL,
	"distributedDownvoteCutoff" double precision DEFAULT 0 NOT NULL
);
