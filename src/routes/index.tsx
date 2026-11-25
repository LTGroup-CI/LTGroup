import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ShieldCheck, Users, HardHat, Handshake } from "lucide-react";
import { ServicesGrid, ServicesCta } from "@/components/site/ServicesGrid";
import heroTerrain from "@/assets/hero-terrain.jpg";
import heroFoncier from "@/assets/hero-foncier.jpg";
import heroBtp from "@/assets/hero-btp.jpg";
import heroImmobilier from "@/assets/hero-immobilier.jpg";
import heroInfra from "@/assets/hero-infra.jpg";
import heroEnergie from "@/assets/hero-energie.jpg";
import heroConseil from "@/assets/hero-conseil.jpg";

import { PartnersStrip, SiteFooter, SiteHeader } from "@/components/site/SiteLayout";
import { AiAssistant } from "@/components/site/AiAssistant";
import { NewsletterSignup } from "@/components/site/NewsletterSignup";
import { Button } from "@/components/ui/button";
import { SITE_URL, OG_IMAGE_URL } from "@/lib/media";
import {
  companyQuery,
  heroSlidesQuery,
} from "@/lib/site-data";

const title = "LT GROUP — Bâtir la terre, éclairer l'avenir";
const description =
  "LT GROUP : aménagement foncier, BTP & VRD, construction immobilière, hydraulique, électrification, topographie & études, avec une offre complémentaire de vente et commercialisation de terrains.";

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    try { return await context.queryClient.ensureQueryData(companyQuery); } catch { return null; }
  },
  head: ({ loaderData }) => {
    const ogImage = OG_IMAGE_URL;
    return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL },
      { property: "og:image", content: ogImage },
      { property: "og:image:alt", content: "Logo officiel LT GROUP" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: ogImage },
    ],
    links: [{ rel: "canonical", href: SITE_URL }],
    };
  },
  component: Index,
});

const FALLBACK_HERO_SLIDES = [
  { id: "fallback-terrain", image_url: heroTerrain, title: "Vente de terrains", subtitle: null, cta_label: null, cta_url: null, duration_ms: 6000, position: 0, is_active: true },
  { id: "fallback-foncier", image_url: heroFoncier, title: "Aménagement foncier & lotissement", subtitle: null, cta_label: null, cta_url: null, duration_ms: 6000, position: 1, is_active: true },
  { id: "fallback-btp", image_url: heroBtp, title: "BTP & VRD", subtitle: null, cta_label: null, cta_url: null, duration_ms: 6000, position: 2, is_active: true },
  { id: "fallback-immobilier", image_url: heroImmobilier, title: "Construction immobilière", subtitle: null, cta_label: null, cta_url: null, duration_ms: 6000, position: 3, is_active: true },
  { id: "fallback-infra", image_url: heroInfra, title: "Hydraulique & infrastructures", subtitle: null, cta_label: null, cta_url: null, duration_ms: 6000, position: 4, is_active: true },
  { id: "fallback-energie", image_url: heroEnergie, title: "Électrification", subtitle: null, cta_label: null, cta_url: null, duration_ms: 6000, position: 5, is_active: true },
  { id: "fallback-conseil", image_url: heroConseil, title: "Topographie & études", subtitle: null, cta_label: null, cta_url: null, duration_ms: 6000, position: 6, is_active: true },
];

