import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type { App } from "..";
import type { iscriviBody } from "../type";
import {
	bimbo,
	iscrizione,
	iscrizioneGenitore,
	iscrizioneContatto,
	datiMedici,
	contatto,
	genitore,
	evento,
} from "../../schema";
import { eq } from "drizzle-orm";

export async function insertIscrizione(db: PostgresJsDatabase, data: any) {
	console.log(data);
	const insertedBimbo = await db
		.insert(bimbo)
		.values({
			nome: data.nome_bimbo,
			cognome: data.cognome_bimbo,
			data_nascita: data.data_nascita_bimbo,
			residenza: data.residenza_bimbo,
			luogo_nascita: data.luogo_nascita_bimbo,
			codice_fiscale: data.codice_fiscale_bimbo,
			iscritto_noi: data.iscritto_noi_bimbo,
		})
		.returning()
		.then((res) => res[0]);

	if (!insertedBimbo) {
		throw new Error("Error inserting bimbo");
	}

	console.log("Bimbo inserted");
	console.log(insertedBimbo);

	const insertedIscrizione = await db
		.insert(iscrizione)
		.values({
			evento_id: 1,
			bimbo_id: insertedBimbo.id,
			mail_riferimento: "test@example.com",
			privacy_policy_accettata: data.privacy_policy,
			privacy_foto_accettata: data.privacy_foto,
			note: data.note,
			pagamento: !!data.bonifico_pagamento,
		})
		.returning()
		.then((res) => res[0]);

	if (!insertedIscrizione) {
		throw new Error("Error inserting iscrizione");
	}

	console.log("Iscrizione inserted");
	console.log(insertedIscrizione);

	for (const genitoreIn of data.genitori) {
		const insertedGenitore = await db
			.insert(genitore)
			.values({
				nome: genitoreIn.nome_genitore,
				cognome: genitoreIn.cognome_genitore,
			})
			.returning()
			.then((res) => res[0]);
		if (!insertedGenitore) {
			throw new Error("Error inserting genitore");
		}
		console.log("Genitore inserted");
		console.log(insertedGenitore);
		await db.insert(iscrizioneGenitore).values({
			iscrizione_id: insertedIscrizione.id,
			genitore_id: insertedGenitore.id,
		});
		console.log("Iscrizione genitore inserted");
		console.log(insertedIscrizione);
	}

	for (const contattoIn of data.contatti) {
		const insertedContatto = await db
			.insert(contatto)
			.values({
				nome: contattoIn.nome_contatto,
				cognome: contattoIn.cognome_contatto,
				telefono: contattoIn.telefono_contatto,
				ruolo: contattoIn.ruolo_contatto,
			})
			.returning()
			.then((res) => res[0]);
		if (!insertedContatto) {
			throw new Error("Error inserting contatto");
		}
		await db.insert(iscrizioneContatto).values({
			iscrizione_id: insertedIscrizione.id,
			contatto_id: insertedContatto.id,
		});

		console.log("Contatto inserted");
	}

	const insertedDatiMedici = await db
		.insert(datiMedici)
		.values({
			iscrizione_id: insertedIscrizione.id,
			allergie: data.allergie_bimbo,
			patologie: data.patologie_bimbo,
		})
		.returning()
		.then((res) => res[0]);

	if (!insertedDatiMedici) {
		throw new Error("Error inserting dati medici");
	}

	console.log("Dati medici inserted");
	if (data.bonifico_pagamento) {
		Bun.write(
			`./data/bonifici/${insertedIscrizione.pagamento_file}.pdf`,
			data.bonifico_pagamento,
		);
	}

	Bun.write(
		`./data/carte_identita/${insertedDatiMedici.documento_identita}.jpg`,
		data.carta_identita_bimbo,
	);
}

export async function getIscrizioni(db: PostgresJsDatabase) {
	const result = await db
		.select({
			iscrizione: iscrizione,
			bimbo: bimbo,
			genitori: genitore,
			contatti: contatto,
			datiMedici: datiMedici,
		})
		.from(iscrizione)
		.where(eq(iscrizione.evento_id, 1))
		.leftJoin(bimbo, eq(iscrizione.bimbo_id, bimbo.id))
		.leftJoin(
			iscrizioneGenitore,
			eq(iscrizione.id, iscrizioneGenitore.iscrizione_id),
		)
		.leftJoin(genitore, eq(iscrizioneGenitore.genitore_id, genitore.id))
		.leftJoin(
			iscrizioneContatto,
			eq(iscrizione.id, iscrizioneContatto.iscrizione_id),
		)
		.leftJoin(contatto, eq(iscrizioneContatto.contatto_id, contatto.id))
		.leftJoin(datiMedici, eq(iscrizione.id, datiMedici.iscrizione_id))
		.orderBy(
			// timestamp_iscrizione
			iscrizione.timestamp_iscrizione,
		);

	interface Accumulator {
		[key: number]: any; // or specify a more specific type instead of 'any'
	}

	const groupedResult = result.reduce((acc: Accumulator, row) => {
		const iscrizioneId: number = row.iscrizione.id;
		if (!acc[iscrizioneId]) {
			acc[iscrizioneId] = {
				...row.iscrizione,
			};
			acc[iscrizioneId].genitori = [];
			acc[iscrizioneId].contatti = [];
			if (!row.bimbo) return acc;
			acc[iscrizioneId].bimbo = row.bimbo;
			if (!row.datiMedici) return acc;
			acc[iscrizioneId].datiMedici = row.datiMedici;
		}

		if (!row.genitori) return acc;
		if (!row.contatti) return acc;

		if (!acc[iscrizioneId].genitori.some((g) => g.id === row.genitori.id)) {
			acc[iscrizioneId].genitori.push(row.genitori);
		}
		if (!acc[iscrizioneId].contatti.some((c) => c.id === row.contatti.id)) {
			acc[iscrizioneId].contatti.push(row.contatti);
		}
		return acc;
	}, {});

	// clean up the object from the ones with less than 2 genitori or contatti
	for (const key in groupedResult) {
		if (
			groupedResult[key].genitori.length < 2 ||
			groupedResult[key].contatti.length < 2
		) {
			delete groupedResult[key];
		}
	}

	// make it an array
	const groupedResultArray = Object.values(groupedResult);

	return groupedResultArray;
}
