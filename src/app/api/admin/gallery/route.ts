import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { isAuthenticated } from "@/lib/adminAuth";
import {
  getGallery,
  saveGallery,
  getGalleryCategories,
  savePhoto,
  deletePhoto,
  type GalleryPhoto,
} from "@/lib/siteOverrides";

const MAX_BYTES = 8 * 1024 * 1024; // 8MB

export async function POST(request: NextRequest) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const caption = String(formData.get("caption") ?? "").trim();
    const requestedCategory = String(formData.get("category") ?? "");
    const validCategories = await getGalleryCategories();
    const category = validCategories.includes(requestedCategory) ? requestedCategory : validCategories[0];

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "Image is too large (max 8MB)" }, { status: 400 });
    }

    const key = `gallery-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const bytes = await file.arrayBuffer();
    await savePhoto(key, bytes, file.type);

    const gallery = await getGallery();
    const next: GalleryPhoto[] = [...gallery, { key, caption, category }];
    await saveGallery(next);

    revalidateTag("site-overrides", { expire: 0 });
    return NextResponse.json({ ok: true, key });
  } catch (err) {
    console.error("Gallery upload failed:", err);
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const key = typeof body?.key === "string" ? body.key : "";
  if (!key) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const gallery = await getGallery();
  await saveGallery(gallery.filter((p) => p.key !== key));
  await deletePhoto(key);

  revalidateTag("site-overrides", { expire: 0 });
  return NextResponse.json({ ok: true });
}