function Hero() {
  const { data: company } = useQuery(companyQuery);
  const { data: configuredSlides } = useQuery(heroSlidesQuery);
  const slides = configuredSlides?.length ? configuredSlides : FALLBACK_HERO_SLIDES;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!slides.length) return;
    const current = slides[index % slides.length];
    const timer = window.setTimeout(
      () => setIndex((i) => (i + 1) % slides.length),
      Math.max(3500, current?.duration_ms ?? 6000),
    );
    return () => window.clearTimeout(timer);
  }, [index, slides]);

  const current = slides[index % slides.length]!;

  return (
    <section className="relative isolate overflow-hidden border-b border-gold/20 bg-ink">
      <div className="absolute inset-0">
        <img
          src={current.image_url}
          alt=""
          aria-hidden
          className="h-full w-full object-cover opacity-100 animate-slow-zoom"
        />
        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-black/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/20" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_35%,rgba(212,175,55,0.12),transparent_38%)]" />
      </div>

      <div className="relative mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12 xl:px-16">
        <div className="mx-auto flex min-h-[68vh] max-w-5xl items-center py-24 sm:py-28 lg:min-h-[72vh] lg:py-32">
          <div className="w-full max-w-4xl">
              <p className="eyebrow text-gold">LT GROUP · Côte d’Ivoire</p>
              <h1 className="mt-4 max-w-[12ch] text-balance text-4xl leading-[1.02] text-white sm:text-5xl lg:text-6xl xl:text-[4.5rem]">
                Bâtir la terre, <span className="text-gold-gradient">éclairer l’avenir</span>
              </h1>
              <p className="mt-7 max-w-2xl text-pretty text-base leading-7 text-white/75 sm:text-lg sm:leading-8">
                {company?.description ?? "LT GROUP accompagne particuliers, entreprises et institutions en Côte d’Ivoire : études, aménagement foncier, promotion immobilière, hydraulique, électrification, BTP, VRD, réseau télécom, gestion immobilière et divers."}
              </p>
              {current.subtitle ? (
                <p className="mt-5 max-w-xl text-sm leading-7 text-white/65 sm:text-base">
                  {current.subtitle}
                </p>
              ) : null}
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild variant="gold" size="lg">
                  <Link to="/services">Demander un devis</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/40 bg-transparent text-white hover:bg-white hover:text-foreground">
                  <Link to="/projets">Voir nos réalisations</Link>
                </Button>
              </div>

              <div className="mt-8">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                  {current.title ?? "LT GROUP"}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {slides.map((slide, i) => (
                    <button
                      key={slide.id}
                      type="button"
                      aria-label={"Afficher : " + (slide.title ?? "Visuel " + (i + 1))}
                      onClick={() => setIndex(i)}
                      className={
                        i === index % slides.length
                          ? "h-1.5 w-12 rounded-full bg-gold"
                          : "h-1.5 w-5 rounded-full bg-white/35 transition hover:bg-white/70"
                      }
                    />
                  ))}
                </div>
              </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function KeyFigures() {
  const items = [
    { value: "10", label: "pôles d'expertise" },
    { value: "100 %", label: "documents fonciers vérifiés" },
    { value: "Étude → livraison", label: "un seul interlocuteur" },
    { value: "Abidjan", label: "et tout le territoire ivoirien" },
  ];
  return (
    <section className="relative z-20 mx-auto -mt-8 max-w-[1480px] px-5 sm:px-8 lg:px-12 xl:px-16">
      <div className="grid gap-px overflow-hidden rounded-2xl border border-border/80 bg-border shadow-elevated sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it) => (
          <div key={it.label} className="group bg-card p-6 transition-colors duration-300 hover:bg-accent/40 lg:p-8">
            <p className="font-display text-2xl text-gold-deep transition-transform duration-300 group-hover:-translate-y-0.5 lg:text-3xl">{it.value}</p>
            <p className="mt-2 text-sm text-muted-foreground">{it.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Activities() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:py-20 lg:px-8 lg:py-24">
      <div className="max-w-5xl">
        <p className="eyebrow">Nos domaines d’expertise</p>
        <h2 className="mt-3 text-[clamp(1.45rem,3.4vw,2.65rem)] leading-tight tracking-tight sm:whitespace-nowrap">
          Des compétences au service de vos projets
        </h2>
        <p className="mt-4 max-w-4xl text-sm leading-7 text-muted-foreground sm:text-base">
          De l’étude à la réalisation, nos équipes mobilisent des savoir-faire complémentaires dans les domaines foncier, immobilier et des infrastructures.
        </p>
        <hr className="gold-rule mt-5 w-24" />
      </div>
      <div className="mt-8 border-t border-border/80 sm:mt-10">
        <ServicesGrid compact />
      </div>
      <ServicesCta />
    </section>
  );
}

const WHY = [
  { icon: ShieldCheck, title: "Sécurité foncière", text: "Terrains vérifiés, documents contrôlés et accompagnement jusqu'au titre foncier." },
  { icon: Users, title: "Équipe pluridisciplinaire", text: "Topographes, ingénieurs, juristes et bâtisseurs réunis autour de votre projet." },
  { icon: HardHat, title: "Maîtrise des chantiers", text: "Études, VRD, construction et réseaux réalisés dans le respect des normes." },
  { icon: Handshake, title: "Suivi transparent", text: "Un interlocuteur unique, des comptes rendus réguliers et des délais tenus." },
];

function WhyUs() {
  return (
    <section className="bg-secondary py-12 lg:py-16">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[1fr_1.3fr] lg:px-8">
        <div>
          <p className="eyebrow">Nos engagements</p>
          <h2 className="mt-3 text-3xl lg:text-4xl">Un accompagnement sérieux, de A à Z</h2>
          <hr className="gold-rule mt-5 w-24" />
          <p className="mt-5 text-justify leading-relaxed text-muted-foreground">LIGHT TERRA GROUP SARL accompagne particuliers, entreprises et institutions dans leurs projets fonciers, immobiliers et d'infrastructures en Côte d'Ivoire, avec rigueur, transparence et proximité.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {WHY.map(({ icon: Icon, title, text }) => (
            <div key={title} className="group rounded-xl border border-border/80 bg-card p-6 shadow-soft transition duration-500 hover:-translate-y-1 hover:border-gold/40 hover:shadow-elevated">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-gold-deep transition duration-300 group-hover:bg-gold group-hover:text-ink"><Icon className="h-5 w-5" /></span>
              <h3 className="mt-4 text-lg">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CallToAction() {
  const { data: company } = useQuery(companyQuery);
  return (
    <section className="bg-ink-gradient py-12 text-ink-foreground lg:py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-start gap-8 px-5 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <h2 className="text-3xl lg:text-4xl">Un projet foncier, immobilier ou électrique ?</h2>
          <p className="mt-4 max-w-xl text-ink-foreground/70">Nos équipes vous accompagnent de l'étude à la livraison. Décrivez votre besoin, nous revenons vers vous rapidement.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="gold" size="lg"><Link to="/services">Demander un devis</Link></Button>
          <Button asChild size="lg" variant="outline" className="border-gold/50 bg-transparent text-ink-foreground hover:bg-gold hover:text-ink">
            <a href="tel:+2250707741484">07 07 74 14 84</a>
          </Button>
        </div>
      </div>
    </section>
  );
}

function Index() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <KeyFigures />
        <Activities />
        <WhyUs />
        <NewsletterSignup />
        <CallToAction />
      </main>
      <PartnersStrip />
      <SiteFooter />
      <AiAssistant />
    </div>
  );
}
