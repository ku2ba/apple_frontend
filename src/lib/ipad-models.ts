import fs from "fs";
import path from "path";
import {
  folderToSlug,
  getFirstImageInDir,
  getImagesInDir,
} from "./scan-products";

const BASE = path.join(process.cwd(), "public", "ipad");

export type IpadModel = { slug: string; title: string; line: string; modelFolder: string };

let _cache: IpadModel[] | null = null;

function scan(): IpadModel[] {
  if (_cache) return _cache;
  const result: IpadModel[] = [];
  try {
    const lines = fs.readdirSync(BASE, { withFileTypes: true });
    for (const lineDir of lines) {
      if (!lineDir.isDirectory() || lineDir.name.startsWith(".")) continue;
      const linePath = path.join(BASE, lineDir.name);
      const modelDirs = fs.readdirSync(linePath, { withFileTypes: true });
      for (const modelDir of modelDirs) {
        if (!modelDir.isDirectory() || modelDir.name.startsWith(".")) continue;
        const slug = folderToSlug(modelDir.name);
        result.push({
          slug,
          title: modelDir.name,
          line: lineDir.name,
          modelFolder: modelDir.name,
        });
      }
    }
  } catch {
    // ignore
  }
  _cache = result;
  return result;
}

export function getIpadModels(): IpadModel[] {
  return scan();
}

export function getIpadModelBySlug(slug: string): IpadModel | undefined {
  return scan().find((m) => m.slug === slug);
}

export function getColorsForModel(modelSlug: string): string[] {
  const model = getIpadModelBySlug(modelSlug);
  if (!model) return [];
  const dir = path.join(BASE, model.line, model.modelFolder);
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    return entries
      .filter((e) => e.isDirectory() && !e.name.startsWith("."))
      .map((e) => e.name)
      .sort((a, b) => a.localeCompare(b, "ru"));
  } catch {
    return [];
  }
}

export function getFirstImageForModelColor(
  modelSlug: string,
  colorName: string
): string | null {
  const model = getIpadModelBySlug(modelSlug);
  if (!model) return null;
  const dir = path.join(BASE, model.line, model.modelFolder, colorName);
  const file = getFirstImageInDir(dir);
  if (!file) return null;
  return `/ipad/${encodeURIComponent(model.line)}/${encodeURIComponent(model.modelFolder)}/${encodeURIComponent(colorName)}/${encodeURIComponent(file)}`;
}

/** Превью карточки товара: последнее фото в папке цвета (3-е или 4-е в зависимости от количества). */
export function getCardImageForIpadModelColor(
  modelSlug: string,
  colorName: string
): string | null {
  const model = getIpadModelBySlug(modelSlug);
  if (!model) return null;
  const dir = path.join(BASE, model.line, model.modelFolder, colorName);
  const files = getImagesInDir(dir);
  if (files.length === 0) return getFirstImageForModelColor(modelSlug, colorName);
  const file = files[files.length - 1];
  return `/ipad/${encodeURIComponent(model.line)}/${encodeURIComponent(model.modelFolder)}/${encodeURIComponent(colorName)}/${encodeURIComponent(file)}`;
}

/** Превью из папки линейки: файл с "preview" в имени (как imac preview.png в iMac). */
export function getPreviewForIpadLine(lineName: string): string | null {
  const dir = path.join(BASE, lineName);
  try {
    const names = fs.readdirSync(dir);
    const file = names.find(
      (n) =>
        !n.startsWith(".") &&
        [".jpg", ".jpeg", ".png", ".webp"].some((ext) =>
          n.toLowerCase().endsWith(ext)
        ) &&
        n.toLowerCase().includes("preview")
    );
    if (!file) return null;
    return `/ipad/${encodeURIComponent(lineName)}/${encodeURIComponent(file)}`;
  } catch {
    return null;
  }
}

