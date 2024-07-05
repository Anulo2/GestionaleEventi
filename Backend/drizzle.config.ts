/** @type { import("drizzle-kit").Config } */
export default {
	schema: "./schema.ts",
	out: "./migrations",
	//driver: "pg",
	dialect: "postgresql",
	dbCredentials: {
		port: "5432",
		user: process.env.POSTGRES_USER,
		password: process.env.POSTGRES_PASSWORD,
		database: process.env.POSTGRES_DB,
		host: process.env.POSTGRES_HOST,
	},
	verbose: true,
	strict: true,
};
