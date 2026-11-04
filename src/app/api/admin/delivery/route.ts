import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { isAuthenticated } from "@/lib/adminAuth";
import { saveDeliveryLinks } from "@/lib/siteOverrides";

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const doordash = String(body.doordash ?? "").trim();
  const ubereats = String(body.ubereats ?? "").trim();

  await saveDeliveryLinks({ doordash, ubereats });
  revalidateTag("site-overrides", { expire: 0 });
  return NextResponse.json({ ok: true });
}
