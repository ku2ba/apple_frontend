import fs from "fs";
import path from "path";

/** Генерирует slug из имени папки: "iPhone 16 Pro Max" -> "iphone-16-pro-max" */
function folderToSlug(folderName: string): string {
  return folderName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

/** Все модели iPhone: сканируем public/iphone или задаём вручную. */
const IPHONE_FOLDERS = [
  "iPhone 11",
  "iPhone 12",
  "iPhone 13",
  "iPhone 14",
  "iPhone 14 Pro",
  "iPhone 14 Pro Max",
  "iPhone 15",
  "iPhone 15 Pro",
  "iPhone 15 Pro Max",
  "iPhone 16",
  "iPhone 16 Plus",
  "iPhone 16 Pro",
  "iPhone 16 Pro Max",
  "iPhone 16e",
  "iPhone 17",
  "iPhone 17 Pro",
  "iPhone 17 Pro Max",
  "iPhone Air",
];

export const MODEL_SLUG_TO_FOLDER: Record<string, string> = Object.fromEntries(
  IPHONE_FOLDERS.map((folder) => [folderToSlug(folder), folder])
);

export const MODELS: Record<
  string,
  { title: string; folderName: string }
> = Object.fromEntries(
  Object.entries(MODEL_SLUG_TO_FOLDER).map(([slug, folderName]) => [
    slug,
    { title: folderName, folderName },
  ])
);

const DEFAULT_COLORS: Record<string, string[]> = {};

export function getColorsForModel(modelSlug: string): string[] {
  const folderName = MODEL_SLUG_TO_FOLDER[modelSlug];
  if (!folderName) return [];

  const dir = path.join(process.cwd(), "public", "iphone", folderName);
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const colors = entries
      .filter((e) => e.isDirectory() && !e.name.startsWith("."))
      .map((e) => e.name)
      .sort((a, b) => a.localeCompare(b, "ru"));
    return colors.length > 0 ? colors : DEFAULT_COLORS[modelSlug] ?? [];
  } catch {
    return DEFAULT_COLORS[modelSlug] ?? [];
  }
}

function pluralize(n: number) {
  if (n === 1) return "товар";
  if (n >= 2 && n <= 4) return "товара";
  return "товаров";
}

export function getColorCountLabel(count: number) {
  return `${count} ${pluralize(count)}`;
}

/** Цвет кружка для выбора цвета по названию папки (без учёта регистра). */
const COLOR_HEX: Record<string, string> = {
  белый: "#f5f5f0",
  голубой: "#a8d4e6",
  зеленый: "#b8d4a8",
  зелёный: "#b8d4a8",
  лавандовый: "#d4c4e8",
  черный: "#2c2c2c",
  чёрный: "#2c2c2c",
  синий: "#4a6fa5",
  ультрамарин: "#3d5a80",
  ораньжевый: "#fb923c",
  "натуральный титан": "#a8a29e",
  титан: "#a8a29e",
  "чёрный титан": "#2c2c2c",
  серый: "#9ca3af",
  розовый: "#f9a8d4",
  жёлтый: "#fde047",
  оранжевый: "#fb923c",
  красный: "#ef4444",
  фиолетовый: "#a78bfa",
  золотой: "#eab308",
  "розовая пудра": "#fbcfe8",
  "чёрный оникс": "#1c1917",
};

export function getColorHex(colorName: string): string {
  const key = colorName.toLowerCase().trim();
  return COLOR_HEX[key] ?? "#9ca3af";
}

const IMG_EXT = [".jpg", ".jpeg", ".png", ".webp"];

/** Превью модели из папки модели: файл с "preview" в имени (iPhone .. preview). */
export function getPreviewImageForIphoneModel(modelSlug: string): string | null {
  const folderName = MODEL_SLUG_TO_FOLDER[modelSlug];
  if (!folderName) return null;
  const dir = path.join(process.cwd(), "public", "iphone", folderName);
  try {
    const names = fs.readdirSync(dir);
    const file = names.find(
      (n) =>
        n.startsWith(".") === false &&
        IMG_EXT.some((ext) => n.toLowerCase().endsWith(ext)) &&
        n.toLowerCase().includes("preview")
    );
    if (!file) return null;
    return `/iphone/${encodeURIComponent(folderName)}/${encodeURIComponent(file)}`;
  } catch {
    return null;
  }
}

/** Путь к первому изображению в папке цвета. Пока для всех карточек — из iPhone 17/белый. */
export function getPlaceholderImageBasePath(): string {
  const folderName = "iPhone 17";
  const colorName = "белый";
  const dir = path.join(process.cwd(), "public", "iphone", folderName, colorName);
  try {
    const names = fs.readdirSync(dir);
    const file = names.find((n) =>
      IMG_EXT.some((ext) => n.toLowerCase().endsWith(ext))
    );
    if (file)
      return `/iphone/${encodeURIComponent(folderName)}/${encodeURIComponent(colorName)}/${encodeURIComponent(file)}`;
  } catch {
    // ignore
  }
  return "/iphone/iPhone%2017/%D0%B1%D0%B5%D0%BB%D1%8B%D0%B9/1.jpg";
}

/** Список путей к фото товара в папке модели/цвет. Пока fallback на iPhone 17/белый. */
export function getImagesForModelColor(
  modelSlug: string,
  colorName: string
): string[] {
  const folderName = MODEL_SLUG_TO_FOLDER[modelSlug];
  const dir = path.join(
    process.cwd(),
    "public",
    "iphone",
    folderName ?? "iPhone 17",
    folderName ? colorName : "белый"
  );
  try {
    const names = fs.readdirSync(dir);
    const files = names
      .filter((n) =>
        IMG_EXT.some((ext) => n.toLowerCase().endsWith(ext))
      )
      .sort();
    if (files.length > 0) {
      const base = `/iphone/${encodeURIComponent(folderName ?? "iPhone 17")}/${encodeURIComponent(folderName ? colorName : "белый")}`;
      return files.map((f) => `${base}/${encodeURIComponent(f)}`);
    }
  } catch {
    // ignore
  }
  const one = getPlaceholderImageBasePath();
  return [one, one, one, one];
}

export function memoryToSlug(memory: string): string {
  return memory.replace(/\s*ГБ\s*/i, "-gb").toLowerCase().replace(/\s/g, "");
}
export function slugToMemory(slug: string): string {
  const map: Record<string, string> = { "256-gb": "256 ГБ", "512-gb": "512 ГБ" };
  return map[slug] ?? "256 ГБ";
}
