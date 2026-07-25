import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
      <p className="font-heading text-6xl text-wood-300">404</p>
      <h1 className="mt-4 text-2xl font-semibold text-wood-800">Stranica nije pronađena</h1>
      <p className="mt-2 text-wood-500">
        Stranica koju tražite ne postoji ili je premještena.
      </p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-full bg-wood-800 px-6 py-3 text-sm font-medium text-cream-50 hover:bg-wood-700"
      >
        Natrag na naslovnu
      </Link>
    </div>
  );
}
