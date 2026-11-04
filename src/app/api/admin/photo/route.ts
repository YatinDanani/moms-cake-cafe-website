import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { isAuthenticated } from "@/lib/adminAuth";
import { savePhoto } from "@/lib/siteOverrides";
import { photoSlots } from "@/lib/content";

const MAX_BYTES = 8 * 1024 * 1024; // 8MB

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const slot = String(formData.get("slot") ?? "");
  const file = formData.get("file");

  if (!photoSlots.some((s) => s.key === slot)) {
    return NextResponse.json({ error: "Unknown photo slot" }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "File must be an image" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image is too large (max 8MB)" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  await savePhoto(slot, bytes, file.type);
  revalidateTag("site-overrides", { expire: 0 });
  return NextResponse.json({ ok: true });
}
