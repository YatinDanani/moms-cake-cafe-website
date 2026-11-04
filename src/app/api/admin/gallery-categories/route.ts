import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { isAuthenticated } from "@/lib/adminAuth";
import { saveGalleryCategories, getGallery, saveGallery } from "@/lib/siteOverrides";

type Rename = { from: string; to: string };

function sanitizeRenames(input: unknown): Rename[] {
  if (!Array.isArray(input)) return [];
  const renames: Rename[] = [];
  for (const raw of input) {
    if (!raw || typeof raw !== "object") continue;
    const from = String((raw as Record<string, unknown>).from ?? "").trim();
    const to = String((raw as Record<string, unknown>).to ?? "").trim();
    if (from && to && from !== to) renames.push({ from, to });
  }
  return renames;
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body || !Array.isArray(body.categories)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const seen = new Set<string>();
  const categories: string[] = [];
  for (const raw of body.categories) {
    const name = String(raw ?? "").trim();
    if (!name || seen.has(name)) continue;
    seen.add(name);
    categories.push(name);
  }

  if (categories.length === 0) {
    return NextResponse.json({ error: "At least one category is required" }, { status: 400 });
  }

  // Carry photos along when a category is renamed, rather than leaving them
  // filed under a name that no longer exists.
  const renames = sanitizeRenames(body.renames);
  if (renames.length > 0) {
    const gallery = await getGallery();
    const updated = gallery.map((photo) => {
      const rename = renames.find((r) => r.from === photo.category);
      return rename ? { ...photo, category: rename.to } : photo;
    });
    await saveGallery(updated);
  }

  await saveGalleryCategories(categories);
  revalidateTag("site-overrides", { expire: 0 });
  return NextResponse.json({ ok: true });
}
