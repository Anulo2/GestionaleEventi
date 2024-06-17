// import { type Config } from "drizzle-kit";

export default {
  schema: "./src/drizzle/schema.js",
  out: "./src/drizzle/migrations/",
  driver: "better-sqlite",
  dialect: "sqlite",
  dbCredentials: {
    url: './src/drizzle/db.sqlite',
  },
};
