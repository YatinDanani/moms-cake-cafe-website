import Link from "next/link";
import { business, offerings, story, testimonials } from "@/lib/content";

const colorMap: Record<string, { bg: string; text: string }> = {
  coffee: { bg: "bg-coffee", text: "text-cream" },
  caramel: { bg: "bg-caramel", text: "text-cocoa" },
  mocha: { bg: "bg-mocha", text: "text-cream" },
  latte: { bg: "bg-latte", text: "text-cocoa" },
};

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[560px] sm:min-h-[680px] flex items-end">
        {/* Stand-in background until a real photo is supplied — swap for
            next/image (fill, object-cover) in place of this gradient div,
            keep the overlay div below it for text legibility. */}
        <div className="absolute inset-0 bg-gradient-to-br from-mocha via-coffee to-cocoa" />
        <div className="absolute inset-0 bg-gradient-to-t from-cocoa via-cocoa/50 to-cocoa/10" />

        <div className="hero-rise relative z-10 w-full mx-auto max-w-6xl px-5 sm:px-8 pt-24 pb-16 sm:pb-24">
          <p className="font-script text-2xl sm:text-3xl text-latte">Handcrafted with love</p>
          <h1 className="font-display text-5xl sm:text-7xl font-semibold leading-[1.1] text-cream mt-1">
            Where every slice
            <br />
            <span className="font-script font-normal text-5xl sm:text-7xl text-latte">
              tells a story.
            </span>
          </h1>
          <p className="mt-6 text-lg text-cream/85 max-w-md">
            A neighborhood café on Oak Bay Ave where custom cakes, cupcakes,
            sansrival, and coffee come out of the same small kitchen that
            started this whole thing.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/custom-cakes"
              className="inline-flex items-center rounded-full bg-caramel px-6 py-3.5 text-base font-semibold text-cocoa hover:bg-latte transition-colors"
            >
              Order a custom cake
            </Link>
            <Link
              href="/menu"
              className="inline-flex items-center rounded-full border-2 border-cream/50 px-6 py-3.5 text-base font-semibold text-cream hover:border-cream transition-colors"
            >
              See the menu
            </Link>
          </div>
        </div>
      </section>

      {/* Offerings */}
      <section className="bg-tan">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 pt-16 pb-20">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold max-w-lg">
            Everything comes out of one kitchen
          </h2>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {offerings.map((o) => {
              const c = colorMap[o.color];
              return (
                <div
                  key={o.key}
                  className={`${c.bg} ${c.text} rounded-3xl p-6 flex flex-col justify-between min-h-[180px]`}
                >
                  <p className="font-display text-xl font-semibold">{o.name}</p>
                  <p className="mt-3 text-sm opacity-90">{o.blurb}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Story / timeline */}
      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 pt-16 pb-20">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold">
                From one oven to a storefront
              </h2>
              <p className="mt-5 text-cocoa/75 max-w-md">
                Mom&apos;s Cake Café grew one order at a time. The recipes
                didn&apos;t change — just how many people got to eat them.
              </p>
              <Link
                href="/about"
                className="mt-6 inline-flex text-coffee font-semibold hover:text-coffee-dark"
              >
                Read our full story
              </Link>
            </div>
            <ol className="space-y-5">
              {story.map((s, i) => (
                <li
                  key={s.year}
                  className="flex gap-5 items-start"
                  style={{ marginLeft: `${i * 28}px` }}
                >
                  <div
                    className="shrink-0 rounded-2xl bg-caramel flex items-center justify-center font-display font-semibold text-cocoa"
                    style={{ width: `${64 + i * 16}px`, height: `${64 + i * 16}px` }}
                  >
                    {s.year}
                  </div>
                  <div className="pt-1">
                    <p className="font-display text-lg font-semibold">{s.title}</p>
                    <p className="text-sm text-cocoa/70 mt-1 max-w-sm">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-cocoa text-cream">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 pt-16 pb-20">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold">
            Loved by Victoria
          </h2>
          <div className="mt-10 grid sm:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <figure key={t.name} className="bg-cream/5 rounded-3xl p-6 border border-cream/10">
                <blockquote className="text-cream/90 text-[15px] leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-4 text-sm font-semibold text-latte">
                  {t.name}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="bg-coffee text-cream text-center">
        <div className="mx-auto max-w-2xl px-5 sm:px-8 pt-16 pb-20">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold">
            Planning something worth celebrating?
          </h2>
          <p className="mt-4 text-cream/85">
            Tell us the occasion, the flavor, and the date — we&apos;ll handle the rest.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/custom-cakes"
              className="inline-flex items-center rounded-full bg-cream px-6 py-3.5 text-base font-semibold text-coffee hover:bg-latte transition-colors"
            >
              Start a custom order
            </Link>
            <Link
              href="/catering"
              className="inline-flex items-center rounded-full border-2 border-cream/40 px-6 py-3.5 text-base font-semibold text-cream hover:border-cream transition-colors"
            >
              Plan an event
            </Link>
          </div>
        </div>
      </section>

      {/* Visit */}
      <section className="bg-tan">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 pt-16 pb-20">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold">Visit us</h2>
          <p className="mt-4 text-cocoa/75 max-w-sm">
            {business.addressLine1}, {business.addressLine2}
          </p>
          <a
            href={business.mapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex text-coffee font-semibold hover:text-coffee-dark"
          >
            Open in Google Maps
          </a>
          <ul className="mt-5 space-y-2 text-sm text-cocoa/80">
            {business.hours.map((h) => (
              <li key={h.days} className="flex justify-between max-w-xs">
                <span>{h.days}</span>
                <span className="font-medium">{h.time}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/contact"
            className="mt-6 inline-flex text-coffee font-semibold hover:text-coffee-dark"
          >
            Get directions & contact details
          </Link>
        </div>
      </section>
    </>
  );
}
