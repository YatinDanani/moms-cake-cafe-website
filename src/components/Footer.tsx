import Image from "next/image";
import Link from "next/link";
import { business, navLinks } from "@/lib/content";
import { getDeliveryLinks } from "@/lib/siteOverrides";
import { InstagramIcon, FacebookIcon, TikTokIcon, PinIcon, PhoneIcon, MailIcon } from "./Icons";

export async function Footer() {
  const delivery = await getDeliveryLinks();
  return (
    <footer className="bg-cocoa text-cream">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="" width={56} height={56} className="h-14 w-14 rounded-full" />
            <p className="font-display text-xl">
              <span className="text-coffee">Mom&apos;s Cake</span> Café
            </p>
          </div>
          <p className="mt-3 text-sm text-cream/70 max-w-xs">
            {business.tagline}. Custom cakes, coffee, and homemade meals on Oak Bay Ave.
          </p>
          <div className="mt-5 flex items-center gap-4">
            <a href={business.social.instagram} aria-label="Instagram" className="text-cream/70 hover:text-caramel">
              <InstagramIcon className="h-5 w-5" />
            </a>
            <a href={business.social.facebook} aria-label="Facebook" className="text-cream/70 hover:text-caramel">
              <FacebookIcon className="h-5 w-5" />
            </a>
            <a href={business.social.tiktok} aria-label="TikTok" className="text-cream/70 hover:text-caramel">
              <TikTokIcon className="h-5 w-5" />
            </a>
          </div>
          {(delivery.doordash || delivery.ubereats) && (
            <div className="mt-5 flex flex-wrap items-center gap-2.5">
              {delivery.doordash && (
                <a
                  href={delivery.doordash}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-full border border-cream/20 px-3.5 py-1.5 text-xs font-semibold text-cream/85 hover:border-caramel hover:text-caramel transition-colors"
                >
                  Order on DoorDash
                </a>
              )}
              {delivery.ubereats && (
                <a
                  href={delivery.ubereats}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-full border border-cream/20 px-3.5 py-1.5 text-xs font-semibold text-cream/85 hover:border-caramel hover:text-caramel transition-colors"
                >
                  Order on Uber Eats
                </a>
              )}
            </div>
          )}
        </div>

        <div>
          <p className="text-sm font-semibold text-cream/50 mb-4">Explore</p>
          <ul className="space-y-2.5 text-sm">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-cream/85 hover:text-caramel">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-cream/50 mb-4">Visit</p>
          <ul className="space-y-3 text-sm text-cream/85">
            <li className="flex gap-2.5">
              <PinIcon className="h-5 w-5 shrink-0 text-caramel" />
              <span>
                {business.addressLine1}
                <br />
                {business.addressLine2}
              </span>
            </li>
            <li className="flex gap-2.5">
              <PhoneIcon className="h-5 w-5 shrink-0 text-caramel" />
              <a href={business.phoneHref}>{business.phone}</a>
            </li>
            <li className="flex gap-2.5">
              <MailIcon className="h-5 w-5 shrink-0 text-caramel" />
              <a href={`mailto:${business.email}`}>{business.email}</a>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-cream/50 mb-4">Hours</p>
          <ul className="space-y-2.5 text-sm text-cream/85">
            {business.hours.map((h) => (
              <li key={h.days} className="flex justify-between gap-4">
                <span>{h.days}</span>
                <span className="text-cream/60">{h.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10 px-5 sm:px-8 py-5 text-xs text-cream/50 text-center">
        © 2026 Mom&apos;s Cake Café. All cakes made in Victoria, BC.
      </div>
    </footer>
  );
}
