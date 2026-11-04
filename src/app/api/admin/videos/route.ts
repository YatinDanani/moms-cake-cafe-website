import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { isAuthenticated } from "@/lib/adminAuth";
import { saveVideos, type VideoItem } from "@/lib/siteOverrides";

function sanitizeItem(input: unknown): VideoItem | null {
  if (!input || typeof input !== "object") return null;
  const title = String((input as Record<string, unknown>).title ?? "").trim();
  const url = String((input as Record<string, unknown>).url ?? "").trim();
  if (!url) return null;
  return { title, url };
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body || !Array.isArray(body.items)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const items = body.items.map(sanitizeItem).filter((i: VideoItem | null): i is VideoItem => i !== null);
  await saveVideos(items);
  revalidateTag("site-overrides", { expire: 0 });
  return NextResponse.json({ ok: true });
}
