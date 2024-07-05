ALTER TABLE "iscrizione" ADD COLUMN "pagamento_file" serial NOT NULL;--> statement-breakpoint
ALTER TABLE "dati_medici" DROP COLUMN IF EXISTS "gruppo_sanguineo";--> statement-breakpoint
ALTER TABLE "iscrizione" ADD CONSTRAINT "iscrizione_pagamento_file_unique" UNIQUE("pagamento_file");