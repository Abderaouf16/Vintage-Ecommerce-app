import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  pgEnum,
  serial,
  real,
  index,
} from "drizzle-orm/pg-core";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import type { AdapterAccountType } from "next-auth/adapters";
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
const connectionString = "postgres://postgres:postgres@localhost:5432/drizzle";
const pool = postgres(connectionString, { max: 1 });

export const db = drizzle(pool);

export const RoleEnum = pgEnum("role", ["user", "admin"]);

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name"),
  email: text("email").unique().notNull(),
  password: text("password"),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  twoFactorEnabled: boolean("twoFactorEnabled").default(false),
  role: RoleEnum("role").default("user"),
  customerID: text("customerID"),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    password: text("password"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const emailTokens = pgTable(
  "email-tokens",
  {
    id: text("id")
      .notNull()
      .$defaultFn(() => createId()),
    token: text("token").notNull(),
    email: text("email").unique().notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.id, verificationToken.token],
    }),
  })
);

export const passwordResetTokens = pgTable(
  "password_reset_tokens",
  {
    id: text("id")
      .notNull()
      .$defaultFn(() => createId()),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
    email: text("email").notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.id, vt.token] }),
  })
);

export const twoFactorTokens = pgTable(
  "two_factor_tokens",
  {
    id: text("id")
      .notNull()
      .$defaultFn(() => createId()),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
    email: text("email").notNull(),
    userID: text("userID").references(() => users.id, { onDelete: "cascade" }),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.id, vt.token] }),
  })
);

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  description: text("description").notNull(),
  title: text("title").notNull(),
  created: timestamp("created").defaultNow(),
  price: real("price").notNull(),
});

export const productVariants = pgTable("productVariants", {
  id: serial("id").primaryKey(),
  color: text("color").notNull(),
  productType: text("productType").notNull(),
  updated: timestamp("updated").defaultNow(),
  productID: serial("productID")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
});

export const variantImages = pgTable("variantImages", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  name: text("name").notNull(),
  size: real("size").notNull(),
  order: real("order").notNull(),
  variantID: serial("variantID")
    .notNull()
    .references(() => productVariants.id, { onDelete: "cascade" }),
});

export const variantTags = pgTable("variantTags", {
  id: serial("id").primaryKey(),
  tag: text("tag").notNull(),
  variantID: serial("variantID")
    .notNull()
    .references(() => productVariants.id, { onDelete: "cascade" }),
});

// Product have many product variants
export const productRelations = relations(products, ({ many }) => ({
  productVariants: many(productVariants, { relationName: "productVariants" }),
  reviews: many(reviews, { relationName: "reviews" }),
}));

// Product variants have one product
// Product variants have many variant images
// Product variants have many variant tags
export const productVariantsRelations = relations(
  productVariants,
  ({ many, one }) => ({
    product: one(products, {
      fields: [productVariants.productID],
      references: [products.id],
      relationName: "productVariants",
    }),
    variantImages: many(variantImages, { relationName: "variantImages" }),
    variantTags: many(variantTags, { relationName: "variantTags" }),
  })
);

// Variant images linked to one product variant
export const variantImagesRelations = relations(variantImages, ({ one }) => ({
  productVariants: one(productVariants, {
    fields: [variantImages.variantID],
    references: [productVariants.id],
    relationName: "variantImages",
  }),
}));

// Variant images linked to one product variant
export const variantTagRelations = relations(variantTags, ({ one }) => ({
  productVariants: one(productVariants, {
    fields: [variantTags.variantID],
    references: [productVariants.id],
    relationName: "variantTags",
  }),
}));

export const reviews = pgTable(
  "reviews",
  {
    id: serial("id").primaryKey(),
    rating: real("rating").notNull(),
    userID: text("userID")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    productID: serial("productID")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    comment: text("comment").notNull(),
    created: timestamp("created").defaultNow(),
  },
  // indexing them so queries are faster
  (table) => {
    return {
      productIdx: index("productIdx").on(table.productID),
      userIdx: index("userIdx").on(table.userID),
    };
  }
);

export const reviewRelations = relations(reviews, ({ one }) => ({
  user: one(users, {
    fields: [reviews.userID],
    references: [users.id],
    relationName: "user_reviews",
  }),
  product: one(products, {
    fields: [reviews.productID],
    references: [products.id],
    relationName: "reviews",
  }),
}));

export const userRelations = relations(users, ({ many }) => ({
  reviews: many(reviews, { relationName: "user_reviews" }),
}));



// Stores information about individual orders, such as the user who placed the order, the total amount, order status, and metadata related to payments.
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  
  // 🔓 Made optional by removing .notNull() so guests can buy
  userID: text("userID")
    .references(() => users.id, { onDelete: "set null" }), 
    
  total: real("total").notNull(),
  productsBuyCost: real("productsBuyCost").notNull(),
  status: text("status").notNull(), 
  created: timestamp("created").defaultNow(),
  
  // Your Cash on Delivery fields
  firstName: text("firstName").notNull(),
  lastName: text("lasttName").notNull(),
  phone: text("phone").notNull(),
  wilaya: text("wilaya").notNull(),               
  shippingMethod: text("shippingMethod").notNull(), 
  shippingCost: real("shippingCost").notNull(),   
  shippingAddress: text("shippingAddress"),
});



//Logic: Establishes relationships between the orders table and other tables.
export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userID],
    references: [users.id],
    relationName: "user_orders",
  }),
  orderProduct: many(orderProduct, { relationName: "orderProduct" }),
}));

//Acts as a join table to associate products and their quantities with specific orders. This enables orders to contain multiple products and tracks the quantity for each product.
export const orderProduct = pgTable("orderProduct", {
  id: serial("id").primaryKey(),
  quantity: integer("quantity").notNull(),
  productVariantID: serial("productVariantID")
    .notNull()
    .references(() => productVariants.id, { onDelete: "cascade" }),
  productID: serial("productID")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  orderID: serial("orderID")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
});

export const orderProductRelations = relations(orderProduct, ({ one }) => ({
  order: one(orders, {
    fields: [orderProduct.orderID],
    references: [orders.id],
    relationName: "orderProduct",
  }),
  product: one(products, {
    fields: [orderProduct.productID],
    references: [products.id],
    relationName: "products",
  }),
  productVariants: one(productVariants, {
    fields: [orderProduct.productVariantID],
    references: [productVariants.id],
    relationName: "productVariants",
  }),
}));
