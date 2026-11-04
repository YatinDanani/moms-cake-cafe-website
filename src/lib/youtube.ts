export function getYouTubeEmbedUrl(rawUrl: string): string | null {
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;
  try {
    const u = new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`);
    const host = u.hostname.replace(/^www\.|^m\.|^music\./, "");
    let id = "";
    if (host === "youtu.be") {
      id = u.pathname.slice(1);
    } else if (host === "youtube.com") {
      if (u.pathname === "/watch") {
        id = u.searchParams.get("v") ?? "";
      } else if (u.pathname.startsWith("/embed/")) {
        id = u.pathname.split("/embed/")[1] ?? "";
      } else if (u.pathname.startsWith("/shorts/")) {
        id = u.pathname.split("/shorts/")[1] ?? "";
      } else if (u.pathname.startsWith("/live/")) {
        id = u.pathname.split("/live/")[1] ?? "";
      }
    }
    id = id.split("&")[0].split("?")[0].split("/")[0];
    return id ? `https://www.youtube.com/embed/${id}` : null;
  } catch {
    return null;
  }
}
