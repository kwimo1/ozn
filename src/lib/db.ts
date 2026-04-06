import fs from "fs";
import path from "path";
import { tmpdir } from "os";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import Database from "better-sqlite3";

const dataDir = process.env.STORE_DATA_DIR
  ? process.env.STORE_DATA_DIR
  : process.env.VERCEL
    ? path.join(tmpdir(), "ozn-store")
    : path.join(process.cwd(), "data");
const databasePath = path.join(dataDir, "store.db");

fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(databasePath);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

function initializeDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id TEXT PRIMARY KEY,
      display_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'staff',
      last_login TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      token TEXT NOT NULL UNIQUE,
      admin_user_id TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (admin_user_id) REFERENCES admin_users (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'draft',
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      tags TEXT NOT NULL,
      price INTEGER NOT NULL,
      compare_price INTEGER,
      inventory INTEGER NOT NULL DEFAULT 0,
      featured INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS product_images (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      url TEXT NOT NULL,
      alt TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS variants (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      sku TEXT NOT NULL,
      label TEXT NOT NULL,
      color TEXT,
      price_override INTEGER,
      stock INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      order_number TEXT NOT NULL UNIQUE,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      shipping_address TEXT NOT NULL,
      city TEXT NOT NULL,
      country TEXT NOT NULL,
      notes TEXT,
      subtotal INTEGER NOT NULL,
      total INTEGER NOT NULL,
      payment_status TEXT NOT NULL DEFAULT 'pending',
      fulfillment_status TEXT NOT NULL DEFAULT 'new',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      title TEXT NOT NULL,
      variant TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      unit_price INTEGER NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE RESTRICT
    );

    CREATE TABLE IF NOT EXISTS hero_drop (
      id TEXT PRIMARY KEY,
      badge TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      image_url TEXT NOT NULL,
      cta_label TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  if (!columnExists("orders", "shipping_mode")) {
    db.exec("ALTER TABLE orders ADD COLUMN shipping_mode TEXT DEFAULT 'desk'");
  }

  normalizeCatalogLabels();

  const adminCount = db.prepare("SELECT COUNT(*) AS count FROM admin_users").get() as { count: number };

  if (adminCount.count === 0) {
    seedDatabase();
  }

  seedHeroDrop();
}

function columnExists(table: string, column: string) {
  const columns = db.prepare(`PRAGMA table_info(${table})`).all() as Array<{ name: string }>;
  return columns.some((entry) => entry.name === column);
}

function normalizeCatalogLabels() {
  const now = new Date().toISOString();

  db.prepare(
    `
      UPDATE products
      SET
        category = CASE
          WHEN category = 'Outerwear' THEN 'Vestes'
          WHEN category = 'Tops' THEN 'Maillots'
          ELSE category
        END,
        tags = REPLACE(REPLACE(tags, 'outerwear', 'vestes'), 'tops', 'maillots'),
        updated_at = ?
      WHERE category IN ('Outerwear', 'Tops')
        OR tags LIKE '%outerwear%'
        OR tags LIKE '%tops%'
    `,
  ).run(now);
}

function seedHeroDrop() {
  const now = new Date().toISOString();

  db.prepare(
    `INSERT OR IGNORE INTO hero_drop (id, badge, title, description, image_url, cta_label, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    "homepage-drop",
    "Nouveau Drop / جديد",
    "OZN Store capsule noire et dorée pour la street algérienne.",
    "Pièces fortes, palette noir-or, coupe moderne. Une seule vitrine de drop pensée pour convertir vite sur mobile.",
    "/seed/ozn-hero-drop.svg",
    "Voir le drop",
    now,
  );

  db.prepare(
    `
      UPDATE hero_drop
      SET badge = ?, title = ?, description = ?, image_url = ?, cta_label = ?, updated_at = ?
      WHERE id = 'homepage-drop'
    `,
  ).run(
    "Nouveau Drop / جديد",
    "OZN Store capsule noire et doree pour la street algerienne.",
    "Pieces fortes, palette noir-or et lecture simple pour une boutique plus claire sur mobile.",
    "/seed/ozn-hero-drop.svg",
    "Voir le drop",
    now,
  );
}

function seedDatabase() {
  const now = new Date().toISOString();
  const adminPassword = bcrypt.hashSync("admin12345", 10);
  const staffPassword = bcrypt.hashSync("staff12345", 10);

  const insertAdmin = db.prepare(`
    INSERT OR IGNORE INTO admin_users (id, display_name, email, password_hash, role, created_at)
    VALUES (@id, @displayName, @email, @passwordHash, @role, @createdAt)
  `);

  insertAdmin.run({
    id: "admin-primary",
    displayName: "OZN Admin",
    email: "admin@novathread.com",
    passwordHash: adminPassword,
    role: "admin",
    createdAt: now,
  });

  insertAdmin.run({
    id: "admin-staff",
    displayName: "Studio Staff",
    email: "staff@novathread.com",
    passwordHash: staffPassword,
    role: "staff",
    createdAt: now,
  });

  const insertProduct = db.prepare(`
    INSERT OR IGNORE INTO products (
      id, slug, title, status, description, category, tags, price, compare_price,
      inventory, featured, created_at, updated_at
    ) VALUES (
      @id, @slug, @title, @status, @description, @category, @tags, @price, @comparePrice,
      @inventory, @featured, @createdAt, @updatedAt
    )
  `);

  const insertImage = db.prepare(`
    INSERT OR IGNORE INTO product_images (id, product_id, url, alt, sort_order)
    VALUES (@id, @productId, @url, @alt, @sortOrder)
  `);

  const insertVariant = db.prepare(`
    INSERT OR IGNORE INTO variants (id, product_id, sku, label, color, price_override, stock)
    VALUES (@id, @productId, @sku, @label, @color, @priceOverride, @stock)
  `);

  const products = [
    {
      id: "product-night-shift-bomber",
      slug: "night-shift-bomber",
      title: "Night Shift Bomber",
      status: "published",
      description:
        "Structured nylon bomber with contrast piping, storm pocket details, and a cropped city silhouette built for late movement.",
      category: "Vestes",
      tags: "drop-01,featured,vestes",
      price: 14800,
      comparePrice: 17600,
      inventory: 14,
      featured: 1,
      image: "/seed/night-shift-bomber.svg",
      variants: [
        { label: "S", sku: "NSB-S", stock: 4 },
        { label: "M", sku: "NSB-M", stock: 6 },
        { label: "L", sku: "NSB-L", stock: 4 },
      ],
    },
    {
      id: "product-signal-cargo-pants",
      slug: "signal-cargo-pants",
      title: "Signal Cargo Pants",
      status: "published",
      description:
        "Relaxed technical cargo trouser with articulated knees, oversized utility pockets, and a clean tapered finish.",
      category: "Bottoms",
      tags: "drop-01,bestseller,bottoms",
      price: 11200,
      comparePrice: null,
      inventory: 19,
      featured: 1,
      image: "/seed/signal-cargo-pants.svg",
      variants: [
        { label: "30", sku: "SCP-30", stock: 5 },
        { label: "32", sku: "SCP-32", stock: 7 },
        { label: "34", sku: "SCP-34", stock: 7 },
      ],
    },
    {
      id: "product-after-hours-mesh-tee",
      slug: "after-hours-mesh-tee",
      title: "After Hours Mesh Tee",
      status: "published",
      description:
        "Lightweight mesh jersey tee with tonal print placement and oversized drop-shoulder proportions.",
      category: "Maillots",
      tags: "drop-01,new,maillots",
      price: 6200,
      comparePrice: null,
      inventory: 28,
      featured: 0,
      image: "/seed/after-hours-mesh-tee.svg",
      variants: [
        { label: "S", sku: "AHM-S", stock: 9 },
        { label: "M", sku: "AHM-M", stock: 10 },
        { label: "L", sku: "AHM-L", stock: 9 },
      ],
    },
    {
      id: "product-gridline-cap",
      slug: "gridline-cap",
      title: "Gridline Cap",
      status: "draft",
      description:
        "Six-panel cap with raised rubber patch branding and subtle reflective stitching around the brim.",
      category: "Accessories",
      tags: "draft,accessories",
      price: 3800,
      comparePrice: null,
      inventory: 12,
      featured: 0,
      image: "/seed/gridline-cap.svg",
      variants: [{ label: "One Size", sku: "GC-OS", stock: 12 }],
    },
  ];

  for (const product of products) {
    insertProduct.run({
      ...product,
      createdAt: now,
      updatedAt: now,
    });

    insertImage.run({
      id: `image-${product.slug}`,
      productId: product.id,
      url: product.image,
      alt: product.title,
      sortOrder: 0,
    });

    for (const variant of product.variants) {
      insertVariant.run({
        id: `variant-${product.slug}-${variant.label.toLowerCase().replace(/\s+/g, "-")}`,
        productId: product.id,
        sku: variant.sku,
        label: variant.label,
        color: null,
        priceOverride: null,
        stock: variant.stock,
      });
    }
  }

  const insertOrder = db.prepare(`
    INSERT OR IGNORE INTO orders (
      id, order_number, customer_name, customer_email, customer_phone,
      shipping_address, city, country, notes, subtotal, total, payment_status, shipping_mode,
      fulfillment_status, created_at, updated_at
    ) VALUES (
      @id, @orderNumber, @customerName, @customerEmail, @customerPhone,
      @shippingAddress, @city, @country, @notes, @subtotal, @total, @paymentStatus, @shippingMode,
      @fulfillmentStatus, @createdAt, @updatedAt
    )
  `);

  const insertOrderItem = db.prepare(`
    INSERT OR IGNORE INTO order_items (id, order_id, product_id, title, variant, quantity, unit_price)
    VALUES (@id, @orderId, @productId, @title, @variant, @quantity, @unitPrice)
  `);

  const seededOrders = [
    {
      id: "order-nt-2048",
      orderNumber: "NT-2048",
      customerName: "Yacine B.",
      customerEmail: "yacine@example.com",
      customerPhone: "+213555123456",
      shippingAddress: "Hai El Badr, Kouba",
      city: "Alger",
      country: "Algérie",
      notes: "Merci de confirmer avant livraison.",
      subtotal: 26000,
      total: 26000,
      paymentStatus: "paid",
      shippingMode: "domicile",
      fulfillmentStatus: "processing",
      createdAt: now,
      updatedAt: now,
      items: [
        {
          id: "order-item-nt-2048-1",
          productId: products[0].id,
          title: products[0].title,
          variant: "M",
          quantity: 1,
          unitPrice: 14800,
        },
        {
          id: "order-item-nt-2048-2",
          productId: products[1].id,
          title: products[1].title,
          variant: "32",
          quantity: 1,
          unitPrice: 11200,
        },
      ],
    },
    {
      id: "order-nt-2051",
      orderNumber: "NT-2051",
      customerName: "Lina A.",
      customerEmail: "",
      customerPhone: "+213661234567",
      shippingAddress: "",
      city: "Oran",
      country: "Algérie",
      notes: "",
      subtotal: 6200,
      total: 6200,
      paymentStatus: "pending",
      shippingMode: "desk",
      fulfillmentStatus: "new",
      createdAt: now,
      updatedAt: now,
      items: [
        {
          id: "order-item-nt-2051-1",
          productId: products[2].id,
          title: products[2].title,
          variant: "L",
          quantity: 1,
          unitPrice: 6200,
        },
      ],
    },
  ];

  for (const order of seededOrders) {
    insertOrder.run(order);

    for (const item of order.items) {
      insertOrderItem.run({
        orderId: order.id,
        ...item,
      });
    }
  }
}

initializeDatabase();

export type AdminUser = {
  id: string;
  displayName: string;
  email: string;
  passwordHash: string;
  role: "admin" | "staff";
  lastLogin: string | null;
  createdAt: string;
};

export type ProductImage = {
  id: string;
  productId: string;
  url: string;
  alt: string;
  sortOrder: number;
};

export type Variant = {
  id: string;
  productId: string;
  sku: string;
  label: string;
  color: string | null;
  priceOverride: number | null;
  stock: number;
};

export type Product = {
  id: string;
  slug: string;
  title: string;
  status: "draft" | "published" | "archived";
  description: string;
  category: string;
  tags: string;
  price: number;
  comparePrice: number | null;
  inventory: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  images: ProductImage[];
  variants: Variant[];
};

export type OrderItem = {
  id: string;
  orderId: string;
  productId: string;
  title: string;
  variant: string;
  quantity: number;
  unitPrice: number;
};

export type Order = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  wilaya: string;
  shippingMode: "desk" | "domicile";
  notes: string | null;
  subtotal: number;
  total: number;
  paymentStatus: "pending" | "paid" | "failed";
  fulfillmentStatus: "new" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
};

export type HeroDrop = {
  id: string;
  badge: string;
  title: string;
  description: string;
  imageUrl: string;
  ctaLabel: string;
  updatedAt: string;
};

type ProductRow = Omit<Product, "images" | "variants" | "featured" | "comparePrice"> & {
  featured: number;
  comparePrice: number | null;
};

type OrderRow = Omit<Order, "items">;

function mapProduct(row: ProductRow): Product {
  const images = db
    .prepare(
      `SELECT id, product_id AS productId, url, alt, sort_order AS sortOrder
       FROM product_images
       WHERE product_id = ?
       ORDER BY sort_order ASC`,
    )
    .all(row.id) as ProductImage[];
  const variants = db
    .prepare(
      `SELECT id, product_id AS productId, sku, label, color, price_override AS priceOverride, stock
       FROM variants
       WHERE product_id = ?
       ORDER BY label ASC`,
    )
    .all(row.id) as Variant[];

  return {
    ...row,
    featured: Boolean(row.featured),
    images,
    variants,
  };
}

function mapOrder(row: OrderRow): Order {
  const items = db
    .prepare(
      `SELECT id, order_id AS orderId, product_id AS productId, title, variant, quantity, unit_price AS unitPrice
       FROM order_items
       WHERE order_id = ?`,
    )
    .all(row.id) as OrderItem[];

  return {
    ...row,
    items,
  };
}

export function getPublishedProducts() {
  const rows = db
    .prepare(
      `SELECT id, slug, title, status, description, category, tags, price,
              compare_price AS comparePrice, inventory, featured,
              created_at AS createdAt, updated_at AS updatedAt
       FROM products
       WHERE status = 'published'
       ORDER BY featured DESC, created_at DESC`,
    )
    .all() as ProductRow[];
  return rows.map(mapProduct);
}

export function getAllProducts() {
  const rows = db
    .prepare(
      `SELECT id, slug, title, status, description, category, tags, price,
              compare_price AS comparePrice, inventory, featured,
              created_at AS createdAt, updated_at AS updatedAt
       FROM products
       ORDER BY created_at DESC`,
    )
    .all() as ProductRow[];
  return rows.map(mapProduct);
}

export function getProductBySlug(slug: string) {
  const row = db
    .prepare(
      `SELECT id, slug, title, status, description, category, tags, price,
              compare_price AS comparePrice, inventory, featured,
              created_at AS createdAt, updated_at AS updatedAt
       FROM products
       WHERE slug = ?`,
    )
    .get(slug) as ProductRow | undefined;
  return row ? mapProduct(row) : null;
}

export function getProductById(id: string) {
  const row = db
    .prepare(
      `SELECT id, slug, title, status, description, category, tags, price,
              compare_price AS comparePrice, inventory, featured,
              created_at AS createdAt, updated_at AS updatedAt
       FROM products
       WHERE id = ?`,
    )
    .get(id) as ProductRow | undefined;
  return row ? mapProduct(row) : null;
}

export function getCollectionProducts(category: string) {
  const rows = db
    .prepare(
      `SELECT id, slug, title, status, description, category, tags, price,
              compare_price AS comparePrice, inventory, featured,
              created_at AS createdAt, updated_at AS updatedAt
       FROM products
       WHERE status = 'published' AND lower(category) = lower(?)
       ORDER BY featured DESC, created_at DESC`,
    )
    .all(category) as ProductRow[];
  return rows.map(mapProduct);
}

export function getCollections() {
  return db
    .prepare(
      "SELECT category, COUNT(*) AS count FROM products WHERE status = 'published' GROUP BY category ORDER BY count DESC, category ASC",
    )
    .all() as Array<{ category: string; count: number }>;
}

export function getDashboardMetrics() {
  const orders = getOrders();
  const products = getAllProducts();

  return {
    revenue: orders.reduce((sum, order) => sum + order.total, 0),
    ordersCount: orders.length,
    pendingOrders: orders.filter((order) => order.fulfillmentStatus === "new").length,
    productCount: products.length,
    lowStock: products.filter(
      (product) => product.inventory <= 5 || product.variants.some((variant) => variant.stock <= 2),
    ).length,
    orders,
    products,
  };
}

export function getOrders() {
  const rows = db
    .prepare(
      `SELECT id, order_number AS orderNumber, customer_name AS customerName,
              customer_email AS customerEmail, customer_phone AS customerPhone,
              shipping_address AS shippingAddress, city AS wilaya, notes, subtotal, total,
              payment_status AS paymentStatus, COALESCE(shipping_mode, 'desk') AS shippingMode, fulfillment_status AS fulfillmentStatus,
              created_at AS createdAt, updated_at AS updatedAt
       FROM orders
       ORDER BY created_at DESC`,
    )
    .all() as OrderRow[];
  return rows.map(mapOrder);
}

export function getHeroDrop() {
  return db
    .prepare(
      `SELECT id, badge, title, description, image_url AS imageUrl, cta_label AS ctaLabel, updated_at AS updatedAt
       FROM hero_drop
       WHERE id = 'homepage-drop'`,
    )
    .get() as HeroDrop | undefined;
}

export function getAdminUserByEmail(email: string) {
  return db
    .prepare(
      `SELECT id, display_name AS displayName, email, password_hash AS passwordHash,
              role, last_login AS lastLogin, created_at AS createdAt
       FROM admin_users
       WHERE email = ?`,
    )
    .get(email) as AdminUser | undefined;
}

export function updateAdminLastLogin(id: string) {
  db.prepare("UPDATE admin_users SET last_login = ? WHERE id = ?").run(new Date().toISOString(), id);
}

export function createSessionRecord(adminUserId: string, token: string, expiresAt: string) {
  db.prepare(
    "INSERT INTO sessions (id, token, admin_user_id, expires_at, created_at) VALUES (?, ?, ?, ?, ?)",
  ).run(randomUUID(), token, adminUserId, expiresAt, new Date().toISOString());
}

export function deleteSessionRecord(token: string) {
  db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
}

export function getSessionByToken(token: string) {
  const session = db
    .prepare(
      `SELECT sessions.token, sessions.expires_at AS expiresAt,
              admin_users.id, admin_users.display_name AS displayName, admin_users.email,
              admin_users.password_hash AS passwordHash, admin_users.role,
              admin_users.last_login AS lastLogin, admin_users.created_at AS createdAt
       FROM sessions
       INNER JOIN admin_users ON admin_users.id = sessions.admin_user_id
       WHERE sessions.token = ?`,
    )
    .get(token) as
    | (AdminUser & {
        token: string;
        expiresAt: string;
      })
    | undefined;

  if (!session) {
    return null;
  }

  return session;
}

export type ProductInput = {
  id?: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  tags: string;
  price: number;
  comparePrice: number | null;
  inventory: number;
  featured: boolean;
  status: "draft" | "published" | "archived";
  variants: Array<{
    label: string;
    sku: string;
    stock: number;
    color?: string | null;
    priceOverride?: number | null;
  }>;
  imageUrls: Array<{
    url: string;
    alt: string;
  }>;
};

export type HeroDropInput = {
  badge: string;
  title: string;
  description: string;
  imageUrl: string;
  ctaLabel: string;
};

export function saveProduct(input: ProductInput) {
  const now = new Date().toISOString();
  const id = input.id ?? randomUUID();

  const transaction = db.transaction(() => {
    const existing = input.id ? getProductById(input.id) : null;

    if (existing) {
      db.prepare(
        `UPDATE products
         SET slug = ?, title = ?, status = ?, description = ?, category = ?, tags = ?, price = ?,
             compare_price = ?, inventory = ?, featured = ?, updated_at = ?
         WHERE id = ?`,
      ).run(
        input.slug,
        input.title,
        input.status,
        input.description,
        input.category,
        input.tags,
        input.price,
        input.comparePrice,
        input.inventory,
        input.featured ? 1 : 0,
        now,
        id,
      );

      db.prepare("DELETE FROM product_images WHERE product_id = ?").run(id);
      db.prepare("DELETE FROM variants WHERE product_id = ?").run(id);
    } else {
      db.prepare(
        `INSERT INTO products (
           id, slug, title, status, description, category, tags, price,
           compare_price, inventory, featured, created_at, updated_at
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ).run(
        id,
        input.slug,
        input.title,
        input.status,
        input.description,
        input.category,
        input.tags,
        input.price,
        input.comparePrice,
        input.inventory,
        input.featured ? 1 : 0,
        now,
        now,
      );
    }

    const insertImage = db.prepare(
      "INSERT INTO product_images (id, product_id, url, alt, sort_order) VALUES (?, ?, ?, ?, ?)",
    );
    input.imageUrls.forEach((image, index) => {
      insertImage.run(randomUUID(), id, image.url, image.alt, index);
    });

    const insertVariant = db.prepare(
      "INSERT INTO variants (id, product_id, sku, label, color, price_override, stock) VALUES (?, ?, ?, ?, ?, ?, ?)",
    );
    input.variants.forEach((variant) => {
      insertVariant.run(
        randomUUID(),
        id,
        variant.sku,
        variant.label,
        variant.color ?? null,
        variant.priceOverride ?? null,
        variant.stock,
      );
    });
  });

  transaction();
  return id;
}

