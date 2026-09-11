CREATE TABLE dbo.Users (
  id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_Users PRIMARY KEY DEFAULT NEWID(),
  email NVARCHAR(320) NOT NULL CONSTRAINT UQ_Users_Email UNIQUE,
  password_hash NVARCHAR(255) NOT NULL,
  first_name NVARCHAR(100) NOT NULL DEFAULT N'',
  last_name NVARCHAR(100) NOT NULL DEFAULT N'',
  phone NVARCHAR(50) NULL,
  role NVARCHAR(20) NOT NULL DEFAULT N'customer' CONSTRAINT CK_Users_Role CHECK (role IN (N'customer', N'admin')),
  is_active BIT NOT NULL DEFAULT 1,
  created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);

CREATE TABLE dbo.Categories (
  id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_Categories PRIMARY KEY DEFAULT NEWID(),
  slug NVARCHAR(160) NOT NULL CONSTRAINT UQ_Categories_Slug UNIQUE,
  name_en NVARCHAR(160) NOT NULL,
  name_az NVARCHAR(160) NOT NULL,
  is_active BIT NOT NULL DEFAULT 1,
  created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);

CREATE TABLE dbo.Products (
  id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_Products PRIMARY KEY DEFAULT NEWID(),
  slug NVARCHAR(160) NOT NULL CONSTRAINT UQ_Products_Slug UNIQUE,
  name_en NVARCHAR(240) NOT NULL,
  name_az NVARCHAR(240) NOT NULL,
  description_en NVARCHAR(MAX) NOT NULL,
  description_az NVARCHAR(MAX) NOT NULL,
  brand NVARCHAR(160) NOT NULL,
  category NVARCHAR(40) NOT NULL,
  color NVARCHAR(80) NOT NULL,
  price DECIMAL(10,2) NOT NULL CONSTRAINT CK_Products_Price CHECK (price >= 0),
  discount_price DECIMAL(10,2) NULL,
  stock INT NOT NULL DEFAULT 0 CONSTRAINT CK_Products_Stock CHECK (stock >= 0),
  is_featured BIT NOT NULL DEFAULT 0,
  is_active BIT NOT NULL DEFAULT 1,
  created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
  updated_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);

CREATE TABLE dbo.ProductImages (
  id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_ProductImages PRIMARY KEY DEFAULT NEWID(),
  product_id UNIQUEIDENTIFIER NOT NULL CONSTRAINT FK_ProductImages_Products REFERENCES dbo.Products(id) ON DELETE CASCADE,
  data VARBINARY(MAX) NOT NULL,
  mime_type NVARCHAR(100) NOT NULL,
  original_name NVARCHAR(255) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_primary BIT NOT NULL DEFAULT 0,
  created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);

CREATE TABLE dbo.Orders (
  id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_Orders PRIMARY KEY DEFAULT NEWID(),
  user_id UNIQUEIDENTIFIER NOT NULL CONSTRAINT FK_Orders_Users REFERENCES dbo.Users(id),
  status NVARCHAR(20) NOT NULL DEFAULT N'pending' CONSTRAINT CK_Orders_Status CHECK (status IN (N'pending', N'processing', N'shipped', N'delivered', N'cancelled')),
  total DECIMAL(10,2) NOT NULL,
  payment_reference NVARCHAR(255) NULL,
  shipping_address NVARCHAR(MAX) NOT NULL DEFAULT N'{}',
  created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);

CREATE TABLE dbo.OrderItems (
  id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_OrderItems PRIMARY KEY DEFAULT NEWID(),
  order_id UNIQUEIDENTIFIER NOT NULL CONSTRAINT FK_OrderItems_Orders REFERENCES dbo.Orders(id) ON DELETE CASCADE,
  product_id UNIQUEIDENTIFIER NOT NULL CONSTRAINT FK_OrderItems_Products REFERENCES dbo.Products(id),
  product_name NVARCHAR(240) NOT NULL,
  quantity INT NOT NULL CONSTRAINT CK_OrderItems_Quantity CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL
);

CREATE INDEX IX_Products_Category ON dbo.Products(category, is_active);
CREATE INDEX IX_Orders_User ON dbo.Orders(user_id, created_at DESC);
CREATE UNIQUE INDEX UX_Orders_PaymentReference ON dbo.Orders(payment_reference) WHERE payment_reference IS NOT NULL;

-- Use scripts/create-admin.mjs to create the first administrator with a bcrypt hash.
