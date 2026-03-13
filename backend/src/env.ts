import dotenv from "dotenv";

dotenv.config();

const required = (key: string) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required env var: ${key}`);
  }
  return value;
};

const port = Number(process.env.PORT ?? 5050);

export const env = {
  port,
  databaseUrl: required("DATABASE_URL"),
  jwtSecret: required("JWT_SECRET"),
  corsOrigin: process.env.CORS_ORIGIN ?? "*",
  baseUrl: process.env.BASE_URL ?? `http://localhost:${port}`
};
