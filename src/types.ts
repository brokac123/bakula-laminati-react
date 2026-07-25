export interface ProductSpec {
  Dimenzije: Record<string, string>;
  Materijal: Record<string, string>;
  Podrobnosti: Record<string, string>;
  [section: string]: Record<string, string>;
}

export interface Product {
  slug: string;
  url: string;
  name: string;
  categories: string[];
  images: string[];
  spec: ProductSpec;
  related: string[];
  localImages: string[];
}

export interface SubCategory {
  slug: string;
  name: string;
  count: number;
}

export interface Category {
  slug: string;
  name: string;
  count: number;
  children: SubCategory[];
}
