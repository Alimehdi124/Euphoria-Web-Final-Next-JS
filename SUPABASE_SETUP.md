# Supabase Setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL editor.
3. Create an account in Supabase Authentication.
4. Promote that account to an administrator:

```sql
update public.profiles
set role = 'admin'
where email = 'admin@example.com';
```

5. Copy `.env.example` to `.env.local` and fill in:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=product-images
```

6. Start the app with `npm run dev` and open `/admin/login`.

The SQL creates the product, category, profile, order and order-item tables, row-level security policies, the public `product-images` storage bucket, and the stock-safe `create_order` function. Only users with `profiles.role = 'admin'` can use admin APIs or upload files.
