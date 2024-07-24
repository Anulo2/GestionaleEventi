import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type { App } from "..";
import type { iscriviBody, iniziaIscrizioneBody } from "../type";
import {
	bimbo,
	iscrizione,
	iscrizioneGenitore,
	iscrizioneContatto,
	datiMedici,
	contatto,
	genitore,
	evento,
	emailIscrizione,
	admin,
	adminToken,
} from "../../schema";
import { eq, and, or } from "drizzle-orm";
import type nodemailer from "nodemailer";
import { nanoid } from "nanoid";

interface EventoFound {
	id: number;
	nome: string | null;
	descrizione: string | null;
	data_inizio: Date | null;
	data_fine: Date | null;
	luogo: string | null;
	sottodominio: string | null;
	privacy_policy: string | null;
	privacy_foto: string | null;
	organizzatori: unknown;
	privacy_foto_necessaria: boolean;
}

interface TokenFound {
	evento_id: number | null;
	token: string | null;
	mail: string;
	expires_at: Date;
	is_used: boolean;
}

interface InsertIscrizioneData {
	bonifico_pagamento?: File | undefined;
	evento: string;
	token: string;
	nome_bimbo: string;
	cognome_bimbo: string;
	data_nascita_bimbo: Date;
	residenza_bimbo: string;
	luogo_nascita_bimbo: string;
	codice_fiscale_bimbo: string;
	iscritto_noi_bimbo: boolean;
	allergie_bimbo: string;
	patologie_bimbo: string;
	genitori: { nome_genitore: string; cognome_genitore: string }[];
	contatti: {
		nome_contatto: string;
		cognome_contatto: string;
		telefono_contatto: string;
		ruolo_contatto: string;
	}[];
	carta_identita_bimbo: File;
	privacy_foto: boolean;
	privacy_policy: boolean;
	note: string;
}

export async function insertIscrizione(
	db: PostgresJsDatabase,
	data: InsertIscrizioneData,
	eventoFound: EventoFound,
	tokenFound: TokenFound,
	mailer: nodemailer.Transporter,
) {
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
			evento_id: eventoFound.id,
			bimbo_id: insertedBimbo.id,
			mail_riferimento: tokenFound.mail,
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

	if (!tokenFound.token) {
		throw new Error("Token not found");
	}

	// update token to be used
	await db
		.update(emailIscrizione)
		.set({
			is_used: true,
		})
		.where(eq(emailIscrizione.token, tokenFound.token));

	// send mail to the user saying that the iscrizione is completed
	await mailer.sendMail({
		from: '"Animatori Torreglia " <animatori@parrocchiatorreglia.it>', // sender address
		to: tokenFound.mail, // list of receivers
		subject: `Iscrizione a: ${eventoFound.nome}`, // Subject line
		text: "La tua iscrizione è stata completata con successo", // plain text body
	});
}

interface UpdateIscrizioneData {
	id: number;
	nome_bimbo: string;
	cognome_bimbo: string;
	data_nascita_bimbo: Date;
	residenza_bimbo: string;
	luogo_nascita_bimbo: string;
	codice_fiscale_bimbo: string;
	iscritto_noi_bimbo: boolean;
	allergie_bimbo: string;
	patologie_bimbo: string;
	genitori: { nome_genitore: string; cognome_genitore: string }[];
	contatti: {
		nome_contatto: string;
		cognome_contatto: string;
		telefono_contatto: string;
		ruolo_contatto: string;
	}[];
	carta_identita_bimbo: File | undefined;
	bonifico_pagamento: File | undefined;
	privacy_foto: boolean;
	privacy_policy: boolean;
	note: string;
}

export async function updateIscrizione(
	db: PostgresJsDatabase,
	body: UpdateIscrizioneData,
) {
	const iscrizioneFound = await db
		.select()
		.from(iscrizione)
		.where(eq(iscrizione.id, body.id))
		.then((res) => res[0]);

	if (!iscrizioneFound) {
		throw new Error("Iscrizione not found");
	}

	const bimboFound = await db
		.select()
		.from(bimbo)
		.where(eq(bimbo.id, iscrizioneFound.bimbo_id))
		.then((res) => res[0]);

	if (!bimboFound) {
		throw new Error("Bimbo not found");
	}

	const datiMediciFound = await db
		.select()
		.from(datiMedici)
		.where(eq(datiMedici.iscrizione_id, iscrizioneFound.id))
		.then((res) => res[0]);

	if (!datiMediciFound) {
		throw new Error("Dati medici not found");
	}

	// update bimbo
	await db
		.update(bimbo)
		.set({
			nome: body.nome_bimbo,
			cognome: body.cognome_bimbo,
			data_nascita: body.data_nascita_bimbo,
			residenza: body.residenza_bimbo,
			luogo_nascita: body.luogo_nascita_bimbo,
			codice_fiscale: body.codice_fiscale_bimbo,
			iscritto_noi: body.iscritto_noi_bimbo,
		})
		.where(eq(bimbo.id, bimboFound.id));

	// update dati medici
	await db
		.update(datiMedici)
		.set({
			allergie: body.allergie_bimbo,
			patologie: body.patologie_bimbo,
		})
		.where(eq(datiMedici.id, datiMediciFound.id));

	// delete genitori
	await db
		.delete(iscrizioneGenitore)
		.where(eq(iscrizioneGenitore.iscrizione_id, iscrizioneFound.id));

	// insert genitori
	for (const genitoreIn of body.genitori) {
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
		await db.insert(iscrizioneGenitore).values({
			iscrizione_id: iscrizioneFound.id,
			genitore_id: insertedGenitore.id,
		});

		console.log("Genitore inserted");
	}

	// delete contatti
	await db
		.delete(iscrizioneContatto)
		.where(eq(iscrizioneContatto.iscrizione_id, iscrizioneFound.id));

	// insert contatti
	for (const contattoIn of body.contatti) {
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
			iscrizione_id: iscrizioneFound.id,
			contatto_id: insertedContatto.id,
		});

		console.log("Contatto inserted");
	}

	if (body.bonifico_pagamento) {
		Bun.write(
			`./data/bonifici/${iscrizioneFound.pagamento_file}.pdf`,
			body.bonifico_pagamento,
		);
	}

	if (body.carta_identita_bimbo) {
		Bun.write(
			`./data/carte_identita/${datiMediciFound.documento_identita}.jpg`,
			body.carta_identita_bimbo,
		);
	}

	// update iscrizione
	await db
		.update(iscrizione)
		.set({
			privacy_policy_accettata: body.privacy_policy,
			privacy_foto_accettata: body.privacy_foto,
			note: body.note,
			pagamento: !!body.bonifico_pagamento,
		})
		.where(eq(iscrizione.id, iscrizioneFound.id));

	return "Iscrizione aggiornata con successo";
}

