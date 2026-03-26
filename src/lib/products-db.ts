import fs from "node:fs";
import path from "node:path";
import initSqlJs, { type Database, type SqlJsStatic } from "sql.js/dist/sql-asm.js";

export type ProductCategory =
  | "ipad"
  | "iphone"
  | "macbook"
  | "airpods"
  | "applewatch";

export type ProductVariant = {
  variantId: number;
  productId: string;
  category: ProductCategory;
  name: string;
  color: string;
  memoryGb?: number;
  storage?: string;
  lte?: string;
  simType?: string;
  price: number;
  priceOld: number;
};

export type Product = {
  productId: string;
  category: ProductCategory;
  slug: string;
  title: string;
  variants: ProductVariant[];
  colors: string[];
  memoryOptionsGb: number[];
  storageOptions: string[];
  lteOptions: string[];
  simTypeOptions: string[];
};

type TableRow =
  | {
      id: number;
      name: string;
      color: string;
      memory_gb: number;
      price: number;
      price_old: number;
      lte: string;
    }
  | {
      id: number;
      name: string;
      color: string;
      memory_gb: number;
      price: number;
      price_old: number;
      sim_type: string;
    }
  | {
      id: number;
      name: string;
      color: string;
      storage: string;
      price: number;
      price_old: number;
    }
  | {
      id: number;
      name: string;
      color: string;
      price: number;
      price_old: number;
    };

const DB_FILENAME = "products.db";

let SQL_PROMISE: Promise<SqlJsStatic> | null = null;
let DB_PROMISE: Promise<Database> | null = null;

function getDbFilePath() {
  // next.js server runtime:
  // - in local dev you likely run from `my-app/`, so DB is at `<cwd>/products.db`
  // - on Vercel the runtime cwd may be the repository root, so DB can be at
  //   `<cwd>/apple_frontend3/products.db` (this project) or `<cwd>/my-app/products.db`
  const cwd = process.cwd();
  const candidates = [
    path.join(cwd, DB_FILENAME),
    path.join(cwd, "apple_frontend3", DB_FILENAME),
    path.join(cwd, "my-app", DB_FILENAME),
  ];

  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }

  // Keep original default to make the thrown ENOENT path obvious in logs.
  return candidates[0];
}

async function getSql() {
  SQL_PROMISE ??= initSqlJs();
  return await SQL_PROMISE;
}

async function getDb() {
  DB_PROMISE ??= (async () => {
    const SQL = await getSql();
    const file = fs.readFileSync(getDbFilePath());
    return new SQL.Database(file);
  })();
  return await DB_PROMISE;
}

function toSlug(input: string) {
  // latin + digits only; stable URLs
  return input
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function uniqSorted<T>(arr: T[]) {
  return Array.from(new Set(arr)).sort((a, b) =>
    String(a).localeCompare(String(b), "ru")
  );
}

function stripPrefix(name: string) {
  return name
    .replace(/^Планшет\s+Apple\s+/i, "")
    .replace(/^Смартфон\s+Apple\s+/i, "")
    .replace(/^Наушники\s+Apple\s+/i, "")
    .replace(/^Apple\s+/i, "");
}

function baseModelTitleFromRowName(name: string, color: string) {
  // 1) remove "Планшет Apple", etc.
  let s = stripPrefix(name).trim();
  // 2) remove trailing color (it is duplicated in column)
  const colorRe = new RegExp(`\\s+${escapeRegExp(color)}$`, "i");
  s = s.replace(colorRe, "").trim();
  // 3) remove memory suffix like "256 ГБ"
  s = s.replace(/\s+\d+\s*гб$/i, "").trim();
  return s;
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function selectAll<T extends TableRow>(table: ProductCategory): Promise<T[]> {
  const db = await getDb();
  const res = db.exec(`SELECT * FROM ${table};`)[0];
  if (!res) return [];
  const { columns, values } = res;
  return values.map((row) => {
    const obj: Record<string, unknown> = {};
    for (let i = 0; i < columns.length; i++) obj[columns[i]] = row[i];
    return obj as T;
  });
}

type Index = {
  productsBySlug: Map<string, Product>;
  productsByCategory: Map<ProductCategory, Product[]>;
};

let INDEX_PROMISE: Promise<Index> | null = null;

async function buildIndex(): Promise<Index> {
  const categories: ProductCategory[] = [
    "ipad",
    "iphone",
    "macbook",
    "airpods",
    "applewatch",
  ];

  const productsBySlug = new Map<string, Product>();
  const productsByCategory = new Map<ProductCategory, Product[]>();

  for (const category of categories) {
    const rows = await selectAll<TableRow>(category);
    const byBaseTitle = new Map<string, TableRow[]>();

    for (const r of rows) {
      const baseTitle = baseModelTitleFromRowName(r.name, r.color);
      const arr = byBaseTitle.get(baseTitle) ?? [];
      arr.push(r);
      byBaseTitle.set(baseTitle, arr);
    }

    const products: Product[] = [];

    for (const [baseTitle, group] of byBaseTitle) {
      const slug = toSlug(baseTitle);
      const productId = `${category}:${slug}`;

      const variants: ProductVariant[] = group.map((r) => {
        if (category === "ipad") {
          const rr = r as Extract<TableRow, { lte: string }>;
          return {
            variantId: rr.id,
            productId,
            category,
            name: rr.name,
            color: rr.color,
            memoryGb: rr.memory_gb,
            lte: rr.lte,
            price: rr.price,
            priceOld: rr.price_old,
          };
        }
        if (category === "iphone") {
          const rr = r as Extract<TableRow, { sim_type: string }>;
          return {
            variantId: rr.id,
            productId,
            category,
            name: rr.name,
            color: rr.color,
            memoryGb: rr.memory_gb,
            simType: rr.sim_type,
            price: rr.price,
            priceOld: rr.price_old,
          };
        }
        if (category === "macbook") {
          const rr = r as Extract<TableRow, { storage: string }>;
          return {
            variantId: rr.id,
            productId,
            category,
            name: rr.name,
            color: rr.color,
            storage: rr.storage,
            price: rr.price,
            priceOld: rr.price_old,
          };
        }
        const rr = r as Extract<TableRow, { price: number }>;
        return {
          variantId: rr.id,
          productId,
          category,
          name: rr.name,
          color: rr.color,
          price: rr.price,
          priceOld: rr.price_old,
        };
      });

      const product: Product = {
        productId,
        category,
        slug,
        title: baseTitle,
        variants,
        colors: uniqSorted(variants.map((v) => v.color)),
        memoryOptionsGb: uniqSorted(
          variants.map((v) => v.memoryGb).filter((v): v is number => !!v)
        ),
        storageOptions: uniqSorted(
          variants.map((v) => v.storage).filter((v): v is string => !!v)
        ),
        lteOptions: uniqSorted(
          variants.map((v) => v.lte).filter((v): v is string => !!v)
        ),
        simTypeOptions: uniqSorted(
          variants.map((v) => v.simType).filter((v): v is string => !!v)
        ),
      };

      products.push(product);
      productsBySlug.set(slug, product);
    }

    products.sort((a, b) => a.title.localeCompare(b.title, "ru"));
    productsByCategory.set(category, products);
  }

  return { productsBySlug, productsByCategory };
}

async function getIndex() {
  INDEX_PROMISE ??= buildIndex();
  return await INDEX_PROMISE;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const idx = await getIndex();
  return idx.productsBySlug.get(slug) ?? null;
}

export async function getProductsByCategory(
  category: ProductCategory
): Promise<Product[]> {
  const idx = await getIndex();
  return idx.productsByCategory.get(category) ?? [];
}

