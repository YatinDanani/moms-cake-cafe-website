import { NextResponse } from "next/server";
import { getPhoto } from "@/lib/siteOverrides";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slot: string }> }
) {
  const { slot } = await params;
  const photo = await getPhoto(slot);

  if (!photo) {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(photo.data, {
    headers: {
      "Content-Type": photo.contentType,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
