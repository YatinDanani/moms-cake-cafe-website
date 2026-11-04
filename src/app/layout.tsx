import type { Metadata } from "next";
import { Playfair_Display, Pinyon_Script, Figtree } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getLocalBusinessSchema } from "@/lib/structuredData";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  style: ["normal", "italic"],
});

const pinyon = Pinyon_Script({
  variable: "--font-pinyon",
  subsets: ["latin"],
  weight: "400",
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const title = "Mom's Cake Café";
const description =
  "Custom cakes, cupcakes, sansrival, coffee, and homemade meals from Mom's Cake Café on Oak Bay Ave, Victoria.";

export const metadata: Metadata = {
  metadataBase: new URL("https://momscakecafe.ca"),
  title,
  description,
  openGraph: {
    title,
    description,
    url: "/",
    siteName: title,
    images: [{ url: "/hero.jpg", width: 1200, height: 630 }],
    locale: "en_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/hero.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const localBusinessSchema = getLocalBusinessSchema();

  return (
    <html
      lang="en"
      className={`${playfair.variable} ${pinyon.variable} ${figtree.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-cocoa">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
