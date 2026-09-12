import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import sql from "mssql/msnodesqlv8.js";

dotenv.config({ path: ".env.local" });
dotenv.config();

const required = ["SQL_SERVER", "SQL_DATABASE", "ADMIN_EMAIL", "ADMIN_PASSWORD"];
for (const name of required) if (!process.env[name]) throw new Error(`${name} is required`);
if (process.env.SQL_TRUSTED_CONNECTION !== "true" && (!process.env.SQL_USER || !process.env.SQL_PASSWORD)) throw new Error("SQL_USER and SQL_PASSWORD are required unless SQL_TRUSTED_CONNECTION=true");
const pool = await sql.connect({ server: process.env.SQL_SERVER, database: process.env.SQL_DATABASE, user: process.env.SQL_TRUSTED_CONNECTION === "true" ? undefined : process.env.SQL_USER, password: process.env.SQL_TRUSTED_CONNECTION === "true" ? undefined : process.env.SQL_PASSWORD, options: { encrypt: process.env.SQL_ENCRYPT !== "false", trustServerCertificate: process.env.SQL_TRUST_SERVER_CERTIFICATE === "true", trustedConnection: process.env.SQL_TRUSTED_CONNECTION === "true" } });
const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
await pool.request().input("email", sql.NVarChar(320), process.env.ADMIN_EMAIL.toLowerCase()).input("hash", sql.NVarChar(255), hash).query("MERGE dbo.Users AS target USING (SELECT @email AS email) AS source ON target.email = source.email WHEN MATCHED THEN UPDATE SET password_hash = @hash, role = N'admin', is_active = 1 WHEN NOT MATCHED THEN INSERT (email, password_hash, first_name, role) VALUES (@email, @hash, N'Admin', N'admin');");
await pool.close();
console.log(`Admin ready: ${process.env.ADMIN_EMAIL}`);
