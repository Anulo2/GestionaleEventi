import { t } from "elysia";

export const iscriviBody = t.Object({
	nome_bimbo: t.String(),
	cognome_bimbo: t.String(),
	data_nascita_bimbo: t.Date(),
	residenza_bimbo: t.String(),
	luogo_nascita_bimbo: t.String(),
	codice_fiscale_bimbo: t.String(),
	iscritto_noi_bimbo: t.BooleanString(),
	allergie_bimbo: t.String(),
	patologie_bimbo: t.String(),
	genitori: t.Array(
		t.ObjectString({
			nome_genitore: t.String(),
			cognome_genitore: t.String(),
		}),
	),

	contatti: t.Array(
		t.ObjectString({
			nome_contatto: t.String(),
			cognome_contatto: t.String(),
			telefono_contatto: t.String(),
			ruolo_contatto: t.String(),
		}),
	),
	carta_identita_bimbo: t.File(),
	bonifico_pagamento: t.Optional(t.File()),
	privacy_foto: t.BooleanString(),
	privacy_policy: t.BooleanString(),
	note: t.String(),
});