export function updateProductStatus(id: string, status: Product["status"]) {
  db.prepare("UPDATE products SET status = ?, updated_at = ? WHERE id = ?").run(
    status,
    new Date().toISOString(),
    id,
  );
}

export function deleteProduct(id: string) {
  const linkedOrder = db.prepare("SELECT COUNT(*) AS count FROM order_items WHERE product_id = ?").get(id) as {
    count: number;
  };

  if (linkedOrder.count > 0) {
    updateProductStatus(id, "archived");
    return;
  }

  db.prepare("DELETE FROM products WHERE id = ?").run(id);
}

export function updateOrderStatus(id: string, fulfillmentStatus: Order["fulfillmentStatus"]) {
  db.prepare("UPDATE orders SET fulfillment_status = ?, updated_at = ? WHERE id = ?").run(
    fulfillmentStatus,
    new Date().toISOString(),
    id,
  );
}

export function saveHeroDrop(input: HeroDropInput) {
  db.prepare(
    `INSERT INTO hero_drop (id, badge, title, description, image_url, cta_label, updated_at)
     VALUES ('homepage-drop', ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       badge = excluded.badge,
       title = excluded.title,
       description = excluded.description,
       image_url = excluded.image_url,
       cta_label = excluded.cta_label,
       updated_at = excluded.updated_at`,
  ).run(input.badge, input.title, input.description, input.imageUrl, input.ctaLabel, new Date().toISOString());
}

