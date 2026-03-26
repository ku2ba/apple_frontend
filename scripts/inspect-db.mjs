import fs from "node:fs";
import initSqlJs from "sql.js";

const DB_PATH = new URL("../products.db", import.meta.url);

function printRows(title, rows) {
  console.log(`\n== ${title} ==`);
  for (const r of rows) console.log(r);
}

const SQL = await initSqlJs();
const file = fs.readFileSync(DB_PATH);
const db = new SQL.Database(file);

const tablesRes =
  db.exec(
    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name;"
  )[0]?.values ?? [];

const tables = tablesRes.map((v) => String(v[0]));
printRows("tables", tables);

for (const t of tables) {
  const create =
    db.exec(
      "SELECT sql FROM sqlite_master WHERE type='table' AND name = ? LIMIT 1;",
      [t]
    )[0]?.values?.[0]?.[0] ?? null;
  console.log(`\n--- ${t} ---`);
  if (create) console.log(String(create));

  const cols =
    db.exec(`PRAGMA table_info(${JSON.stringify(t)});`)[0]?.values ?? [];
  console.log("columns:");
  for (const c of cols) {
    const [cid, name, type, notnull, dflt_value, pk] = c;
    console.log(
      `- ${String(name)} ${String(type)}${pk ? " PK" : ""}${
        notnull ? " NOT NULL" : ""
      }${dflt_value != null ? ` DEFAULT ${String(dflt_value)}` : ""}`
    );
  }
}