export async function getIscrizioni(
	db: PostgresJsDatabase,
	eventoFound: EventoFound,
) {
	const result = await db
		.select({
			iscrizione: iscrizione,
			bimbo: bimbo,
			genitori: genitore,
			contatti: contatto,
			datiMedici: datiMedici,
		})
		.from(iscrizione)
		.where(eq(iscrizione.evento_id, eventoFound.id))
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

interface IniziaIscrizioneData {
	email: string;
	evento: string;
}

export async function iniziaIscrizione(
	db: PostgresJsDatabase,
	data: IniziaIscrizioneData,
	mailer: nodemailer.Transporter,
) {
	const eventoFound = await db
		.select()
		.from(evento)
		.where(eq(evento.sottodominio, data.evento))
		.then((res) => res[0]);

	if (!eventoFound) {
		throw new Error("Evento not found");
	}

	const eventoId = eventoFound.id;

	if (!eventoId) {
		throw new Error("Evento not found");
	}

	const iscrizioneId = await db
		.select()
		.from(iscrizione)
		.where(
			and(
				eq(iscrizione.mail_riferimento, data.email),
				eq(iscrizione.evento_id, eventoId),
			),
		)
		.then((res) => {
			if (res.length > 0) {
				return res[0].id;
			}
			return null;
		});

	console.log(iscrizioneId);

	// generate a token
	const emailIscrizioneOut = await db
		.insert(emailIscrizione)
		.values({
			token: nanoid(),
			evento_id: eventoId,
			mail: data.email,
		})
		.returning()
		.then((res) => res[0]);

	if (!emailIscrizioneOut) {
		throw new Error("Error inserting emailIscrizione");
	}

	let testo = `Ecco il link per proseguire con l'iscrizione: http://localhost:5173/iscrizione/${data.evento}/${emailIscrizioneOut.token}`;

	if (iscrizioneId) {
		testo = `ATTENZIONE: Ci risulta che ci sia già un bambino iscritto con questa mail. 
			Se non hai un secondo bambino da iscrivere, 
			contatta l'organizzazione per eventuali chiarimenti. 
			Se hai un secondo bambino da iscrivere, puoi proseguire con l'iscrizione.
			${testo}`;
	}

	await mailer.sendMail({
		from: '"Animatori Torreglia " <animatori@parrocchiatorreglia.it>', // sender address
		to: data.email, // list of receivers
		subject: `Iscrizione a: ${data.evento}`, // Subject line
		text: testo, // plain text body
	});
}

export async function getEventoFromSottodominio(
	db: PostgresJsDatabase,
	sottodominio: string,
) {
	return db
		.select()
		.from(evento)
		.where(eq(evento.sottodominio, sottodominio))
		.then((res) => {
			if (res.length > 0) {
				return res[0];
			}
			return null;
		});
}

export async function getTokenFromIdAndEventId(
	db: PostgresJsDatabase,
	token: string,
	evento_id: number,
) {
	return db
		.select()
		.from(emailIscrizione)
		.where(
			and(
				eq(emailIscrizione.token, token),
				eq(emailIscrizione.evento_id, evento_id),
			),
		)
		.then((res) => {
			if (res.length > 0) {
				return res[0];
			}
			return null;
		});
}

export async function getAllEvents(db: PostgresJsDatabase) {
	return db.select().from(evento);
}

interface LogInUserData {
	username_mail: string;
	password: string;
}

export async function logInUser(db: PostgresJsDatabase, body: LogInUserData) {
	const user = await db
		.select()
		.from(admin)
		.where(
			and(
				or(
					eq(admin.username, body.username_mail),
					eq(admin.email, body.username_mail),
				),
			),
		);

	if (user.length === 0) {
		return null;
	}

	if (!(await Bun.password.verify(body.password, user[0].password))) {
		return null;
	}

	// insert adminToken
	const token = nanoid();
	await db.insert(adminToken).values({
		admin_id: user[0].id,
		token: token,
	});

	return token;
}

interface LogInStatusData {
	token: string;
}

export async function checkLogin(
	db: PostgresJsDatabase,
	body: LogInStatusData,
) {
	const token = await db
		.select()
		.from(adminToken)
		.where(eq(adminToken.token, body.token));
	if (token.length === 0) {
		return null;
	}
	// generate a new token
	const newToken = nanoid();
	await db.insert(adminToken).values({
		admin_id: token[0].admin_id,
		token: newToken,
	});

	return newToken;
}
