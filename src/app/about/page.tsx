import type { Metadata } from "next";
import { story, values } from "@/lib/content";

export const metadata: Metadata = {
  title: "Our Story — Mom's Cake Café",
  description: "How Mom's Cake Café grew from a home kitchen into a storefront on Oak Bay Ave.",
};

export default function AboutPage() {
  return (
    <>
      <section className="bg-cream">
        <div className="mx-auto max-w-3xl px-5 sm:px-8 pt-16 pb-14">
          <h1 className="font-display text-4xl sm:text-5xl font-semibold">Our story</h1>
          <p className="mt-5 text-lg text-cocoa/75">
            Mom&apos;s Cake Café didn&apos;t start as a business plan. It
            started as birthday cakes for neighbors, made in a home kitchen
            with recipes that were already decades old. What changed over the
            years was never the recipes — it was how many people got to eat
            them.
          </p>
        </div>
      </section>

      <section className="bg-tan">
        <div className="mx-auto max-w-4xl px-5 sm:px-8 py-16">
          <ol className="space-y-8">
            {story.map((s, i) => (
              <li key={s.year} className="flex gap-6 items-start">
                <div
                  className="shrink-0 rounded-3xl bg-caramel flex flex-col items-center justify-center font-display font-semibold text-cocoa text-center leading-none"
                  style={{ width: `${88 + i * 22}px`, height: `${88 + i * 22}px` }}
                >
                  <span className="text-sm opacity-70">tier {i + 1}</span>
                  <span className="text-lg mt-1">{s.year}</span>
                </div>
                <div className="pt-2">
                  <p className="font-display text-xl font-semibold">{s.title}</p>
                  <p className="mt-2 text-cocoa/75 max-w-md">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto max-w-4xl px-5 sm:px-8 py-16 grid sm:grid-cols-2 gap-10">
          <div>
            <h2 className="font-display text-2xl font-semibold">What we&apos;re after</h2>
            <p className="mt-3 text-cocoa/75">
              A café people come back to — not just for cake, but for the
              table they sat at while they ate it. Quality first, hospitality
              always.
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold">What we value</h2>
            <ul className="mt-3 space-y-3">
              {values.map((v) => (
                <li key={v.name}>
                  <span className="font-semibold text-coffee">{v.name}.</span>{" "}
                  <span className="text-cocoa/75">{v.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
