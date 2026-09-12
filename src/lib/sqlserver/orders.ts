import { getDb, sql } from "@/lib/sqlserver/db";

export async function createOrder(userId: string, items: { slug: string; quantity: number }[], shippingAddress: Record<string, string>, paymentReference?: string, status = "pending") {
  const db = await getDb();
  if (!db) throw new Error("SQL Server is not configured");
  const transaction = new sql.Transaction(db);
  try {
    await transaction.begin();
    if (paymentReference) {
      const existing = await transaction.request().input("payment", sql.NVarChar(255), paymentReference).query("SELECT TOP 1 id FROM dbo.Orders WHERE payment_reference=@payment");
      if (existing.recordset[0]) { await transaction.commit(); return existing.recordset[0].id.toString(); }
    }
    let total = 0;
    const checked: { id: string; name: string; price: number; quantity: number }[] = [];
    for (const item of items) {
      const result = await transaction.request().input("slug", sql.NVarChar(160), item.slug).query("SELECT TOP 1 id, name_en, price, stock FROM dbo.Products WITH (UPDLOCK, ROWLOCK) WHERE slug=@slug AND is_active=1");
      const product = result.recordset[0];
      if (!product || product.stock < item.quantity) throw new Error(`Insufficient stock for ${item.slug}`);
      checked.push({ id: product.id.toString(), name: product.name_en, price: Number(product.price), quantity: item.quantity }); total += Number(product.price) * item.quantity;
    }
    const order = await transaction.request().input("userId", sql.UniqueIdentifier, userId).input("total", sql.Decimal(10, 2), total).input("payment", sql.NVarChar(255), paymentReference || null).input("status", sql.NVarChar(20), status).input("shipping", sql.NVarChar(sql.MAX), JSON.stringify(shippingAddress || {})).query("INSERT INTO dbo.Orders (user_id, total, payment_reference, status, shipping_address) OUTPUT INSERTED.id VALUES (@userId, @total, @payment, @status, @shipping)");
    const orderId = order.recordset[0].id.toString();
    for (const item of checked) await transaction.request().input("orderId", sql.UniqueIdentifier, orderId).input("productId", sql.UniqueIdentifier, item.id).input("name", sql.NVarChar(240), item.name).input("quantity", sql.Int, item.quantity).input("price", sql.Decimal(10, 2), item.price).query("INSERT INTO dbo.OrderItems (order_id, product_id, product_name, quantity, unit_price) VALUES (@orderId, @productId, @name, @quantity, @price); UPDATE dbo.Products SET stock=stock-@quantity, updated_at=SYSUTCDATETIME() WHERE id=@productId");
    await transaction.commit();
    return orderId;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
