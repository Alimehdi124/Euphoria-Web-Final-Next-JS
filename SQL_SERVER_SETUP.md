# SQL Server Setup

```powershell
# Install dependencies.

# Create the SQL Server administrator with a bcrypt password hash.

# Start the development server.
```

1. Create a database named `Euphoria` in SQL Server.
2. Run `sqlserver/schema.sql` in that database.
3. Copy `.env.example` to `.env.local` and set the SQL Server credentials and a long `AUTH_SECRET`.
4. Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env.local`. Development defaults are `admin@euphoria.local` and `EuphoriaAdmin123!`; change the password before production.
5. Configure Stripe Checkout success/webhook URLs and set `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` for payment confirmation.

Product images are stored as `varbinary(max)` in `dbo.ProductImages`, not as source files or static URLs. Product, user, order and stock operations use parameterized SQL Server queries and transactions.

## Test Payment

Stripe test mode uses this card in the Stripe test checkout:

```text
Card: 4242 4242 4242 4242
Expiry: any future date
CVC: any 3 digits
ZIP: any 5 digits
```

Never store card numbers in SQL Server. Use Stripe test keys for development and live keys only in a server-side production environment.
