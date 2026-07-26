import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import type { Category, Product } from "../../src/types";

const dataDir = fileURLToPath(new URL("../../src/data", import.meta.url));

function readJson<T>(filename: string): T {
  return JSON.parse(readFileSync(`${dataDir}/${filename}`, "utf-8")) as T;
}

const allProducts = readJson<Product[]>("products.json");
const allCategories = readJson<Category[]>("categories.json");

export { allProducts as products, allCategories as categories };

export function countByCategorySlug(slug: string): number {
  return allProducts.filter((p) => p.categories.includes(slug)).length;
}

export function searchCount(term: string): number {
  const q = term.trim().toLowerCase();
  return allProducts.filter((p) => p.name.toLowerCase().includes(q)).length;
}

/** A product with all three spec sections populated, for detail-page assertions. */
export function findProductWithFullSpec(): Product {
  const product = allProducts.find(
    (p) =>
      Object.keys(p.spec.Dimenzije ?? {}).length > 0 &&
      Object.keys(p.spec.Materijal ?? {}).length > 0 &&
      Object.keys(p.spec.Podrobnosti ?? {}).length > 0,
  );
  if (!product) throw new Error("No product with all three spec sections found in fixture data.");
  return product;
}

export function findProductWithRelated(): Product {
  const product = allProducts.find((p) => p.related.length > 0);
  if (!product) throw new Error("No product with related products found in fixture data.");
  return product;
}

export function findTopLevelCategoryWithMultiplePages(pageSize: number): Category {
  const category = allCategories.find((c) => countByCategorySlug(c.slug) > pageSize);
  if (!category) {
    throw new Error(`No category exceeds ${pageSize} products for pagination testing.`);
  }
  return category;
}

export const EMPTY_CATEGORY_SLUG: string = (() => {
  const empty = allCategories.find((c) => c.count === 0 && c.children.length === 0);
  if (!empty) throw new Error("No empty category found in fixture data (expected 'lajsne').");
  return empty.slug;
})();
