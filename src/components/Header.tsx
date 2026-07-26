import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ChevronDownIcon, CloseIcon, MenuIcon, PhoneIcon } from "./icons";

const NAV_LINKS = [
  { label: "Naslovna", to: "/" },
  { label: "O nama", to: "/o-nama" },
  {
    label: "Katalog proizvoda",
    to: "/katalog",
    children: [
      { label: "Laminati", to: "/katalog?kategorija=laminati" },
      { label: "Vinil podovi", to: "/katalog?kategorija=vinil-podovi" },
    ],
  },
  { label: "Posebna ponuda", to: "/katalog?kategorija=posebna-ponuda" },
  { label: "Kontaktirajte nas!", to: "/kontakt" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-wood-100 bg-cream-50/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center shrink-0" onClick={() => setOpen(false)}>
          <img
            src="/images/brand/logo-main.png"
            alt="Bakula laminati"
            className="h-12 w-auto sm:h-14"
          />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((item) => (
            <div key={item.label} className="group relative">
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "text-gold-600"
                      : "text-wood-700 hover:text-gold-600"
                  }`
                }
                end={item.to === "/"}
              >
                {item.label}
                {item.children && <ChevronDownIcon className="size-3.5" />}
              </NavLink>
              {item.children && (
                <div className="invisible absolute left-1/2 top-full z-10 min-w-44 -translate-x-1/2 rounded-xl border border-wood-100 bg-cream-50 p-1.5 opacity-0 shadow-lg shadow-wood-900/5 transition-all group-hover:visible group-hover:opacity-100">
                  {item.children.map((child) => (
                    <Link
                      key={child.label}
                      to={child.to}
                      className="block rounded-lg px-3 py-2 text-sm text-wood-700 hover:bg-wood-50 hover:text-gold-600"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <a
          href="tel:+385915222559"
          className="hidden items-center gap-2 rounded-full bg-wood-800 px-4 py-2 text-sm font-medium text-cream-50 transition-colors hover:bg-wood-700 lg:flex"
        >
          <PhoneIcon className="size-4" />
          091-522-2559
        </a>

        <button
          type="button"
          className="rounded-lg p-2 text-wood-700 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Zatvori izbornik" : "Otvori izbornik"}
        >
          {open ? <CloseIcon className="size-6" /> : <MenuIcon className="size-6" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-wood-100 bg-cream-50 px-4 py-3 lg:hidden">
          {NAV_LINKS.map((item) => (
            <div key={item.label} className="py-1">
              <Link
                to={item.to}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-2 py-2 text-sm font-medium text-wood-800"
              >
                {item.label}
              </Link>
              {item.children && (
                <div className="ml-3 border-l border-wood-100 pl-3">
                  {item.children.map((child) => (
                    <Link
                      key={child.label}
                      to={child.to}
                      onClick={() => setOpen(false)}
                      className="block rounded-lg px-2 py-1.5 text-sm text-wood-600"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <a
            href="tel:+385915222559"
            className="mt-2 flex items-center justify-center gap-2 rounded-full bg-wood-800 px-4 py-2 text-sm font-medium text-cream-50"
          >
            <PhoneIcon className="size-4" />
            091-522-2559
          </a>
        </nav>
      )}
    </header>
  );
}
