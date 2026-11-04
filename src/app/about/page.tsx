import type { Metadata } from "next";
import Image from "next/image";
import { values } from "@/lib/content";

export const metadata: Metadata = {
  title: "Our Story | Mom's Cake Café",
  description: "How Mom's Cake Café grew from a home kitchen into a storefront on Oak Bay Ave.",
};

export default function AboutPage() {
  return (
    <>
      <section className="bg-cocoa text-cream">
        <div className="mx-auto max-w-5xl px-5 sm:px-8 pt-16 pb-16 grid lg:grid-cols-2 gap-10 lg:items-start">
          <div>
            <p className="font-script text-2xl text-latte">Our story</p>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold mt-1">
              A legacy baked{" "}
              <span className="font-script font-normal text-latte">with love</span>
            </h1>
            <div className="mt-8 space-y-5 text-cream/85 text-lg leading-relaxed">
              <p>
                It all began in a humble family kitchen, where the aroma of
                freshly baked cakes filled the air every weekend. Our founder,
                a mother with a passion for baking, started creating cakes for
                family celebrations, each one a labor of love, perfected
                through years of tradition and heart.
              </p>
              <p>
                What started as a small home-based baking business, driven by
                requests from neighbors and friends, soon blossomed into
                something much bigger. The dream was simple: to create a warm,
                welcoming space where families and friends could gather,
                celebrate, and create memories over handcrafted cakes and
                exceptional coffee.
              </p>
              <p>
                Today, Mom&apos;s Cake Café stands as a testament to that
                dream: a place where the values of quality, hospitality, and
                family remain at the heart of everything we do. Every recipe
                carries the warmth of home, and every guest is treated like
                part of the family.
              </p>
            </div>
          </div>
          <div className="relative aspect-[3/4] rounded-3xl overflow-hidden">
            <Image
              src="/founders.jpg"
              alt="The founders of Mom's Cake Café"
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto max-w-4xl px-5 sm:px-8 py-16 grid sm:grid-cols-2 gap-10">
          <div>
            <h2 className="font-display text-2xl font-semibold">What we&apos;re after</h2>
            <p className="mt-3 text-cocoa/75">
              A café people come back to. Not just for cake, but for the
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
