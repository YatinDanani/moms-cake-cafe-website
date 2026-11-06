import type { Metadata } from "next";
import Link from "next/link";
import { getMenu } from "@/lib/siteOverrides";
import { SignatureCakeOrderForm } from "@/components/SignatureCakeOrderForm";

export const metadata: Metadata = {
  title: "Order a Signature Cake | Mom's Cake Café",
  description: "Order one of our signature cakes for pickup, no custom design needed.",
};

// Reads searchParams to preselect a cake from the menu's "Order this cake"
// links — that's runtime data, so this page can't be statically prerendered.
export const instant = false;

export default async function OrderCakePage({
  searchParams,
}: {
  searchParams: Promise<{ cake?: string }>;
}) {
  const [menu, params] = await Promise.all([getMenu(), searchParams]);
  const cakes = menu.find((section) => section.category === "Signature Cakes")?.items ?? [];

  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-2xl px-5 sm:px-8 pt-16 pb-20">
        <div className="text-center">
          <h1 className="font-display text-4xl sm:text-5xl font-semibold">Order a Signature Cake</h1>
          <p className="mt-4 text-cocoa/75">
            Pick one of our regular menu cakes for pickup, exactly as it&apos;s made every day.
            Want something custom instead?{" "}
            <Link href="/custom-cakes" className="text-coffee font-semibold hover:text-coffee-dark">
              Start a custom order
            </Link>
            .
          </p>
        </div>
        <div className="mt-10">
          <SignatureCakeOrderForm cakes={cakes} initialCake={params.cake} />
        </div>
      </div>
    </section>
  );
}
