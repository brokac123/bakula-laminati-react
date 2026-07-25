import { BadgeIcon, CreditCardIcon, GridIcon, TagIcon } from "./icons";

const FEATURES = [
  {
    icon: GridIcon,
    title: "Veliki izbor",
    text: "Preko stotinu dekora laminata, vinilnih podova i lajsni renomiranih proizvođača.",
  },
  {
    icon: BadgeIcon,
    title: "Renomiranost",
    text: "10 godina iskustva i povjerenja kupaca u Osijeku i okolici.",
  },
  {
    icon: TagIcon,
    title: "Popusti & sniženja",
    text: "Redovita posebna ponuda i povoljne cijene za svaki proračun.",
  },
  {
    icon: CreditCardIcon,
    title: "Fleksibilno plaćanje",
    text: "Prilagodljivi uvjeti plaćanja dogovoreni izravno s nama.",
  },
];

export default function FeatureCallouts() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {FEATURES.map(({ icon: Icon, title, text }) => (
        <div
          key={title}
          className="rounded-2xl border border-wood-100 bg-white p-6 text-left shadow-sm shadow-wood-900/5"
        >
          <div className="flex size-11 items-center justify-center rounded-xl bg-gold-400/15 text-gold-600">
            <Icon className="size-6" />
          </div>
          <h3 className="mt-4 font-heading text-lg font-semibold text-wood-800">{title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-wood-500">{text}</p>
        </div>
      ))}
    </div>
  );
}
