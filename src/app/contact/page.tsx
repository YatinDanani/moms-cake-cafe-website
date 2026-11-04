import type { Metadata } from "next";
import { business } from "@/lib/content";
import { ContactForm } from "@/components/ContactForm";
import { PinIcon, PhoneIcon, MailIcon, ClockIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Visit & Contact | Mom's Cake Café",
  description: "Address, hours, and contact details for Mom's Cake Café on Oak Bay Ave, Victoria.",
};

export default function ContactPage() {
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-5xl px-5 sm:px-8 pt-16 pb-20">
        <h1 className="font-display text-4xl sm:text-5xl font-semibold">Visit & contact</h1>
        <p className="mt-4 text-cocoa/75 max-w-lg">
          Stop by for a slice and a coffee, or send a message if you&apos;d rather
          start with email.
        </p>

        <div className="mt-12 grid lg:grid-cols-2 gap-12">
          <div>
            <ul className="space-y-5">
              <li className="flex gap-3">
                <PinIcon className="h-6 w-6 shrink-0 text-coffee" />
                <div>
                  <p className="font-semibold">Address</p>
                  <p className="text-cocoa/75">
                    {business.addressLine1}, {business.addressLine2}
                  </p>
                  <a
                    href={business.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cocoa/75 hover:text-coffee"
                  >
                    Open in Google Maps
                  </a>
                </div>
              </li>
              <li className="flex gap-3">
                <PhoneIcon className="h-6 w-6 shrink-0 text-coffee" />
                <div>
                  <p className="font-semibold">Phone</p>
                  <a href={business.phoneHref} className="text-cocoa/75 hover:text-coffee">
                    {business.phone}
                  </a>
                </div>
              </li>
              <li className="flex gap-3">
                <MailIcon className="h-6 w-6 shrink-0 text-coffee" />
                <div>
                  <p className="font-semibold">Email</p>
                  <a href={`mailto:${business.email}`} className="text-cocoa/75 hover:text-coffee">
                    {business.email}
                  </a>
                </div>
              </li>
              <li className="flex gap-3">
                <ClockIcon className="h-6 w-6 shrink-0 text-coffee" />
                <div>
                  <p className="font-semibold">Hours</p>
                  {business.hours.map((h) => (
                    <p key={h.days} className="text-cocoa/75">
                      {h.days}: {h.time}
                    </p>
                  ))}
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-tan rounded-3xl p-7 sm:p-8">
            <h2 className="font-display text-xl font-semibold mb-5">Send a message</h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
