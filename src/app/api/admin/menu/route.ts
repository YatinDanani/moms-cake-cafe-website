import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { isAuthenticated } from "@/lib/adminAuth";
import { saveMenu, type Menu, type MenuCategory, type MenuItem, type MenuSize } from "@/lib/siteOverrides";

function sanitizeSize(input: unknown): MenuSize | null {
  if (!input || typeof input !== "object") return null;
  const label = String((input as Record<string, unknown>).label ?? "").trim();
  const price = String((input as Record<string, unknown>).price ?? "").trim();
  if (!price) return null;
  return { label, price };
}

function sanitizeItem(input: unknown): MenuItem | null {
  if (!input || typeof input !== "object") return null;
  const name = String((input as Record<string, unknown>).name ?? "").trim();
  if (!name) return null;
  const description = String((input as Record<string, unknown>).description ?? "").trim();
  const photo = String((input as Record<string, unknown>).photo ?? "").trim();
  const sizesInput = (input as Record<string, unknown>).sizes;
  const sizes = Array.isArray(sizesInput)
    ? sizesInput.map(sanitizeSize).filter((s): s is MenuSize => s !== null)
    : [];
  if (sizes.length === 0) return null;
  const item: MenuItem = { name, sizes };
  if (description) item.description = description;
  if (photo) item.photo = photo;
  return item;
}

function sanitizeCategory(input: unknown): MenuCategory | null {
  if (!input || typeof input !== "object") return null;
  const category = String((input as Record<string, unknown>).category ?? "").trim();
  if (!category) return null;
  const note = String((input as Record<string, unknown>).note ?? "").trim();
  const itemsInput = (input as Record<string, unknown>).items;
  const items = Array.isArray(itemsInput)
    ? itemsInput.map(sanitizeItem).filter((i): i is MenuItem => i !== null)
    : [];
  return note ? { category, note, items } : { category, items };
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body || !Array.isArray(body.menu)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const menu: Menu = body.menu.map(sanitizeCategory).filter((c: MenuCategory | null): c is MenuCategory => c !== null);

  await saveMenu(menu);
  revalidateTag("site-overrides", { expire: 0 });
  return NextResponse.json({ ok: true });
}
