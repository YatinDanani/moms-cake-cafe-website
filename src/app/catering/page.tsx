import type { Metadata } from "next";
import { cateringPackages } from "@/lib/content";
import { CateringForm } from "@/components/CateringForm";

export const metadata: Metadata = {
  title: "Catering & Events | Mom's Cake Café",
  description: "Tailored catering packages, including custom cakes, full meal catering, a coffee bar, and dessert buffets, for events around Victoria.",
};

const colorMap: Record<number, { bg: string; text: string }> = {
  0: { bg: "bg-coffee", text: "text-cream" },
  1: { bg: "bg-caramel", text: "text-cocoa" },
  2: { bg: "bg-mocha", text: "text-cream" },
  3: { bg: "bg-latte", text: "text-cocoa" },
};

export default function CateringPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[420px] sm:min-h-[520px] flex items-end">
        <div className="absolute inset-0 bg-gradient-to-br from-mocha via-coffee to-cocoa" />
        <div className="absolute inset-0 bg-gradient-to-t from-cocoa via-cocoa/50 to-cocoa/10" />
        <div className="relative z-10 w-full mx-auto max-w-4xl px-5 sm:px-8 pt-20 pb-14 text-center">
          <p className="font-script text-2xl text-latte">Catering &amp; events</p>
          <h1 className="font-display text-4xl sm:text-6xl font-semibold leading-tight text-cream mt-1">
            Let us make your{" "}
            <span className="font-script font-normal text-latte">celebration special</span>
          </h1>
          <p className="mt-6 text-lg text-cream/85 max-w-xl mx-auto">
            From intimate gatherings to grand celebrations, we offer tailored
            catering packages featuring our handcrafted cakes, pastries,
            meals, and beverages.
          </p>
        </div>
      </section>

      {/* Packages */}
      <section className="bg-tan">
        <div className="mx-auto max-w-5xl px-5 sm:px-8 py-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cateringPackages.map((pkg, i) => {
            const c = colorMap[i % 4];
            return (
              <div key={pkg.name} className={`${c.bg} ${c.text} rounded-3xl p-6`}>
                <p className="font-display text-lg font-semibold">{pkg.name}</p>
                <p className="mt-2 text-sm opacity-90">{pkg.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Request a quote */}
      <section className="bg-tan">
        <div className="mx-auto max-w-2xl px-5 sm:px-8 py-16">
          <div className="text-center mb-8">
            <h2 className="font-display text-3xl font-semibold">Request a quote</h2>
            <p className="mt-3 text-cocoa/75">
              Tell us about your event and we&apos;ll craft the perfect package.
            </p>
          </div>
          <div className="bg-cream rounded-3xl p-7 sm:p-8">
            <CateringForm />
          </div>
        </div>
      </section>
    </>
  );
}
