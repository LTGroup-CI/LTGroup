// Médias de marque servis directement avec le site.
export const SITE_URL = "https://ltgroup-ci.com";
export const LOGO_URL = "/media/logo-light-terra-transparent.png";
export const FAVICON_URL = "/media/favicon-light-terra.png";
export const OG_IMAGE_URL = `${SITE_URL}/media/og-light-terra.png`;

export function getBrandDerivativeUrl(
  logoUrl: string | null | undefined,
  derivative: "favicon" | "og" | "jpg" | "png",
) {
  const fallback = derivative === "favicon" ? FAVICON_URL : derivative === "og" ? OG_IMAGE_URL : LOGO_URL;
  if (!logoUrl) return fallback;
  const marker = "/storage/v1/object/public/site-media/brand/logo.png";
  if (!logoUrl.includes(marker)) return derivative === "png" ? logoUrl : fallback;
  const base = logoUrl.split("?")[0] ?? logoUrl;
  const path = derivative === "png" ? "logo.png" : derivative === "jpg" ? "logo.jpg" : derivative === "favicon" ? "favicon.png" : "og.png";
  const query = logoUrl.includes("?") ? "?" + logoUrl.split("?").slice(1).join("?") : "";
  return base.replace("/brand/logo.png", "/brand/" + path) + query;
}
export const LOGO_ALT = "Logo officiel LIGHT TERRA GROUP — Bâtir la terre, éclairer l'avenir";
export const ASSISTANT_AVATAR_URL = "/media/assistant-avatar.jpg";

export const WHATSAPP_NUMBERS = [
  { label: "WhatsApp 1", display: "+225 07 49 22 47 22", link: "2250749224722" },
  { label: "WhatsApp 2", display: "+225 07 07 74 14 84", link: "2250707741484" },
];

export const DEVELOPER = {
  name: "Inocent KOFFI",
  site: "https://ikoffi.agricapital.ci",
  phone: "+2250759566087",
  whatsapp: "https://wa.me/2250759566087",
};
