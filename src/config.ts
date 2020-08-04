export const cfg = {
  serverPort: process.env.SERVER_PORT || 9090,
  apiSecretKey: process.env.API_SECRET_KEY,
}

export const dbConn = {
  connectionString:
    process.env.DATABASE_URL ||
    "postgres://postgres:postgres@localhost:5432/postgres",
}
