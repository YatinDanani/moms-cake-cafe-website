import type { MetadataRoute } from "next";

const BASE_URL = "https://momscakecafe.ca";

const routes = [
  "",
  "/menu",
  "/custom-cakes",
  "/order-cake",
  "/catering",
  "/gallery",
  "/about",
  "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}
