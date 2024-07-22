import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import {
	iniziaIscrizioneBody,
	iscriviBody,
	loginBody,
	loginStatus,
} from "./type";
import {
	insertIscrizione,
	getIscrizioni,
	iniziaIscrizione,
	getEventoFromSottodominio,
	getTokenFromIdAndEventId,
	getAllEvents,
	logInUser,
	checkLogin,
} from "./utils/queryUtils";
import nodemailer from "nodemailer";

console.log("Starting migrations");
const migrationClient = postgres(
	`postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}/${process.env.POSTGRES_DB}`,
);
const dbMigrations = drizzle(migrationClient);
await migrate(dbMigrations, { migrationsFolder: "migrations" });
await migrationClient.end();
console.log("Migrations complete");

const dbClient = postgres(
	`postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}/${process.env.POSTGRES_DB}`,
);
const db = drizzle(dbClient);
console.log("Connected to database");

const transporter = nodemailer.createTransport({
	host: "smtp.ethereal.email",
	port: 587,
	secure: false, // Use `true` for port 465, `false` for all other ports
	auth: {
		user: "al97@ethereal.email",
		pass: "nC2nb3XfYFWy1kcDgm",
	},
});

const app = new Elysia({})
	.use(cors())
	.state("db", db)
	.state("mailer", transporter)
	.use(swagger())
	.get("/", ({ error }) => error(418, "I'm a teapot"))
	.post(
		"/login",
		async ({ body, store: { db }, error }) => {
			const loginStatus = await logInUser(db, body);
			if (!loginStatus) {
				return error(401, "Credenziali non valide");
			}
			return loginStatus;
		},
		{
			body: loginBody,
		},
	)
	.post(
		"/login/status",
		async ({ error, body, store: { db } }) => {
			const loginStatus = await checkLogin(db, body);
			if (!loginStatus) {
				return error(401, "Non autorizzato");
			}
			return loginStatus;
		},
		{
			body: loginStatus,
		},
	)
	.get(
		"/iscritti/:sottodominio",
		async ({ store: { db }, params: { sottodominio }, error }) => {
			const eventoFound = await getEventoFromSottodominio(db, sottodominio);
			if (!eventoFound) {
				return error(404, "Evento non trovato");
			}
			return await getIscrizioni(db, eventoFound);
		},
	)
	.get("/eventi", async ({ store: { db } }) => {
		return await getAllEvents(db);
	})
	.get(
		"/evento/:sottodominio",
		async ({ params: { sottodominio }, store: { db }, error }) => {
			const evento = await getEventoFromSottodominio(db, sottodominio);
			if (!evento) {
				return error(404, "Evento non trovato");
			}
			return evento;
		},
	)
	.get("/carta_identita/:id", ({ params: { id } }) =>
		Bun.file(`./data/carte_identita/${id}.jpg`),
	)
	.get("/bonifico/:id", ({ params: { id } }) =>
		Bun.file(`./data/bonifici/${id}.pdf`),
	)

	.post(
		"/iscrivi",
		async ({ body, error, store: { db, mailer } }) => {
			console.log(error);
			let eventoFound = null;
			let tokenFound = null;

			eventoFound = await getEventoFromSottodominio(db, body.evento);
			if (!eventoFound) {
				return error(404, "Evento non trovato");
			}

			tokenFound = await getTokenFromIdAndEventId(
				db,
				body.token,
				eventoFound.id,
			);
			if (!tokenFound) {
				return error(404, "Token non trovato");
			}

			if (tokenFound.is_used || tokenFound.expires_at < new Date()) {
				return error(403, "Token scaduto o già utilizzato");
			}

			await insertIscrizione(db, body, eventoFound, tokenFound, mailer);
			return "L'iscrizione è avvenuta con successo";
		},
		{
			body: iscriviBody,
		},
	)
	.get(
		"/iscrivi/:evento",
		async ({ query: { token }, store: { db }, error, params: { evento } }) => {
			// getter to verify if the token is valid
			const eventoFound = await getEventoFromSottodominio(db, evento);
			if (!eventoFound) {
				return error(404, "Evento non trovato");
			}
			const tokenFound = await getTokenFromIdAndEventId(
				db,
				token,
				eventoFound.id,
			);
			if (!tokenFound) {
				return error(404, "Token non trovato");
			}
			if (tokenFound.is_used || tokenFound.expires_at < new Date()) {
				return error(403, "Token scaduto o già utilizzato");
			}
			return "Token valido";
		},
		{
			query: t.Object({
				token: t.String(),
			}),
		},
	)
	.post(
		"/email",
		async ({ body, error, store: { db, mailer } }) => {
			try {
				await iniziaIscrizione(db, body, mailer);
				return "L'iscrizione è stata avviata con successo";
			} catch (e) {
				return error(
					500,
					"Si è verificato un errore durante l'avvio dell'iscrizione",
				);
			}
		},
		{
			body: iniziaIscrizioneBody,
		},
	)
	.listen(process.env.PORT || 3000);

export type App = typeof app;

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
