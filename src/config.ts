export const cfg = {
  serverPort: process.env.SERVER_PORT ? +process.env.SERVER_PORT : 5000,
  apiSecretKey: process.env.API_SECRET_KEY,
}

export const dbConn = {
  connectionString:
    process.env.DATABASE_URL ||
    "postgres://postgres:postgres@localhost:5432/postgres",
}
