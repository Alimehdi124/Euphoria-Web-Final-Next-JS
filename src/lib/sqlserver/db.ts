import sql from "mssql";

let poolPromise: Promise<sql.ConnectionPool> | null = null;

export function databaseConfigured() {
  return Boolean(process.env.SQL_SERVER && process.env.SQL_DATABASE && process.env.SQL_USER && process.env.SQL_PASSWORD);
}

function config(): sql.config {
  return {
    server: process.env.SQL_SERVER || "",
    database: process.env.SQL_DATABASE || "",
    user: process.env.SQL_USER || "",
    password: process.env.SQL_PASSWORD || "",
    options: {
      encrypt: process.env.SQL_ENCRYPT !== "false",
      trustServerCertificate: process.env.SQL_TRUST_SERVER_CERTIFICATE === "true"
    },
    pool: { max: 10, min: 0, idleTimeoutMillis: 30000 }
  };
}

export async function getDb() {
  if (!databaseConfigured()) return null;
  if (!poolPromise) {
    poolPromise = new sql.ConnectionPool(config()).connect().catch((error: unknown) => {
      poolPromise = null;
      throw error;
    });
  }
  return poolPromise;
}

export { sql };
