import type { Metadata } from "next";
import { isAuthenticated } from "@/lib/adminAuth";
import {
  getMenu,
  getPhotoVersions,
  getGallery,
  getGalleryCategories,
  getPress,
  getVideos,
  getDeliveryLinks,
  getTestimonials,
} from "@/lib/siteOverrides";
import { photoSlots } from "@/lib/content";
import { AdminLoginForm } from "@/components/AdminLoginForm";
import { AdminDashboard } from "@/components/AdminDashboard";
import { GalleryCategoriesManager } from "@/components/GalleryCategoriesManager";
import { GalleryManager } from "@/components/GalleryManager";
import { PressManager } from "@/components/PressManager";
import { VideosManager } from "@/components/VideosManager";
import { DeliveryLinksEditor } from "@/components/DeliveryLinksEditor";
import { TestimonialsManager } from "@/components/TestimonialsManager";

export const metadata: Metadata = {
  title: "Admin | Mom's Cake Café",
  robots: { index: false, follow: false },
};

// This page reads a session cookie on every request and is only ever
// visited directly (never linked/prefetched), so it's fine for it to
// block instead of being prerendered — see Next's Cache Components +
// authentication guide.
export const instant = false;

export default async function AdminPage() {
  const authed = await isAuthenticated();

  if (!authed) {
    return (
      <section className="bg-cream min-h-[70vh] flex items-center justify-center px-5">
        <AdminLoginForm />
      </section>
    );
  }

  const [menu, photoVersions, gallery, galleryCategories, press, videos, delivery, testimonials] =
    await Promise.all([
      getMenu(),
      getPhotoVersions(photoSlots.map((s) => s.key)),
      getGallery(),
      getGalleryCategories(),
      getPress(),
      getVideos(),
      getDeliveryLinks(),
      getTestimonials(),
    ]);

  return (
    <section className="bg-cream min-h-[70vh] px-5 sm:px-8 py-16">
      <div className="mx-auto max-w-3xl space-y-12">
        <AdminDashboard initialMenu={menu} photoSlots={photoSlots} photoVersions={photoVersions} />
        <GalleryCategoriesManager initialCategories={galleryCategories} />
        <GalleryManager initialPhotos={gallery} categories={galleryCategories} />
        <PressManager initialItems={press} />
        <VideosManager initialItems={videos} />
        <TestimonialsManager initialItems={testimonials} />
        <DeliveryLinksEditor initialLinks={delivery} />
      </div>
    </section>
  );
}
