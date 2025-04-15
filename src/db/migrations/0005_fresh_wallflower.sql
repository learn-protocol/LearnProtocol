CREATE TABLE IF NOT EXISTS "verification_wallets" (
	"address" varchar(64) PRIMARY KEY NOT NULL,
	"privateKey" varchar NOT NULL,
	"userId" varchar NOT NULL,
	"verified" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "verification_wallets" ADD CONSTRAINT "verification_wallets_userId_users_ocid_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("ocid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
