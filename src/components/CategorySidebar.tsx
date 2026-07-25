import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { categories, getProductBySlug } from "../lib/data";
import { getRecentlyViewed } from "../lib/recentlyViewed";
import { SearchIcon } from "./icons";

export default function CategorySidebar() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeCategory = searchParams.get("kategorija");
  const [searchValue, setSearchValue] = useState(searchParams.get("trazi") ?? "");
  const [recentSlugs, setRecentSlugs] = useState<string[]>([]);

  useEffect(() => {
    setRecentSlugs(getRecentlyViewed());
  }, []);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchValue.trim()) params.set("trazi", searchValue.trim());
    navigate(`/katalog?${params.toString()}`);
  }

  const recentProducts = recentSlugs
    .map((slug) => getProductBySlug(slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <aside className="space-y-8">
      <form onSubmit={handleSearchSubmit} className="relative">
        <input
          type="search"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Pretraga…"
          className="w-full rounded-full border border-wood-200 bg-white py-2.5 pl-4 pr-10 text-sm text-wood-800 placeholder:text-wood-300 focus:border-gold-400 focus:outline-none"
        />
        <button
          type="submit"
          className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-wood-400 hover:text-gold-600"
          aria-label="Pretraži"
        >
          <SearchIcon className="size-4" />
        </button>
      </form>

      <div>
        <h3 className="font-heading text-base font-semibold text-wood-800">
          Kategorije proizvoda
        </h3>
        <ul className="mt-3 space-y-1 text-sm">
          {categories.map((cat) => (
            <li key={cat.slug}>
              <Link
                to={`/katalog?kategorija=${cat.slug}`}
                className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 ${
                  activeCategory === cat.slug
                    ? "bg-gold-400/15 font-medium text-gold-600"
                    : "text-wood-600 hover:text-gold-600"
                }`}
              >
                {cat.name}
                <span className="text-xs text-wood-300">{cat.count}</span>
              </Link>
              {cat.children.length > 0 && (
                <ul className="ml-3 space-y-1 border-l border-wood-100 pl-3">
                  {cat.children.map((child) => (
                    <li key={child.slug}>
                      <Link
                        to={`/katalog?kategorija=${child.slug}`}
                        className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs ${
                          activeCategory === child.slug
                            ? "bg-gold-400/15 font-medium text-gold-600"
                            : "text-wood-500 hover:text-gold-600"
                        }`}
                      >
                        {child.name}
                        <span className="text-wood-300">{child.count}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>

      {recentProducts.length > 0 && (
        <div>
          <h3 className="font-heading text-base font-semibold text-wood-800">
            Nedavno pregledano
          </h3>
          <ul className="mt-3 space-y-3">
            {recentProducts.map((product) => (
              <li key={product.slug}>
                <Link
                  to={`/proizvod/${product.slug}`}
                  className="flex items-center gap-3 rounded-lg p-1.5 hover:bg-wood-50"
                >
                  {product.localImages[0] && (
                    <img
                      src={product.localImages[0]}
                      alt=""
                      className="size-12 shrink-0 rounded-md object-cover"
                    />
                  )}
                  <span className="line-clamp-2 text-xs text-wood-600">{product.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
