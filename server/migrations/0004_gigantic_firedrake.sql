CREATE TYPE "public"."role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "email-tokens" (
	"id" text NOT NULL,
	"token" text NOT NULL,
	"email" text,
	"expires" timestamp NOT NULL,
	CONSTRAINT "email-tokens_id_token_pk" PRIMARY KEY("id","token"),
	CONSTRAINT "email-tokens_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "password" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "twoFactorEnabled" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" "role" DEFAULT 'user';