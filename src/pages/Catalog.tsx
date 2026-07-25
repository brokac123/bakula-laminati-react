import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getCategoryBySlug, getProductsByCategorySlug, products, searchProducts } from "../lib/data";
import ProductCard from "../components/ProductCard";
import CategorySidebar from "../components/CategorySidebar";

const PAGE_SIZE = 12;

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categorySlug = searchParams.get("kategorija");
  const query = searchParams.get("trazi");
  const page = Math.max(1, Number(searchParams.get("stranica") ?? "1") || 1);

  const categoryInfo = categorySlug ? getCategoryBySlug(categorySlug) : undefined;

  const filtered = useMemo(() => {
    if (query) return searchProducts(query);
    if (categorySlug) return getProductsByCategorySlug(categorySlug);
    return products;
  }, [categorySlug, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function goToPage(n: number) {
    const params = new URLSearchParams(searchParams);
    if (n <= 1) params.delete("stranica");
    else params.set("stranica", String(n));
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const heading = query
    ? `Rezultati pretrage: "${query}"`
    : categoryInfo
      ? categoryInfo.category.name
      : "Katalog proizvoda";

  const isEmptyLajsne = categorySlug === "lajsne";

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <nav className="text-xs text-wood-400">
        <Link to="/" className="hover:text-gold-600">
          Naslovna
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-wood-600">Katalog</span>
      </nav>
      <h1 className="mt-2 font-heading text-3xl font-semibold text-wood-800">{heading}</h1>
      {!query && (
        <p className="mt-1 text-sm text-wood-400">{filtered.length} proizvoda</p>
      )}

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[240px_1fr]">
        <CategorySidebar />

        <div>
          {isEmptyLajsne ? (
            <div className="rounded-2xl border border-dashed border-wood-200 bg-wood-50 p-10 text-center">
              <p className="font-heading text-lg font-semibold text-wood-700">
                Lajsne uskoro dostupne
              </p>
              <p className="mt-2 text-sm text-wood-500">
                Trenutno pripremamo ponudu lajsni. Za upit o dostupnosti slobodno nas
                kontaktirajte.
              </p>
              <Link
                to="/kontakt"
                className="mt-5 inline-block rounded-full bg-wood-800 px-6 py-2.5 text-sm font-medium text-cream-50 hover:bg-wood-700"
              >
                Kontaktirajte nas
              </Link>
            </div>
          ) : pageItems.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-wood-200 bg-wood-50 p-10 text-center text-wood-500">
              Nema pronađenih proizvoda.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-4">
                {pageItems.map((product) => (
                  <ProductCard key={product.slug} product={product} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-1.5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => goToPage(n)}
                      className={`size-9 rounded-full text-sm font-medium ${
                        n === currentPage
                          ? "bg-wood-800 text-cream-50"
                          : "text-wood-600 hover:bg-wood-100"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
