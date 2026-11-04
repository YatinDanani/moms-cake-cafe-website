import { business } from "./content";

const SITE_URL = "https://momscakecafe.ca";

// Expands the day-range phrasing used in business.hours into the individual
// weekdays schema.org expects. If content.ts ever adds a new range phrasing,
// extend this map too.
const DAY_RANGES: Record<string, string[]> = {
  "Monday – Saturday": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  "Sunday & holidays": ["Sunday"],
};

function to24Hour(time: string): string {
  const match = time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return time.trim();
  const [, hour, minute, period] = match;
  let h = parseInt(hour, 10);
  if (period.toUpperCase() === "PM" && h !== 12) h += 12;
  if (period.toUpperCase() === "AM" && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}:${minute}`;
}

export function getLocalBusinessSchema() {
  const [addressLocality, regionAndPostal] = business.addressLine2.split(",").map((s) => s.trim());
  const [addressRegion, ...postalParts] = (regionAndPostal ?? "").split(" ");
  const postalCode = postalParts.join(" ");

  const openingHoursSpecification = business.hours.flatMap(({ days, time }) => {
    const dayOfWeek = DAY_RANGES[days];
    if (!dayOfWeek) return [];
    const [opens, closes] = time.split("–").map((t) => to24Hour(t));
    return [{ "@type": "OpeningHoursSpecification", dayOfWeek, opens, closes }];
  });

  return {
    "@context": "https://schema.org",
    "@type": ["Bakery", "CafeOrCoffeeShop"],
    name: business.name,
    image: `${SITE_URL}/hero.jpg`,
    url: SITE_URL,
    telephone: business.phoneHref.replace("tel:", ""),
    email: business.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: business.addressLine1,
      addressLocality,
      addressRegion,
      postalCode,
      addressCountry: "CA",
    },
    openingHoursSpecification,
    // Only confirmed real profile links go here — Instagram and TikTok are
    // still placeholders in content.ts, so they're left out for now.
    sameAs: [business.social.facebook],
  };
}
