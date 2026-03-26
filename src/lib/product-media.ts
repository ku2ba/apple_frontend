import fs from "node:fs";
import path from "node:path";

import type { ProductCategory } from "@/lib/products-db";

const IMG_EXT = [".jpg", ".jpeg", ".png", ".webp"];

function isImageFile(name: string) {
  const low = name.toLowerCase();
  return IMG_EXT.some((ext) => low.endsWith(ext));
}

function toSlug(input: string) {
  return input
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function safeReadDir(dir: string) {
  try {
    return fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }
}

function listDirs(dir: string) {
  return safeReadDir(dir).filter((d) => d.isDirectory()).map((d) => d.name);
}

function listImages(dir: string) {
  return safeReadDir(dir)
    .filter((d) => d.isFile() && isImageFile(d.name))
    .map((d) => d.name)
    .sort((a, b) => a.localeCompare(b, "ru"));
}

function publicPath(...parts: string[]) {
  return "/" + parts.map((p) => p.replaceAll("\\", "/")).join("/");
}

function publicFsPath(...parts: string[]) {
  return path.join(process.cwd(), "public", ...parts);
}

export type CategoryFamily = {
  category: ProductCategory;
  familyName: string;
  familySlug: string;
  previewUrl: string | null;
  modelNames: string[]; // folder names that represent "base model title"
};

export function getCategoryFamilies(category: ProductCategory): CategoryFamily[] {
  const root = publicFsPath(category);
  const families = listDirs(root);

  // For iphone, folder itself is the model (no extra family level in UI).
  // For other categories, folder is a "line/family", inside are models.
  return families.map((familyName) => {
    const familySlug = toSlug(familyName);
    const familyDir = path.join(root, familyName);

    let modelNames: string[] = [];

    if (category === "iphone") {
      modelNames = [familyName];
    } else {
      modelNames = listDirs(familyDir);
    }

    // preview: first image found in first model's first color folder
    let previewUrl: string | null = null;
    for (const modelName of modelNames) {
      const modelDir =
        category === "iphone"
          ? path.join(familyDir)
          : path.join(familyDir, modelName);
      const colors = listDirs(modelDir);
      if (colors.length === 0) continue;
      const imgs = listImages(path.join(modelDir, colors[0]));
      if (imgs.length === 0) continue;
      previewUrl =
        category === "iphone"
          ? publicPath(category, familyName, colors[0], imgs[0])
          : publicPath(category, familyName, modelName, colors[0], imgs[0]);
      break;
    }

    return { category, familyName, familySlug, previewUrl, modelNames };
  });
}

export function getProductGalleryImages(args: {
  category: ProductCategory;
  title: string; // base model title, e.g. "iPad 11 A16"
  color: string;
}): string[] {
  const { category, title, color } = args;
  const root = publicFsPath(category);
  const families = listDirs(root);

  // find best match model folder by exact folder name in any family
  for (const familyName of families) {
    const familyDir = path.join(root, familyName);
    const modelDir =
      category === "iphone"
        ? familyDir
        : path.join(familyDir, title);

    // iphone case: title equals familyName (folder), so align
    const actualModelDir =
      category === "iphone"
        ? path.join(root, title)
        : modelDir;

    const colorDir = path.join(actualModelDir, color);
    const images = listImages(colorDir);
    if (images.length > 0) {
      if (category === "iphone") {
        return images.map((img) => publicPath(category, title, color, img));
      }
      return images.map((img) =>
        publicPath(category, familyName, title, color, img)
      );
    }
  }

  return [];
}

