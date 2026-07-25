import { Link } from "react-router-dom";
import type { Product } from "../types";
import { getProductCategoryPath, productThumbnail } from "../lib/data";
import { ArrowRightIcon } from "./icons";

export default function ProductCard({ product }: { product: Product }) {
  const { top } = getProductCategoryPath(product);
  const thumb = productThumbnail(product);

  return (
    <Link
      to={`/proizvod/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-wood-100 bg-white transition-shadow hover:shadow-lg hover:shadow-wood-900/10"
    >
      <div className="aspect-square overflow-hidden bg-wood-50">
        {thumb ? (
          <img
            src={thumb}
            alt={product.name}
            loading="lazy"
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-sm text-wood-300">
            Nema slike
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        {top && (
          <span className="w-fit rounded-full bg-gold-400/20 px-2.5 py-1 text-xs font-medium text-gold-600">
            {top.name}
          </span>
        )}
        <h3 className="line-clamp-2 flex-1 text-sm font-medium leading-snug text-wood-800">
          {product.name}
        </h3>
        <span className="mt-1 flex items-center gap-1 text-sm font-medium text-wood-600 group-hover:text-gold-600">
          Pročitaj više
          <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
