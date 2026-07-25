import productsData from "../data/products.json";
import categoriesData from "../data/categories.json";
import type { Product, Category, SubCategory } from "../types";

export const products = productsData as Product[];
export const categories = categoriesData as Category[];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategorySlug(categorySlug: string): Product[] {
  return products.filter((p) => p.categories.includes(categorySlug));
}

export function getCategoryBySlug(
  slug: string,
): { category: Category | SubCategory; parent?: Category } | undefined {
  for (const cat of categories) {
    if (cat.slug === slug) return { category: cat };
    const child = cat.children.find((c) => c.slug === slug);
    if (child) return { category: child, parent: cat };
  }
  return undefined;
}

/** Top-level category + (optional) subcategory a product belongs to, for breadcrumbs/labels. */
export function getProductCategoryPath(
  product: Product,
): { top?: Category; sub?: SubCategory } {
  let top: Category | undefined;
  let sub: SubCategory | undefined;
  for (const cat of categories) {
    if (product.categories.includes(cat.slug)) top = cat;
    const child = cat.children.find((c) => product.categories.includes(c.slug));
    if (child) {
      top = cat;
      sub = child;
    }
  }
  return { top, sub };
}

export function getRelatedProducts(product: Product): Product[] {
  return product.related
    .map((slug) => getProductBySlug(slug))
    .filter((p): p is Product => Boolean(p));
}

export function searchProducts(query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return products;
  return products.filter((p) => p.name.toLowerCase().includes(q));
}

export function productThumbnail(product: Product): string | undefined {
  return product.localImages[0];
}
