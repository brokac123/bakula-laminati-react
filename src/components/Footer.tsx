import { Link } from "react-router-dom";
import { MailIcon, MapPinIcon, PhoneIcon } from "./icons";

export default function Footer() {
  return (
    <footer className="border-t border-wood-100 bg-wood-800 text-wood-100">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <span className="font-heading text-2xl font-semibold text-cream-50">Bakula</span>
          <p className="mt-4 text-sm leading-relaxed text-wood-200">
            Trgovački obrt s tradicijom koja traje već 10 godina. Svojim kupcima nudimo veliki
            izbor laminata, vinilnih podova i lajsni.{" "}
            <Link to="/o-nama" className="font-medium text-gold-400 hover:text-gold-300">
              (saznajte više)
            </Link>
          </p>
        </div>

        <div>
          <h5 className="font-heading text-base font-semibold text-cream-50">Brzi izbornik</h5>
          <ul className="mt-4 space-y-2 text-sm text-wood-200">
            <li>
              <Link to="/" className="hover:text-gold-400">
                Naslovna
              </Link>
            </li>
            <li>
              <Link to="/o-nama" className="hover:text-gold-400">
                O nama
              </Link>
            </li>
            <li>
              <Link to="/kontakt" className="hover:text-gold-400">
                Kontakt
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="font-heading text-base font-semibold text-cream-50">Web katalog</h5>
          <ul className="mt-4 space-y-2 text-sm text-wood-200">
            <li>
              <Link to="/katalog?kategorija=laminati" className="hover:text-gold-400">
                Laminati
              </Link>
            </li>
            <li>
              <Link to="/katalog?kategorija=vinil-podovi" className="hover:text-gold-400">
                Vinil podovi
              </Link>
            </li>
            <li>
              <span className="text-wood-400">Lajsne (uskoro)</span>
            </li>
            <li>
              <Link to="/katalog?kategorija=posebna-ponuda" className="hover:text-gold-400">
                Posebna ponuda
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="font-heading text-base font-semibold text-cream-50">Kontaktirajte nas!</h5>
          <ul className="mt-4 space-y-3 text-sm text-wood-200">
            <li className="flex items-start gap-2">
              <MapPinIcon className="mt-0.5 size-4 shrink-0 text-gold-400" />
              Ulica Matije Gupca 58, Osijek, Hrvatska
            </li>
            <li className="flex items-center gap-2">
              <PhoneIcon className="size-4 shrink-0 text-gold-400" />
              <a href="tel:+385915222559" className="hover:text-gold-400">
                +385 (0)91-522-2559
              </a>
            </li>
            <li className="flex items-center gap-2">
              <PhoneIcon className="size-4 shrink-0 text-gold-400" />
              <a href="tel:+38531505061" className="hover:text-gold-400">
                +385 (0)31-505-061
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MailIcon className="size-4 shrink-0 text-gold-400" />
              <a href="mailto:info@bakula-laminati.hr" className="hover:text-gold-400">
                info@bakula-laminati.hr
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-wood-700/60">
        <div className="mx-auto max-w-6xl px-4 py-5 text-center text-xs text-wood-300 sm:px-6">
          &copy; {new Date().getFullYear()} Bakula laminati, vl. Damir Bakula. Matični broj:
          97605930. Sva prava pridržana.
        </div>
      </div>
    </footer>
  );
}
