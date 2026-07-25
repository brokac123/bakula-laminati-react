import { Link } from "react-router-dom";
import { products } from "../lib/data";
import ProductCard from "../components/ProductCard";
import FeatureCallouts from "../components/FeatureCallouts";
import { ArrowRightIcon, StarIcon } from "../components/icons";

const CATEGORY_TEASERS = [
  {
    title: "Laminati",
    text: "Nudimo vam široku ponudu laminata renomiranih proizvođača visoke kvalitete.",
    to: "/katalog?kategorija=laminati",
  },
  {
    title: "Vinil podovi",
    text: "Moderni podovi raznih uzoraka i tekstura — od uzorka drva do apstraktnih uzoraka.",
    to: "/katalog?kategorija=vinil-podovi",
  },
  {
    title: "Lajsne",
    text: "Drvene ili PVC lajsne, parket i sokle — uskoro dostupno u našoj ponudi.",
    to: null,
  },
];

const TESTIMONIALS = [
  {
    name: "Josip",
    city: "Našice, Hrvatska",
    quote:
      "Veliki izbor laminatnih podova, te opcija da ne moramo kupovati cijele pakete bila je presudna u konačnoj odluci pri izboru trgovca. Svaka pohvala Bakula laminatima.",
  },
  {
    name: "Marija",
    city: "Osijek, Hrvatska",
    quote: "Jako smo zadovoljni kvalitetom laminata! Tople preporuke svima.",
  },
  {
    name: "Katarina Tutnjević",
    city: "Osijek, Hrvatska",
    quote: "Najbolji i najveći izbor laminata.",
  },
];

const BRANDS = [
  { name: "Krono Original", href: "https://www.krono-original.com" },
  { name: "Egger", href: "https://www.egger.com" },
  { name: "Classen", href: "https://classenfloor.com/floor/" },
];

const FEATURED_SLUGS_COUNT = 10;

export default function Home() {
  const featured = products.slice(0, FEATURED_SLUGS_COUNT);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-wood-800">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, var(--color-gold-400) 0, transparent 45%), radial-gradient(circle at 85% 70%, var(--color-wood-400) 0, transparent 50%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold-400">
            Bakula laminati &middot; Osijek
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold text-cream-50 sm:text-5xl">
            Vaš prostor, naša inspiracija.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-wood-200">
            Obrt Bakula specijaliziran je za prodaju laminata, vinil podova i lajsni, nudeći širok
            izbor kvalitetnih podnih obloga za sve vrste interijera. Naša je misija omogućiti
            kupcima jednostavan izbor izdržljivih, estetski privlačnih i dugotrajnih podnih
            rješenja koja će oplemeniti svaki prostor.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/kontakt"
              className="rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-wood-900 hover:bg-gold-400"
            >
              Kontaktirajte nas!
            </Link>
            <Link
              to="/o-nama"
              className="rounded-full border border-wood-500 px-6 py-3 text-sm font-semibold text-cream-50 hover:bg-wood-700"
            >
              Saznajte više
            </Link>
          </div>
        </div>
      </section>

      {/* 10 godina s vama */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-gold-600">
          10 godina s vama&hellip;
        </p>
        <h2 className="mt-2 max-w-2xl text-3xl font-semibold text-wood-800">
          Široki izbor laminata!
        </h2>
        <p className="mt-4 max-w-2xl text-wood-500">
          Već cijelo desetljeće specijalizirani smo za prodaju laminata i laminatnih podova
          vrhunske kvalitete. Naša ponuda uključuje proizvode renomiranih svjetskih proizvođača
          koji su prepoznati po svojoj izdržljivosti, modernom dizajnu i jednostavnom
          održavanju. Posjetite nas i uvjerite se zašto smo jedan od vodećih izbora za laminatne
          podove.
        </p>
        <div className="mt-10">
          <FeatureCallouts />
        </div>
      </section>

      {/* Renomirani proizvođači - category teaser */}
      <section className="bg-wood-50 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold-600">
            Naša ponuda
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-wood-800">Renomirani proizvođači</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {CATEGORY_TEASERS.map((cat) => (
              <div
                key={cat.title}
                className="flex flex-col rounded-2xl border border-wood-100 bg-white p-7"
              >
                <h3 className="font-heading text-xl font-semibold text-wood-800">{cat.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-wood-500">{cat.text}</p>
                {cat.to ? (
                  <Link
                    to={cat.to}
                    className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-gold-600 hover:text-gold-500"
                  >
                    Pročitaj više
                    <ArrowRightIcon className="size-4" />
                  </Link>
                ) : (
                  <span className="mt-5 text-sm font-medium text-wood-300">Uskoro</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ponuda podova - featured products strip */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-gold-600">
              Iz kataloga
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-wood-800">Ponuda podova</h2>
          </div>
          <Link
            to="/katalog"
            className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-wood-600 hover:text-gold-600 sm:flex"
          >
            Cijeli katalog
            <ArrowRightIcon className="size-4" />
          </Link>
        </div>
        <div className="mt-10 -mx-4 flex snap-x gap-5 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
          {featured.map((product) => (
            <div key={product.slug} className="w-56 shrink-0 snap-start sm:w-64">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-wood-800 py-20 text-cream-50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold-400">Iskustva</p>
          <h2 className="mt-2 text-3xl font-semibold text-cream-50">Šta kažu naši kupci?</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="rounded-2xl border border-wood-600 bg-wood-700/40 p-6">
                <div className="flex gap-0.5 text-gold-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon key={i} className="size-4" />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-wood-100">&ldquo;{t.quote}&rdquo;</p>
                <p className="mt-4 text-sm font-semibold text-cream-50">{t.name}</p>
                <p className="text-xs text-wood-300">{t.city}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand logos */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="text-center text-sm font-semibold uppercase tracking-widest text-wood-400">
          Surađujemo s vodećim proizvođačima
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          {BRANDS.map((brand) => (
            <a
              key={brand.name}
              href={brand.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-wood-200 px-6 py-3 font-heading text-lg font-medium text-wood-600 transition-colors hover:border-gold-400 hover:text-gold-600"
            >
              {brand.name}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
