import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import { Toaster } from "@/components/ui/sonner";
import appCss from "../styles.css?url";
import { reportRuntimeError } from "../lib/runtime-error-reporting";
import { LOGO_URL, SITE_URL, FAVICON_URL, getBrandDerivativeUrl } from "@/lib/media";
import { companyQuery } from "@/lib/site-data";

const SITE_NAME = "LT GROUP";
const SITE_TITLE = "LT GROUP Côte d’Ivoire | Light Terra Group | Foncier, BTP, Immobilier & Infrastructures";
const SITE_DESCRIPTION =
  "LT GROUP, Light Terra Group, groupe ivoirien basé à Abidjan : aménagement foncier, lotissement, BTP & VRD, construction immobilière, hydraulique, électrification, topographie, études et commercialisation de terrains.";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportRuntimeError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  loader: async ({ context }) => {
    try { return await context.queryClient.ensureQueryData(companyQuery); } catch { return null; }
  },
  head: ({ loaderData }) => {
    const configuredLogo = loaderData?.logo_png_url || loaderData?.logo_url || LOGO_URL;
    const configuredOg = getBrandDerivativeUrl(configuredLogo, "og");
    const configuredFavicon = getBrandDerivativeUrl(configuredLogo, "favicon");
    const configuredLogoAbsolute = configuredLogo.startsWith("http") ? configuredLogo : new URL(configuredLogo, SITE_URL).toString();
    const configuredOgAbsolute = configuredOg.startsWith("http") ? configuredOg : new URL(configuredOg, SITE_URL).toString();
    return ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: SITE_TITLE },
      { name: "description", content: SITE_DESCRIPTION },
      { name: "author", content: "LT GROUP — Light Terra Group" },
      { name: "application-name", content: SITE_NAME },
      { name: "keywords", content: "LT GROUP, LTGroup, LT Groupe, Light Terra Group, Light Terra Group Côte d’Ivoire, LT GROUP Côte d’Ivoire, entreprise ivoirienne, Abidjan, Cocody, Akouédo, foncier, aménagement foncier, lotissement, terrain, vente de terrain, commercialisation de terrains, BTP, VRD, construction immobilière, hydraulique, adduction d’eau potable, électrification, infrastructures, topographie, études, Côte d’Ivoire, CI" },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
      { name: "theme-color", content: "#000000" },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:locale", content: "fr_CI" },
      { property: "og:title", content: SITE_TITLE },
      { property: "og:description", content: SITE_DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "geo.region", content: "CI-AB" },
      { name: "geo.placename", content: "Abidjan, Côte d’Ivoire" },
      { property: "og:url", content: SITE_URL },
      { property: "og:image", content: configuredOgAbsolute },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Identité visuelle officielle LT GROUP" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: SITE_TITLE },
      { name: "twitter:description", content: SITE_DESCRIPTION },
      { name: "twitter:image", content: configuredOgAbsolute },
      { name: "twitter:image:alt", content: "Identité visuelle officielle LT GROUP" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" },
      { rel: "stylesheet", href: appCss },
      { rel: "canonical", href: SITE_URL },
      { rel: "icon", href: FAVICON_URL, type: "image/png" },
      { rel: "shortcut icon", href: FAVICON_URL, type: "image/png" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
    ],
    });
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  const company = Route.useLoaderData();
  const configuredLogo = company?.logo_png_url || company?.logo_url || LOGO_URL;
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    alternateName: ["LTGroup", "LT Groupe", "Light Terra Group", "LIGHT TERRA GROUP", "Light Terra Group Côte d’Ivoire", "LT GROUP Côte d’Ivoire", "LT GROUP CI"],
    url: SITE_URL,
    logo: configuredLogo,
    image: configuredLogo,
    description: SITE_DESCRIPTION,
    ...(company?.phone_primary ? { telephone: company.phone_primary } : {}),
    ...(company?.email ? { email: company.email } : {}),
    ...(company?.address || company?.city || company?.country ? {
      address: {
        "@type": "PostalAddress",
        ...(company.address ? { streetAddress: company.address } : {}),
        ...(company.city ? { addressLocality: company.city } : {}),
        ...(company.country ? { addressCountry: company.country } : {}),
      },
    } : {}),
  };

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: SITE_NAME,
    alternateName: ["LTGroup", "LT Groupe", "Light Terra Group", "LT GROUP CI"],
    url: SITE_URL,
    logo: configuredLogo,
    image: configuredLogo,
    description: SITE_DESCRIPTION,
    telephone: company?.phone_primary ?? undefined,
    email: company?.email ?? undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: company?.address ?? undefined,
      addressLocality: company?.city ?? "Abidjan",
      addressCountry: "CI",
    },
    areaServed: [{ "@type": "Country", name: "Côte d’Ivoire" }, { "@type": "City", name: "Abidjan" }],
    knowsAbout: ["Aménagement foncier", "Lotissement", "BTP", "VRD", "Construction immobilière", "Hydraulique", "Adduction d’eau potable", "Électrification", "Infrastructures", "Topographie", "Études", "Vente de terrains", "Commercialisation de terrains"],
    sameAs: [company?.facebook_url, company?.linkedin_url, company?.instagram_url].filter(Boolean),
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: "fr-CI",

  };

  return (
    <html lang="fr-CI">
      <head>
        <HeadContent />
        <script type="application/ld+json">{JSON.stringify(organizationJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(websiteJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(localBusinessJsonLd)}</script>
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster richColors position="top-center" />
    </QueryClientProvider>
  );
}
