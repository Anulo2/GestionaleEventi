import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { bimbo } from "../schema";
import { iscriviBody } from "./type";
import { insertIscrizione, getIscrizioni } from "./utils/queryUtils";

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

const app = new Elysia()
	.state("db", db)
	.use(swagger())
	.use(cors())
	.get("/", ({ error }) => error(418, "I'm a teapot"))
	.get("/iscritti", async ({ store: { db } }) => {
		return await getIscrizioni(db);
	})
	.get("/carta_identita/:id", ({ params: { id } }) =>
		Bun.file(`./data/carte_identita/${id}.jpg`),
	)
	.get("/bonifico/:id", ({ params: { id } }) =>
		Bun.file(`./data/bonifici/${id}.pdf`),
	)
	.post(
		"/iscrivi",
		async ({ body, error, store: { db } }) => {
			try {
				await insertIscrizione(db, body);
				return "L'iscrizione è avvenuta con successo";
			} catch (e) {
				return error(500, "Si è verificato un errore durante l'iscrizione");
			}
		},
		{
			body: iscriviBody,
		},
	)
	.listen(process.env.PORT || 3000);

export type App = typeof app;

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
