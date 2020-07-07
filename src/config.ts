export const cfg = {
  serverPort: process.env.SERVER_PORT || 9090,
  apiSecretKey: process.env.API_SECRET_KEY,
}

export const dbConn = {
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT ? +process.env.DB_PORT : 5432,
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_DATABASE || "postgres",
}
