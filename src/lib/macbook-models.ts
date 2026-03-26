import fs from "fs";
import path from "path";
import {
  folderToSlug,
  getFirstImageInDir,
  getLastImageInDir,
  getImagesInDir,
} from "./scan-products";

const BASE = path.join(process.cwd(), "public", "macbook");
const IMG_EXT = [".jpg", ".jpeg", ".png", ".webp"];

export type MacbookModel = {
  slug: string;
  title: string;
  line: string;
  modelFolder: string;
  /** true если товары лежат прямо в папке линейки (line/цвет), без подпапки модели (как Mac Studio). */
  isLineOnly?: boolean;
};

let _cache: MacbookModel[] | null = null;

/** Есть ли внутри папки подпапки (не файлы). */
function hasSubdirs(dirPath: string): boolean {
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    return entries.some((e) => e.isDirectory() && !e.name.startsWith("."));
  } catch {
    return false;
  }
}

function scan(): MacbookModel[] {
  if (_cache) return _cache;
  const result: MacbookModel[] = [];
  try {
    const lines = fs.readdirSync(BASE, { withFileTypes: true });
    for (const lineDir of lines) {
      if (!lineDir.isDirectory() || lineDir.name.startsWith(".")) continue;
      const linePath = path.join(BASE, lineDir.name);
      const entries = fs.readdirSync(linePath, { withFileTypes: true });
      const subdirs = entries.filter((e) => e.isDirectory() && !e.name.startsWith("."));
      const hasModelLevel = subdirs.some((d) =>
        hasSubdirs(path.join(linePath, d.name))
      );
      const hasImageFiles = entries.some(
        (e) =>
          !e.isDirectory() &&
          IMG_EXT.some((ext) => e.name.toLowerCase().endsWith(ext))
      );
      if (hasModelLevel) {
        for (const modelDir of subdirs) {
          const modelPath = path.join(linePath, modelDir.name);
          if (!hasSubdirs(modelPath)) continue;
          result.push({
            slug: folderToSlug(modelDir.name),
            title: modelDir.name,
            line: lineDir.name,
            modelFolder: modelDir.name,
          });
        }
      } else if (subdirs.length > 0) {
        const lineSlug = folderToSlug(lineDir.name);
        result.push({
          slug: lineSlug,
          title: lineDir.name,
          line: lineDir.name,
          modelFolder: lineDir.name,
          isLineOnly: true,
        });
      } else if (hasImageFiles) {
        const lineSlug = folderToSlug(lineDir.name);
        result.push({
          slug: lineSlug,
          title: lineDir.name,
          line: lineDir.name,
          modelFolder: lineDir.name,
          isLineOnly: true,
        });
      }
    }
  } catch {
    // ignore
  }
  _cache = result;
  return result;
}

export function getMacbookModels(): MacbookModel[] {
  return scan();
}

export function getMacbookModelBySlug(slug: string): MacbookModel | undefined {
  return scan().find((m) => m.slug === slug);
}

export type MacbookLine = {
  lineName: string;
  slug: string;
  count: number;
  previewUrl: string | null;
  firstModelSlug: string;
};

/** Линейки — папки первого уровня. Как в iPad: firstModelSlug для ссылки с плашки. */
export function getMacbookLines(): MacbookLine[] {
  const models = scan();
  const byLine = new Map<string, MacbookModel[]>();
  for (const m of models) {
    const list = byLine.get(m.line) ?? [];
    list.push(m);
    byLine.set(m.line, list);
  }
  const lines: MacbookLine[] = [];
  try {
    const entries = fs.readdirSync(BASE, { withFileTypes: true });
    for (const e of entries) {
      if (!e.isDirectory() || e.name.startsWith(".")) continue;
      const lineModels = byLine.get(e.name) ?? [];
      const sorted = [...lineModels].sort((a, b) =>
        a.modelFolder.localeCompare(b.modelFolder)
      );
      const first = sorted[0];
      const count = lineModels.reduce(
        (sum, m) => sum + getColorsForModel(m.slug).length,
        0
      );
      lines.push({
        lineName: e.name,
        slug: folderToSlug(e.name),
        count,
        previewUrl: getPreviewForMacbookLine(e.name),
        firstModelSlug: first ? first.slug : folderToSlug(e.name),
      });
    }
  } catch {
    // ignore
  }
  return lines.sort((a, b) => a.lineName.localeCompare(b.lineName));
}

/** Модели, входящие в линейку. */
export function getModelsForLine(lineName: string): MacbookModel[] {
  return scan().filter((m) => m.line === lineName);
}

/** Превью из папки линейки, например: public/macbook/Mac mini/mac mini preview.png */
export function getPreviewForMacbookLine(lineName: string): string | null {
  const dir = path.join(BASE, lineName);
  try {
    const names = fs.readdirSync(dir);
    const file = names.find(
      (n) =>
        !n.startsWith(".") &&
        IMG_EXT.some((ext) => n.toLowerCase().endsWith(ext)) &&
        n.toLowerCase().includes("preview")
    );
    if (!file) return null;
    return `/macbook/${encodeURIComponent(lineName)}/${encodeURIComponent(file)}`;
  } catch {
    return null;
  }
}

