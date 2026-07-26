import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { isEmailConfigured, sendContactMessage } from "../lib/emailjs";
import { MailIcon, MapPinIcon, PhoneIcon } from "../components/icons";

const REMEMBER_KEY = "bakula:contact-remember";

interface RememberedDetails {
  name: string;
  email: string;
  phone: string;
}

type Status = "idle" | "sending" | "success" | "error";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [remember, setRemember] = useState(false);
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(REMEMBER_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as RememberedDetails;
      setName(saved.name ?? "");
      setEmail(saved.email ?? "");
      setPhone(saved.phone ?? "");
      setRemember(true);
    } catch {
      // ignore
    }
  }, []);

  const mailtoHref = `mailto:luka.bakula1@gmail.com?subject=${encodeURIComponent(
    subject || "Upit s web stranice",
  )}&body=${encodeURIComponent(
    `${message}\n\n${name}\n${email}\n${phone}`,
  )}`;

  function rememberDetails() {
    if (remember) {
      localStorage.setItem(REMEMBER_KEY, JSON.stringify({ name, email, phone }));
    } else {
      localStorage.removeItem(REMEMBER_KEY);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // EmailJS not configured yet - fall back to opening the user's own mail
    // client with the message pre-filled, so the form still works end to end.
    if (!isEmailConfigured) {
      rememberDetails();
      window.location.href = mailtoHref;
      setStatus("success");
      return;
    }

    setStatus("sending");
    try {
      await sendContactMessage({ name, email, phone, subject, message });
      setStatus("success");
      setMessage("");
      rememberDetails();
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <nav className="text-xs text-wood-400">
        <Link to="/" className="hover:text-gold-600">
          Naslovna
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-wood-600">Kontakt</span>
      </nav>
      <h1 className="mt-2 font-heading text-4xl font-semibold text-wood-800">Kontaktirajte nas</h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        {/* Left column */}
        <div>
          <p className="text-wood-500 leading-relaxed">
            Imate pitanje o našoj ponudi laminata, vinilnih podova ili lajsni? Javite nam se
            putem obrasca ili nas kontaktirajte izravno - rado ćemo vam pomoći pronaći
            rješenje koje odgovara vašem prostoru.
          </p>

          <dl className="mt-8 space-y-1 text-sm text-wood-600">
            <div className="flex justify-between border-b border-wood-100 py-2.5">
              <dt className="text-wood-400">Naziv obrta</dt>
              <dd className="font-medium">Bakula, trgovački obrt</dd>
            </div>
            <div className="flex justify-between py-2.5">
              <dt className="text-wood-400">Vlasnik</dt>
              <dd className="font-medium">Damir Bakula</dd>
            </div>
          </dl>

          <ul className="mt-8 space-y-4 text-sm text-wood-700">
            <li className="flex items-start gap-3">
              <MapPinIcon className="mt-0.5 size-5 shrink-0 text-gold-600" />
              Ulica Matije Gupca 58, Osijek, Hrvatska
            </li>
            <li className="flex items-center gap-3">
              <PhoneIcon className="size-5 shrink-0 text-gold-600" />
              <a href="tel:+385915222559" className="hover:text-gold-600">
                +385 (0)91-522-2559
              </a>
            </li>
            <li className="flex items-center gap-3">
              <PhoneIcon className="size-5 shrink-0 text-gold-600" />
              <a href="tel:+38531505061" className="hover:text-gold-600">
                +385 (0)31-505-061
              </a>
            </li>
            <li className="flex items-center gap-3">
              <MailIcon className="size-5 shrink-0 text-gold-600" />
              <a href="mailto:info@bakula-laminati.hr" className="hover:text-gold-600">
                info@bakula-laminati.hr
              </a>
            </li>
          </ul>
        </div>

        {/* Right column - form */}
        <div className="rounded-2xl bg-wood-800 p-6 text-cream-50 sm:p-8">
          {status === "success" ? (
            <div className="flex h-full flex-col items-center justify-center py-10 text-center">
              <p className="font-heading text-xl font-semibold">
                {isEmailConfigured ? "Poruka je poslana!" : "Otvorite svoj email…"}
              </p>
              <p className="mt-2 text-sm text-wood-200">
                {isEmailConfigured
                  ? "Hvala na upitu, javit ćemo vam se u najkraćem mogućem roku."
                  : "Otvorili smo vaš email program s pripremljenom porukom - pošaljite je da dovršite upit."}
              </p>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="mt-6 rounded-full bg-gold-500 px-6 py-2.5 text-sm font-semibold text-wood-900 hover:bg-gold-400"
              >
                Pošaljite novu poruku
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="message" className="sr-only">
                  Poruka
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Vaša poruka…"
                  className="w-full rounded-xl border border-wood-600 bg-wood-700/40 px-4 py-3 text-sm text-cream-50 placeholder:text-wood-300 focus:border-gold-400 focus:outline-none"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="sr-only">
                    Ime i prezime
                  </label>
                  <input
                    id="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ime i prezime"
                    className="w-full rounded-xl border border-wood-600 bg-wood-700/40 px-4 py-2.5 text-sm text-cream-50 placeholder:text-wood-300 focus:border-gold-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="sr-only">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full rounded-xl border border-wood-600 bg-wood-700/40 px-4 py-2.5 text-sm text-cream-50 placeholder:text-wood-300 focus:border-gold-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="phone" className="sr-only">
                    Telefon
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Telefon"
                    className="w-full rounded-xl border border-wood-600 bg-wood-700/40 px-4 py-2.5 text-sm text-cream-50 placeholder:text-wood-300 focus:border-gold-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="sr-only">
                    Predmet
                  </label>
                  <input
                    id="subject"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Predmet"
                    className="w-full rounded-xl border border-wood-600 bg-wood-700/40 px-4 py-2.5 text-sm text-cream-50 placeholder:text-wood-300 focus:border-gold-400 focus:outline-none"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-wood-200">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="size-4 rounded border-wood-500 accent-gold-500"
                />
                Zapamti moje podatke za sljedeći put
              </label>

              {status === "error" && (
                <p className="rounded-lg bg-wood-900/60 px-4 py-3 text-sm text-gold-300">
                  Slanje trenutno nije uspjelo.{" "}
                  <a href={mailtoHref} className="underline hover:text-gold-200">
                    Pošaljite nam poruku izravno e-mailom
                  </a>
                  .
                </p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-wood-900 hover:bg-gold-400 disabled:opacity-60"
              >
                {status === "sending" ? "Šaljem…" : "Pošalji Poruku!"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