/** Превью модели из папки конкретной модели: файл с "preview" в имени (ipad .. preview). */
export function getPreviewForIpadModel(modelSlug: string): string | null {
  const model = getIpadModelBySlug(modelSlug);
  if (!model) return null;
  const dir = path.join(BASE, model.line, model.modelFolder);
  try {
    const names = fs.readdirSync(dir);
    const file = names.find(
      (n) =>
        !n.startsWith(".") &&
        [".jpg", ".jpeg", ".png", ".webp"].some((ext) =>
          n.toLowerCase().endsWith(ext)
        ) &&
        n.toLowerCase().includes("preview")
    );
    if (!file) return null;
    return `/ipad/${encodeURIComponent(model.line)}/${encodeURIComponent(model.modelFolder)}/${encodeURIComponent(file)}`;
  } catch {
    return null;
  }
}

export type IpadLine = {
  line: string;
  slug: string;
  count: number;
  previewUrl: string | null;
  firstModelSlug: string;
};

/** Линейки iPad для плашек на странице категории (iPad, iPad Air, iPad mini, iPad Pro). */
export function getIpadLines(): IpadLine[] {
  const models = scan();
  const byLine = new Map<string, IpadModel[]>();
  for (const m of models) {
    const list = byLine.get(m.line) ?? [];
    list.push(m);
    byLine.set(m.line, list);
  }
  const lines: IpadLine[] = [];
  for (const [line, lineModels] of byLine) {
    const sorted = [...lineModels].sort((a, b) =>
      a.modelFolder.localeCompare(b.modelFolder)
    );
    const first = sorted[0];
    const count = lineModels.reduce(
      (sum, m) => sum + getColorsForModel(m.slug).length * 2,
      0
    );
    const linePreview = getPreviewForIpadLine(line);
    lines.push({
      line,
      slug: folderToSlug(line),
      count,
      previewUrl: linePreview ?? getPreviewForIpadModel(first.slug),
      firstModelSlug: first.slug,
    });
  }
  return lines.sort((a, b) => a.line.localeCompare(b.line));
}

export function getImagesForModelColor(
  modelSlug: string,
  colorName: string
): string[] {
  const model = getIpadModelBySlug(modelSlug);
  if (!model) return [];
  const dir = path.join(BASE, model.line, model.modelFolder, colorName);
  const files = getImagesInDir(dir);
  const base = `/ipad/${encodeURIComponent(model.line)}/${encodeURIComponent(model.modelFolder)}/${encodeURIComponent(colorName)}`;
  return files.map((f) => `${base}/${encodeURIComponent(f)}`);
}

const COLOR_HEX: Record<string, string> = {
  белый: "#f5f5f0",
  голубой: "#a8d4e6",
  жёлтый: "#fde047",
  розовый: "#f9a8d4",
  зелёный: "#b8d4a8",
  синий: "#4a6fa5",
  серый: "#9ca3af",
  фиолетовый: "#a78bfa",
};

export function getColorHex(colorName: string): string {
  const key = colorName.toLowerCase().trim();
  return COLOR_HEX[key] ?? "#9ca3af";
}

/** Варианты памяти для селектора на странице товара. */
export const IPAD_MEMORY_OPTIONS = ["128 ГБ", "256 ГБ", "512 ГБ", "1024 ГБ"] as const;

export function memoryToSlug(memory: string): string {
  return memory.replace(/\s*ГБ\s*/i, "-gb").toLowerCase().replace(/\s/g, "");
}

export function slugToMemory(slug: string): string {
  const map: Record<string, string> = {
    "128-gb": "128 ГБ",
    "256-gb": "256 ГБ",
    "512-gb": "512 ГБ",
    "1024-gb": "1024 ГБ",
  };
  return map[slug] ?? "256 ГБ";
}

const MOCK_PRICES: [number, number, number, number][] = [
  [99196, 62890, 62890, 629],
  [108659, 68890, 65390, 689],
  [110237, 69890, 66390, 699],
  [111814, 70890, 67390, 709],
];

export function getPriceForIpadProduct(
  modelSlug: string,
  colorName: string,
  _memory: string
): { priceOld: number; price: number; priceSale: number; cashback: number } {
  const colors = getColorsForModel(modelSlug);
  const idx = colors.findIndex(
    (c) =>
      c === colorName ||
      c.localeCompare(colorName, "ru", { sensitivity: "accent" }) === 0
  );
  const i = idx >= 0 ? idx : 0;
  const [priceOld, price, priceSale, cashback] = MOCK_PRICES[i % MOCK_PRICES.length];
  return { priceOld, price, priceSale, cashback };
}