/** Превью из папки модели (line/modelFolder), иначе из папки линейки. */
export function getPreviewForMacbookModel(modelSlug: string): string | null {
  const model = getMacbookModelBySlug(modelSlug);
  if (!model) return null;
  const modelDir = path.join(BASE, model.line, model.modelFolder);
  try {
    const names = fs.readdirSync(modelDir);
    const file = names.find(
      (n) =>
        !n.startsWith(".") &&
        IMG_EXT.some((ext) => n.toLowerCase().endsWith(ext)) &&
        n.toLowerCase().includes("preview")
    );
    if (file)
      return `/macbook/${encodeURIComponent(model.line)}/${encodeURIComponent(model.modelFolder)}/${encodeURIComponent(file)}`;
  } catch {
    // ignore
  }
  return getPreviewForMacbookLine(model.line);
}

export function getColorsForModel(modelSlug: string): string[] {
  const model = getMacbookModelBySlug(modelSlug);
  if (!model) return [];
  const dir = model.isLineOnly
    ? path.join(BASE, model.line)
    : path.join(BASE, model.line, model.modelFolder);
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const colorDirs = entries
      .filter((e) => e.isDirectory() && !e.name.startsWith("."))
      .map((e) => e.name)
      .sort((a, b) => a.localeCompare(b, "ru"));
    if (colorDirs.length > 0) return colorDirs;
    if (model.isLineOnly && entries.some((e) => !e.isDirectory() && IMG_EXT.some((ext) => e.name.toLowerCase().endsWith(ext)))) {
      return ["—"];
    }
    return [];
  } catch {
    return [];
  }
}

export function getFirstImageForModelColor(
  modelSlug: string,
  colorName: string
): string | null {
  const model = getMacbookModelBySlug(modelSlug);
  if (!model) return null;
  const dir =
    model.isLineOnly && colorName === "—"
      ? path.join(BASE, model.line)
      : model.isLineOnly
        ? path.join(BASE, model.line, colorName)
        : path.join(BASE, model.line, model.modelFolder, colorName);
  const file = getFirstImageInDir(dir);
  if (!file) return null;
  const base =
    model.isLineOnly && colorName === "—"
      ? `/macbook/${encodeURIComponent(model.line)}`
      : model.isLineOnly
        ? `/macbook/${encodeURIComponent(model.line)}/${encodeURIComponent(colorName)}`
        : `/macbook/${encodeURIComponent(model.line)}/${encodeURIComponent(model.modelFolder)}/${encodeURIComponent(colorName)}`;
  return `${base}/${encodeURIComponent(file)}`;
}

/** Последнее фото в папке цвета — для превью на карточках. */
export function getLastImageForModelColor(
  modelSlug: string,
  colorName: string
): string | null {
  const model = getMacbookModelBySlug(modelSlug);
  if (!model) return null;
  const dir =
    model.isLineOnly && colorName === "—"
      ? path.join(BASE, model.line)
      : model.isLineOnly
        ? path.join(BASE, model.line, colorName)
        : path.join(BASE, model.line, model.modelFolder, colorName);
  const file = getLastImageInDir(dir);
  if (!file) return null;
  const base =
    model.isLineOnly && colorName === "—"
      ? `/macbook/${encodeURIComponent(model.line)}`
      : model.isLineOnly
        ? `/macbook/${encodeURIComponent(model.line)}/${encodeURIComponent(colorName)}`
        : `/macbook/${encodeURIComponent(model.line)}/${encodeURIComponent(model.modelFolder)}/${encodeURIComponent(colorName)}`;
  return `${base}/${encodeURIComponent(file)}`;
}

export function getImagesForModelColor(
  modelSlug: string,
  colorName: string
): string[] {
  const model = getMacbookModelBySlug(modelSlug);
  if (!model) return [];
  const dir =
    model.isLineOnly && colorName === "—"
      ? path.join(BASE, model.line)
      : model.isLineOnly
        ? path.join(BASE, model.line, colorName)
        : path.join(BASE, model.line, model.modelFolder, colorName);
  const files = getImagesInDir(dir);
  const base =
    model.isLineOnly && colorName === "—"
      ? `/macbook/${encodeURIComponent(model.line)}`
      : model.isLineOnly
        ? `/macbook/${encodeURIComponent(model.line)}/${encodeURIComponent(colorName)}`
        : `/macbook/${encodeURIComponent(model.line)}/${encodeURIComponent(model.modelFolder)}/${encodeURIComponent(colorName)}`;
  return files.map((f) => `${base}/${encodeURIComponent(f)}`);
}

const COLOR_HEX: Record<string, string> = {
  белый: "#f5f5f0",
  голубой: "#a8d4e6",
  жёлтый: "#fde047",
  зелёный: "#b8d4a8",
  ораньжевый: "#fb923c",
  розовый: "#f9a8d4",
  фиолетовый: "#a78bfa",
  серый: "#9ca3af",
};

export function getColorHex(colorName: string): string {
  const key = colorName.toLowerCase().trim();
  return COLOR_HEX[key] ?? "#9ca3af";
}
