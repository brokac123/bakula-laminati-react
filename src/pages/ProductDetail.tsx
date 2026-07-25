import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { getProductBySlug, getProductCategoryPath, getRelatedProducts } from "../lib/data";
import { addRecentlyViewed } from "../lib/recentlyViewed";
import ProductCard from "../components/ProductCard";

const SECTION_ORDER = ["Dimenzije", "Materijal", "Podrobnosti"] as const;

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const product = slug ? getProductBySlug(slug) : undefined;
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (product) addRecentlyViewed(product.slug);
    setActiveImage(0);
  }, [product]);

  if (!product) return <Navigate to="/katalog" replace />;

  const { top, sub } = getProductCategoryPath(product);
  const related = getRelatedProducts(product);
  const images = product.localImages;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <nav className="flex flex-wrap items-center gap-1.5 text-xs text-wood-400">
        <Link to="/" className="hover:text-gold-600">
          Naslovna
        </Link>
        <span>/</span>
        <Link to="/katalog" className="hover:text-gold-600">
          Katalog
        </Link>
        {top && (
          <>
            <span>/</span>
            <Link to={`/katalog?kategorija=${top.slug}`} className="hover:text-gold-600">
              {top.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-wood-600">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div className="min-w-0">
          <div className="aspect-square overflow-hidden rounded-2xl border border-wood-100 bg-wood-50">
            {images[activeImage] ? (
              <img
                src={images[activeImage]}
                alt={product.name}
                className="size-full object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center text-wood-300">
                Nema slike
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  className={`size-16 shrink-0 overflow-hidden rounded-lg border-2 ${
                    i === activeImage ? "border-gold-500" : "border-transparent"
                  }`}
                >
                  <img src={img} alt="" className="size-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="min-w-0">
          <div className="flex flex-wrap gap-2">
            {top && (
              <span className="rounded-full bg-gold-400/15 px-3 py-1 text-xs font-medium text-gold-600">
                {top.name}
              </span>
            )}
            {sub && (
              <span className="rounded-full bg-wood-100 px-3 py-1 text-xs font-medium text-wood-600">
                {sub.name}
              </span>
            )}
          </div>
          <h1 className="mt-3 font-heading text-2xl font-semibold text-wood-800 sm:text-3xl">
            {product.name}
          </h1>

          <div className="mt-8 space-y-8">
            {SECTION_ORDER.filter(
              (section) => Object.keys(product.spec[section] ?? {}).length > 0,
            ).map((section) => (
              <div key={section}>
                <h2 className="font-heading text-lg font-semibold text-wood-800">{section}</h2>
                <dl className="mt-3 divide-y divide-wood-100 rounded-xl border border-wood-100">
                  {Object.entries(product.spec[section]).map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-4 px-4 py-2.5 text-sm">
                      <dt className="text-wood-400">{label}</dt>
                      <dd className="text-right font-medium text-wood-700">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>

          <Link
            to="/kontakt"
            className="mt-8 inline-block rounded-full bg-wood-800 px-6 py-3 text-sm font-semibold text-cream-50 hover:bg-wood-700"
          >
            Zatražite ponudu
          </Link>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-20">
          <h2 className="font-heading text-2xl font-semibold text-wood-800">
            Povezani proizvodi
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
