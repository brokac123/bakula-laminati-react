import { Link } from "react-router-dom";
import FeatureCallouts from "../components/FeatureCallouts";

const PARAGRAPHS = [
  "Obrt Bakula specijaliziran je za prodaju laminata, vinil podova i lajsni, nudeći širok izbor kvalitetnih podnih obloga za sve vrste interijera. Naša je misija omogućiti kupcima jednostavan izbor izdržljivih, estetski privlačnih i dugotrajnih podnih rješenja koja će oplemeniti svaki prostor.",
  "Kroz godine rada izgradili smo prepoznatljiv identitet i stekli povjerenje brojnih klijenata koji cijene našu stručnost, profesionalnost i posvećenost detaljima. U našoj ponudi nalaze se pažljivo odabrani proizvodi provjerenih proizvođača, kako bismo osigurali optimalan omjer kvalitete, dizajna i cijene.",
  "Vjerujemo da je kvalitetna podna obloga temelj ugodnog i funkcionalnog doma ili poslovnog prostora. Zato klijentima pružamo stručnu podršku pri odabiru, savjetujemo o svojstvima materijala i pomažemo pronaći rješenje koje najbolje odgovara njihovim potrebama i stilu.",
  "Obrt Bakula kontinuirano se razvija i prati tržišne trendove, uvodeći nove modele, dekore i tehnologije u svoju ponudu. Naše iskustvo, predanost i fokus na zadovoljstvo kupaca ono su što nas izdvaja na tržištu.",
];

export default function About() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <nav className="text-xs text-wood-400">
        <Link to="/" className="hover:text-gold-600">
          Naslovna
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-wood-600">O nama</span>
      </nav>

      <p className="mt-4 text-sm font-semibold uppercase tracking-widest text-gold-600">
        10 godina iskustva
      </p>
      <h1 className="mt-2 font-heading text-4xl font-semibold text-wood-800">O nama&hellip;</h1>

      <div className="mt-8 max-w-3xl space-y-5 text-wood-600">
        {PARAGRAPHS.map((p, i) => (
          <p key={i} className="leading-relaxed">
            {p}
          </p>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          to="/katalog"
          className="rounded-full bg-wood-800 px-6 py-3 text-sm font-semibold text-cream-50 hover:bg-wood-700"
        >
          Pogledajte katalog
        </Link>
        <Link
          to="/kontakt"
          className="rounded-full border border-wood-300 px-6 py-3 text-sm font-semibold text-wood-700 hover:bg-wood-50"
        >
          Kontaktirajte nas
        </Link>
      </div>

      <div className="mt-16">
        <FeatureCallouts />
      </div>
    </div>
  );
}
