import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/adminAuth";
import { savePhoto } from "@/lib/siteOverrides";

const MAX_BYTES = 8 * 1024 * 1024; // 8MB

// Generic "upload an image, get back a key" endpoint — used for menu item
// photos, which get attached to an item's `photo` field and only actually
// saved to the menu document when the admin clicks "Save menu". Distinct
// from /api/admin/photo (named slots) and /api/admin/gallery (which also
// appends to the gallery list as a side effect).
export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "File must be an image" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image is too large (max 8MB)" }, { status: 400 });
  }

  const key = `item-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const bytes = await file.arrayBuffer();
  await savePhoto(key, bytes, file.type);

  return NextResponse.json({ ok: true, key });
}
