import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { isAuthenticated } from "@/lib/adminAuth";
import { saveTestimonials, type Testimonial } from "@/lib/siteOverrides";

function sanitizeItem(input: unknown): Testimonial | null {
  if (!input || typeof input !== "object") return null;
  const quote = String((input as Record<string, unknown>).quote ?? "").trim();
  const name = String((input as Record<string, unknown>).name ?? "").trim();
  if (!quote || !name) return null;
  return { quote, name };
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body || !Array.isArray(body.items)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const items = body.items
    .map(sanitizeItem)
    .filter((i: Testimonial | null): i is Testimonial => i !== null);
  await saveTestimonials(items);
  revalidateTag("site-overrides", { expire: 0 });
  return NextResponse.json({ ok: true });
}
