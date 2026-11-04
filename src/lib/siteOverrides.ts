import { getStore } from "@netlify/blobs";
import { cacheTag } from "next/cache";
import {
  cakeMenu as defaultMenu,
  galleryCategories as defaultGalleryCategories,
  testimonials as defaultTestimonials,
} from "./content";

export type MenuSize = { label: string; price: string };
export type MenuItem = { name: string; description?: string; photo?: string; sizes: MenuSize[] };
export type MenuCategory = { category: string; note?: string; items: MenuItem[] };
export type Menu = MenuCategory[];

export type GalleryPhoto = { key: string; caption: string; category: string };
export type PressItem = { title: string; publication: string; url: string };
export type VideoItem = { title: string; url: string };
export type DeliveryLinks = { doordash: string; ubereats: string };
export type Testimonial = { quote: string; name: string };

const MENU_KEY = "menu.json";
const GALLERY_KEY = "gallery.json";
const GALLERY_CATEGORIES_KEY = "gallery-categories.json";
const PRESS_KEY = "press.json";
const VIDEOS_KEY = "videos.json";
const DELIVERY_KEY = "delivery.json";
const TESTIMONIALS_KEY = "testimonials.json";
const OVERRIDES_STORE = "site-overrides";
const MENU_STORE = OVERRIDES_STORE;
const PHOTOS_STORE = "site-photos";

async function getJSON<T>(key: string, fallback: T): Promise<T> {
  try {
    const store = getStore(OVERRIDES_STORE);
    const data = await store.get(key, { type: "json" });
    if (data !== null && data !== undefined) return data as T;
  } catch {
    // fall through to fallback
  }
  return fallback;
}

async function saveJSON<T>(key: string, value: T) {
  const store = getStore(OVERRIDES_STORE);
  await store.setJSON(key, value);
}

// Cached + tagged so the public menu page stays static; an admin save calls
// revalidateTag("site-overrides") to force the next read to go fresh.
// Falls back to the menu baked into content.ts on any Blobs failure or if
// nothing's been saved yet, so a storage hiccup never breaks the public site.
export async function getMenu(): Promise<Menu> {
  "use cache";
  cacheTag("site-overrides");
  try {
    const store = getStore(MENU_STORE);
    const data = await store.get(MENU_KEY, { type: "json" });
    if (Array.isArray(data)) return data as Menu;
  } catch {
    // fall through to default
  }
  return defaultMenu as unknown as Menu;
}

export async function saveMenu(menu: Menu) {
  const store = getStore(MENU_STORE);
  await store.setJSON(MENU_KEY, menu);
}

export async function savePhoto(slot: string, bytes: ArrayBuffer, contentType: string) {
  const store = getStore(PHOTOS_STORE);
  await store.set(slot, bytes, { metadata: { contentType, updatedAt: Date.now() } });
}

export async function getPhoto(slot: string) {
  try {
    const store = getStore(PHOTOS_STORE);
    const entry = await store.getWithMetadata(slot, { type: "arrayBuffer" });
    if (!entry || !entry.data) return null;
    return {
      data: entry.data as ArrayBuffer,
      contentType: (entry.metadata?.contentType as string) || "image/jpeg",
      updatedAt: (entry.metadata?.updatedAt as number) || 0,
    };
  } catch {
    return null;
  }
}

// Which photo slots currently have a real uploaded photo, for the admin
// dashboard and for pages deciding whether to render a photo or fall back
// to their placeholder. Cached the same way as the menu.
export async function getPhotoVersions(slotKeys: readonly string[]): Promise<Record<string, number>> {
  "use cache";
  cacheTag("site-overrides");
  const versions: Record<string, number> = {};
  for (const slot of slotKeys) {
    try {
      const store = getStore(PHOTOS_STORE);
      const meta = await store.getMetadata(slot);
      if (meta) versions[slot] = (meta.metadata?.updatedAt as number) || 1;
    } catch {
      // no photo set for this slot — leave it out
    }
  }
  return versions;
}

export async function deletePhoto(slot: string) {
  try {
    const store = getStore(PHOTOS_STORE);
    await store.delete(slot);
  } catch {
    // nothing to clean up
  }
}

// Gallery: an admin-managed, ordered list of cake photos, separate from the
// fixed named photo slots above. Each entry's `key` points at a blob in
// PHOTOS_STORE, served the same way by /api/photos/[slot].
export async function getGallery(): Promise<GalleryPhoto[]> {
  "use cache";
  cacheTag("site-overrides");
  const photos = await getJSON<GalleryPhoto[]>(GALLERY_KEY, []);
  // Backfill a category for any photo saved before categories existed.
  return photos.map((p) => ({ ...p, category: p.category || defaultGalleryCategories[0] }));
}

export async function saveGallery(photos: GalleryPhoto[]) {
  return saveJSON(GALLERY_KEY, photos);
}

// Admin-editable gallery categories, seeded from content.ts on first use.
export async function getGalleryCategories(): Promise<string[]> {
  "use cache";
  cacheTag("site-overrides");
  const categories = await getJSON<string[]>(GALLERY_CATEGORIES_KEY, []);
  return categories.length > 0 ? categories : [...defaultGalleryCategories];
}

export async function saveGalleryCategories(categories: string[]) {
  return saveJSON(GALLERY_CATEGORIES_KEY, categories);
}

export async function getPress(): Promise<PressItem[]> {
  "use cache";
  cacheTag("site-overrides");
  return getJSON<PressItem[]>(PRESS_KEY, []);
}

export async function savePress(items: PressItem[]) {
  return saveJSON(PRESS_KEY, items);
}

export async function getVideos(): Promise<VideoItem[]> {
  "use cache";
  cacheTag("site-overrides");
  return getJSON<VideoItem[]>(VIDEOS_KEY, []);
}

export async function saveVideos(items: VideoItem[]) {
  return saveJSON(VIDEOS_KEY, items);
}

export async function getDeliveryLinks(): Promise<DeliveryLinks> {
  "use cache";
  cacheTag("site-overrides");
  return getJSON<DeliveryLinks>(DELIVERY_KEY, { doordash: "", ubereats: "" });
}

export async function saveDeliveryLinks(links: DeliveryLinks) {
  return saveJSON(DELIVERY_KEY, links);
}

// Admin-editable reviews, seeded from content.ts on first use.
export async function getTestimonials(): Promise<Testimonial[]> {
  "use cache";
  cacheTag("site-overrides");
  const items = await getJSON<Testimonial[]>(TESTIMONIALS_KEY, []);
  return items.length > 0 ? items : [...defaultTestimonials];
}

export async function saveTestimonials(items: Testimonial[]) {
  return saveJSON(TESTIMONIALS_KEY, items);
}
