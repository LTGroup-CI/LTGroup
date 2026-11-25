import { useEffect, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Phone, Mail, MapPin, MessageCircle, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { LOGO_URL, LOGO_ALT, WHATSAPP_NUMBERS, DEVELOPER } from "@/lib/media";
import { companyQuery, partnersQuery } from "@/lib/site-data";
import { Button } from "@/components/ui/button";
import { AiAssistant } from "@/components/site/AiAssistant";
import { MediaPreview } from "@/components/site/MediaPreview";

const NAV = [
  { to: "/", label: "Accueil" },
  { to: "/services", label: "Expertises" },
  { to: "/projets", label: "Projets & Terrains" },
  { to: "/a-propos", label: "Le Groupe" },
  { to: "/contact", label: "Contact" },
];

const FOOTER_NAV = [
  ...NAV.slice(1),
  { to: "/actualites", label: "Actualités" },
  { to: "/temoignages", label: "Témoignages" },
  { to: "/faq", label: "FAQ" },
];

/** Hauteur réservée sous le menu fixe. */
export const HEADER_OFFSET = "pt-[76px] lg:pt-[92px]";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { data: company } = useQuery(companyQuery);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/70 bg-background/90 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 lg:px-8">
        <Link to="/" className="flex min-w-0 items-center gap-3" aria-label="LT GROUP — accueil">
          <img
            src={LOGO_URL}
            alt={LOGO_ALT}
            className="block h-11 w-auto max-w-[210px] shrink-0 bg-transparent object-contain lg:h-14 lg:max-w-[250px]"
            width={600}
            height={400}
          />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="whitespace-nowrap text-[0.9rem] font-semibold text-foreground/75 transition-colors hover:text-gold-deep"
              activeProps={{ className: "text-gold-deep" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Button asChild variant="gold" size="sm" className="hidden sm:inline-flex">
            <Link to="/services">Demander un devis</Link>
          </Button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-gold/50 text-gold-deep lg:hidden"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="max-h-[70vh] overflow-y-auto border-t border-border bg-background lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-5 py-3">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="border-b border-border py-3 text-base font-medium text-foreground/85"
                activeProps={{ className: "text-gold-deep" }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
              </Link>
            ))}
            <Button asChild variant="gold" className="my-4">
              <Link to="/services">Demander un devis</Link>
            </Button>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

export function PartnersStrip() {
  const { data: partners } = useQuery(partnersQuery);
  if (!partners || partners.length === 0) return null;

  return (
    <section className="border-t border-border bg-background py-14">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <p className="eyebrow text-center">Ils nous font confiance</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
          {partners.map((partner) => {
            const inner = partner.logo_url ? (
              <MediaPreview
                url={partner.logo_url}
                alt={partner.name}
                className="h-12 w-auto object-contain opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0"
              />
            ) : (
              <span className="font-display text-lg text-muted-foreground">{partner.name}</span>
            );
            return partner.website_url ? (
              <a key={partner.id} href={partner.website_url} target="_blank" rel="noreferrer noopener">
                {inner}
              </a>
            ) : (
              <div key={partner.id}>{inner}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function SiteFooter() {
  const { data: company } = useQuery(companyQuery);
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink-gradient text-ink-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 lg:grid-cols-4 lg:py-14 lg:px-8">
        <div className="lg:col-span-2">
          <div className="inline-flex rounded-md bg-card p-3">
            <img
              src={LOGO_URL}
              alt={LOGO_ALT}
              loading="lazy"
              className="block h-16 w-auto max-w-[230px] bg-transparent object-contain sm:h-20"
              width={600}
              height={400}
            />
          </div>
          <p className="mt-5 max-w-md text-justify text-sm leading-relaxed text-ink-foreground/70">
            LIGHT TERRA GROUP SARL accompagne particuliers, entreprises et institutions en Côte d'Ivoire à travers 10 services : des études à la sécurité électronique, en passant par le foncier, l'eau, l'énergie et le BTP.
          </p>
          <p className="mt-3 text-xs uppercase tracking-[0.2em] text-gold/80">Bâtir la terre, éclairer l'avenir</p>
        </div>

        <div>
          <h3 className="font-display text-lg text-gold">Navigation</h3>
          <ul className="mt-4 space-y-2 text-sm text-ink-foreground/70">
            {FOOTER_NAV.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="transition-colors hover:text-gold">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-lg text-gold">Contact</h3>
          <ul className="mt-4 space-y-3 text-sm text-ink-foreground/70">
            <li className="flex items-start gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <span><a href="tel:+2250749224722">(+225) 07 49 22 47 22</a> / <a href="tel:+2250707741484">07 07 74 14 84</a> / Fixe : <a href="tel:+2252722422627">27 22 42 26 27</a></span>
            </li>
            {WHATSAPP_NUMBERS.map((w) => (
              <li key={w.link} className="flex items-start gap-2">
                <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <a href={`https://wa.me/${w.link}`} target="_blank" rel="noreferrer noopener">
                  {w.label} : {w.display}
                </a>
              </li>
            ))}
            <li className="flex items-start gap-2">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <a href={`mailto:${company?.email || "contact@ltgroup-ci.com"}`}>{company?.email || "contact@ltgroup-ci.com"}</a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <span>
                Siège social : {[company?.city, company?.address].filter(Boolean).join(" ") || "Abidjan Cocody Akouédo extension sud-est, Lot 640, îlot 60"}{company?.postal_box ? ` ; ${company.postal_box}` : ""}
              </span>
            </li>
          </ul>
          <Link to="/contact" className="mt-5 inline-flex rounded-md bg-gold px-4 py-2 text-sm font-semibold text-ink">Nous écrire</Link>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-6 text-xs text-ink-foreground/60 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>© {year} LIGHT TERRA GROUP SARL — Tous droits réservés.</p>
          <nav aria-label="Liens légaux" className="flex flex-wrap gap-x-5 gap-y-2">
            <Link to="/mentions-legales" className="hover:text-gold">Mentions légales</Link>
            <Link to="/confidentialite" className="hover:text-gold">Politique de confidentialité</Link>
            <Link to="/contact" className="hover:text-gold">Contact</Link>
          </nav>
        </div>
        <div className="mx-auto max-w-7xl px-5 pb-6 text-xs text-ink-foreground/40 lg:px-8">
          Développé par <a href={DEVELOPER.site} target="_blank" rel="noreferrer noopener" className="text-gold/80 hover:underline">{DEVELOPER.name}</a> - <a href={DEVELOPER.whatsapp} target="_blank" rel="noreferrer noopener" className="text-gold/80 hover:underline">{DEVELOPER.phone}</a>
        </div>
      </div>
    </footer>
  );
}

export function SiteLayout({
  children,
  withPartners = true,
}: {
  children: ReactNode;
  withPartners?: boolean;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      {withPartners ? <PartnersStrip /> : null}
      <SiteFooter />
      <AiAssistant />
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  image?: string;
  imageAlt?: string;
}) {
  return (
    <section className="page-hero relative isolate overflow-hidden border-b border-gold/20 bg-ink-gradient pb-14 pt-28 text-ink-foreground sm:pb-16 lg:pb-20 lg:pt-40">
      {image ? <img src={image} alt={imageAlt ?? ""} aria-hidden={!imageAlt} className="absolute inset-0 h-full w-full object-cover opacity-65" /> : null}
      <div aria-hidden className="page-hero-glow pointer-events-none absolute inset-0" />
      <div aria-hidden className="pointer-events-none absolute -right-24 -top-28 h-[360px] w-[360px] rounded-full border border-gold/20 sm:h-[520px] sm:w-[520px] lg:-right-10 lg:h-[680px] lg:w-[680px]">
        <div className="absolute inset-8 rounded-full border border-gold/10" />
        <div className="absolute inset-20 rounded-full border border-gold/10" />
      </div>
      <svg aria-hidden className="pointer-events-none absolute -right-4 bottom-0 h-48 w-48 text-gold/20 sm:right-16 sm:h-64 sm:w-64 lg:right-[12%] lg:h-80 lg:w-80" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.45">
        <path d="M50 4 L96 92 H4 Z" />
        <path d="M50 25 L78 78 H22 Z" />
        <path d="M50 4 V96 M4 92 H96" />
        <circle cx="50" cy="60" r="12" />
        <circle cx="50" cy="60" r="3" fill="currentColor" />
      </svg>
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <div className="max-w-6xl animate-fade-up">
          <p className="eyebrow text-gold">{eyebrow}</p>
          <h1 className="mt-4 w-full text-pretty text-4xl leading-[1.08] text-white sm:text-5xl lg:text-7xl">{title}</h1>
          <div className="mt-7 flex items-center gap-4">
            <span className="h-px w-16 bg-gold" />
            <span className="h-1.5 w-1.5 rotate-45 bg-gold" />
            <span className="text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-white/45">LIGHT TERRA GROUP SARL</span>
          </div>
          {description ? (
            <p className="mt-6 max-w-4xl text-pretty text-base leading-8 text-white/70 sm:text-lg sm:leading-9">{description}</p>
          ) : null}
        </div>
      </div>
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent" />
    </section>
  );
}