export function clearHeroDrop() {
  db.prepare("DELETE FROM hero_drop WHERE id = 'homepage-drop'").run();
}

export function createOrder(input: {
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  shippingAddress?: string;
  wilaya: string;
  shippingMode: "desk" | "domicile";
  notes?: string;
  items: Array<{
    productId: string;
    title: string;
    variant: string;
    quantity: number;
    unitPrice: number;
  }>;
}) {
  const now = new Date().toISOString();
  const id = randomUUID();
  const orderNumber = `NT-${Math.floor(1000 + Math.random() * 9000)}`;
  const subtotal = input.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  const transaction = db.transaction(() => {
    db.prepare(
      `INSERT INTO orders (
         id, order_number, customer_name, customer_email, customer_phone,
         shipping_address, city, country, notes, subtotal, total,
         payment_status, shipping_mode, fulfillment_status, created_at, updated_at
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, 'new', ?, ?)`,
    ).run(
      id,
      orderNumber,
      input.customerName,
      input.customerEmail ?? "",
      input.customerPhone,
      input.shippingAddress ?? "",
      input.wilaya,
      "Algérie",
      input.notes ?? "",
      subtotal,
      subtotal,
      input.shippingMode,
      now,
      now,
    );

    const insertItem = db.prepare(
      "INSERT INTO order_items (id, order_id, product_id, title, variant, quantity, unit_price) VALUES (?, ?, ?, ?, ?, ?, ?)",
    );
    const updateInventory = db.prepare("UPDATE products SET inventory = inventory - ?, updated_at = ? WHERE id = ?");
    const updateVariant = db.prepare(
      "UPDATE variants SET stock = stock - ? WHERE product_id = ? AND label = ? AND stock >= ?",
    );

    input.items.forEach((item) => {
      insertItem.run(randomUUID(), id, item.productId, item.title, item.variant, item.quantity, item.unitPrice);
      updateInventory.run(item.quantity, now, item.productId);
      updateVariant.run(item.quantity, item.productId, item.variant, item.quantity);
    });
  });

  transaction();

  return {
    id,
    orderNumber,
    total: subtotal,
  };
}

export default db;
