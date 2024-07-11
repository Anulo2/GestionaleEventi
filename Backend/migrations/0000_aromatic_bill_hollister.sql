CREATE TABLE IF NOT EXISTS "admin" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"email" text NOT NULL,
	CONSTRAINT "admin_username_unique" UNIQUE("username"),
	CONSTRAINT "admin_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bimbo" (
	"id" serial PRIMARY KEY NOT NULL,
	"nome" text,
	"cognome" text,
	"data_nascita" timestamp,
	"residenza" text,
	"luogo_nascita" text,
	"note_interne" text,
	"codice_fiscale" text,
	"iscritto_noi" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "contatto" (
	"id" serial PRIMARY KEY NOT NULL,
	"nome" text,
	"cognome" text,
	"telefono" text,
	"ruolo" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dati_medici" (
	"id" serial PRIMARY KEY NOT NULL,
	"iscrizione_id" integer NOT NULL,
	"documento_identita" serial NOT NULL,
	"allergie" text NOT NULL,
	"patologie" text NOT NULL,
	CONSTRAINT "dati_medici_documento_identita_unique" UNIQUE("documento_identita")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "email_iscrizione" (
	"token" text,
	"evento_id" integer,
	"mail" text NOT NULL,
	"expires_at" timestamp DEFAULT now() + interval '1 day' NOT NULL,
	"is_used" boolean DEFAULT false NOT NULL,
	CONSTRAINT "email_iscrizione_token_evento_id_pk" PRIMARY KEY("token","evento_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "evento" (
	"id" serial PRIMARY KEY NOT NULL,
	"nome" text,
	"descrizione" text,
	"data_inizio" timestamp,
	"data_fine" timestamp,
	"luogo" text,
	"sottodominio" text,
	"privacy_policy" text,
	"privacy_foto" text,
	"organizzatori" json,
	"privacy_foto_necessaria" boolean DEFAULT true,
	CONSTRAINT "evento_sottodominio_unique" UNIQUE("sottodominio")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "genitore" (
	"id" serial PRIMARY KEY NOT NULL,
	"nome" text,
	"cognome" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "iscrizione" (
	"id" serial PRIMARY KEY NOT NULL,
	"evento_id" integer NOT NULL,
	"bimbo_id" integer NOT NULL,
	"mail_riferimento" text NOT NULL,
	"privacy_policy_accettata" boolean NOT NULL,
	"privacy_foto_accettata" boolean,
	"timestamp_iscrizione" timestamp DEFAULT now() NOT NULL,
	"note" text,
	"pagamento" boolean NOT NULL,
	"pagamento_file" serial NOT NULL,
	"is_completed" boolean DEFAULT false NOT NULL,
	CONSTRAINT "iscrizione_pagamento_file_unique" UNIQUE("pagamento_file")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "iscrizione_contatto" (
	"id" serial PRIMARY KEY NOT NULL,
	"iscrizione_id" integer NOT NULL,
	"contatto_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "iscrizione_genitore" (
	"id" serial PRIMARY KEY NOT NULL,
	"iscrizione_id" integer NOT NULL,
	"genitore_id" integer NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dati_medici" ADD CONSTRAINT "dati_medici_iscrizione_id_iscrizione_id_fk" FOREIGN KEY ("iscrizione_id") REFERENCES "public"."iscrizione"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "email_iscrizione" ADD CONSTRAINT "email_iscrizione_evento_id_evento_id_fk" FOREIGN KEY ("evento_id") REFERENCES "public"."evento"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "iscrizione" ADD CONSTRAINT "iscrizione_evento_id_evento_id_fk" FOREIGN KEY ("evento_id") REFERENCES "public"."evento"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "iscrizione" ADD CONSTRAINT "iscrizione_bimbo_id_bimbo_id_fk" FOREIGN KEY ("bimbo_id") REFERENCES "public"."bimbo"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "iscrizione_contatto" ADD CONSTRAINT "iscrizione_contatto_iscrizione_id_iscrizione_id_fk" FOREIGN KEY ("iscrizione_id") REFERENCES "public"."iscrizione"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "iscrizione_contatto" ADD CONSTRAINT "iscrizione_contatto_contatto_id_contatto_id_fk" FOREIGN KEY ("contatto_id") REFERENCES "public"."contatto"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "iscrizione_genitore" ADD CONSTRAINT "iscrizione_genitore_iscrizione_id_iscrizione_id_fk" FOREIGN KEY ("iscrizione_id") REFERENCES "public"."iscrizione"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "iscrizione_genitore" ADD CONSTRAINT "iscrizione_genitore_genitore_id_genitore_id_fk" FOREIGN KEY ("genitore_id") REFERENCES "public"."genitore"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
