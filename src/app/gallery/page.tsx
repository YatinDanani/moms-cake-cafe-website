import type { Metadata } from "next";
import Link from "next/link";
import { getGallery, getGalleryCategories } from "@/lib/siteOverrides";
import { CakeIllustration } from "@/components/CakeIllustration";
import { GalleryBrowser } from "@/components/GalleryBrowser";

export const metadata: Metadata = {
  title: "Gallery | Mom's Cake Café",
  description: "A look at cakes we've built for celebrations around Victoria.",
};

export default async function GalleryPage() {
  const [photos, galleryCategories] = await Promise.all([getGallery(), getGalleryCategories()]);
  const sections = galleryCategories
    .map((category) => ({ category, photos: photos.filter((p) => p.category === category) }))
    .filter((s) => s.photos.length > 0);

  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 pt-16 pb-20">
        <div className="text-center">
          <h1 className="font-display text-4xl sm:text-5xl font-semibold">Gallery</h1>
          <p className="mt-4 text-cocoa/75 max-w-xl mx-auto">
            A look at cakes we&apos;ve built for birthdays, weddings, and
            everything in between.
          </p>
        </div>

        {sections.length > 0 ? (
          <div className="mt-12">
            <GalleryBrowser sections={sections} />
          </div>
        ) : (
          <div className="mt-12 flex flex-col items-center text-center">
            <CakeIllustration className="w-full max-w-[220px]" />
            <p className="mt-6 text-cocoa/70 max-w-sm">
              Photos are on their way. In the meantime, browse the menu or
              start a custom order.
            </p>
            <Link
              href="/custom-cakes"
              className="mt-6 inline-flex items-center rounded-full bg-coffee px-6 py-3.5 text-base font-semibold text-cream hover:bg-coffee-dark transition-colors"
            >
              Order a custom cake
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
