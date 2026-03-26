import fs from "fs";
import path from "path";

const IMG_EXT = [".jpg", ".jpeg", ".png", ".webp"];

export function folderToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

/** Первое изображение в папке. */
export function getFirstImageInDir(dir: string): string | null {
  try {
    const names = fs.readdirSync(dir);
    const file = names.find((n) =>
      IMG_EXT.some((ext) => n.toLowerCase().endsWith(ext))
    );
    return file ?? null;
  } catch {
    return null;
  }
}

/** Последнее изображение в папке (по сортировке имён) — для превью карточек. */
export function getLastImageInDir(dir: string): string | null {
  const files = getImagesInDir(dir);
  return files.length > 0 ? files[files.length - 1] : null;
}

/** Список всех изображений в папке (для галереи). */
export function getImagesInDir(dir: string): string[] {
  try {
    const names = fs.readdirSync(dir);
    return names
      .filter((n) =>
        IMG_EXT.some((ext) => n.toLowerCase().endsWith(ext))
      )
      .sort();
  } catch {
    return [];
  }
}
