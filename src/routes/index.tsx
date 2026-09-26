import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { activityIcon } from "@/lib/activity-icons";
import { OfficeMap } from "@/components/site/OfficeMap";
import heroTerrain from "@/assets/hero-terrain.jpg";
import heroFoncier from "@/assets/hero-foncier.jpg";
import heroBtp from "@/assets/hero-btp.jpg";
import heroImmobilier from "@/assets/hero-immobilier.jpg";
import heroInfra from "@/assets/hero-infra.jpg";
import heroEnergie from "@/assets/hero-energie.jpg";
import heroConseil from "@/assets/hero-conseil.jpg";

import { PartnersStrip, SiteFooter, SiteHeader } from "@/components/site/SiteLayout";
import { AiAssistant } from "@/components/site/AiAssistant";
import { MediaGallery } from "@/components/site/MediaGallery";
import { MediaPreview } from "@/components/site/MediaPreview";
import { NewsletterSignup } from "@/components/site/NewsletterSignup";
import { Button } from "@/components/ui/button";
import { SITE_URL, getBrandDerivativeUrl } from "@/lib/media";
import {
  activitiesQuery,
  companyQuery,
  formatDateFr,
  introVideosQuery,
  showcaseVideosQuery,
  newsListQuery,
  projectsQuery,
} from "@/lib/site-data";

const title = "LT GROUP — Bâtir la terre, éclairer l'avenir";
const description =
  "LT GROUP : aménagement foncier, BTP & VRD, construction immobilière, hydraulique, électrification, topographie & études, avec une offre complémentaire de vente et commercialisation de terrains.";

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    try { return await context.queryClient.ensureQueryData(companyQuery); } catch { return null; }
  },
  head: ({ loaderData }) => {
    const logo = loaderData?.logo_png_url || loaderData?.logo_url || null;
    const ogImage = getBrandDerivativeUrl(logo, "og");
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

/** Lecture en boucle continue des séquences vidéo, sans coupure visible. */
function IntroVideoLoop() {
  const { data: videos } = useQuery(introVideosQuery);
  const list = useMemo(() => videos ?? [], [videos]);
  const [active, setActive] = useState(0);
  const [front, setFront] = useState(0);
  const frontRef = useRef<HTMLVideoElement>(null);
  const backRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!list.length) return;
    const current = frontRef.current;
    const firstUrl = list[0]?.video_url;
    if (!current || !firstUrl) return;
    current.src = firstUrl;
    current.load();
    void current.play().catch(() => undefined);
  }, [list]);

  useEffect(() => {
    if (list.length < 2) return;
    const hidden = front === 0 ? backRef.current : frontRef.current;
    const nextIndex = (active + 1) % list.length;
    const nextUrl = list[nextIndex]?.video_url;
    if (!hidden || !nextUrl) return;
    hidden.src = nextUrl;
    hidden.load();
  }, [active, front, list]);

  if (!list.length) {
    return (
      <div className="relative aspect-video overflow-hidden rounded-lg border border-gold/25 bg-ink shadow-elevated">
        <div className="flex h-full items-center justify-center p-6 text-center">
          <div>
            <p className="eyebrow text-gold">LT GROUP</p>
            <p className="mt-3 font-display text-xl text-white sm:text-2xl">Notre savoir-faire en mouvement</p>
          </div>
        </div>
      </div>
    );
  }

  const handleEnded = () => {
    if (list.length < 2) {
      const current = front === 0 ? frontRef.current : backRef.current;
      if (current) { current.currentTime = 0; void current.play().catch(() => undefined); }
      return;
    }
    const hidden = front === 0 ? backRef.current : frontRef.current;
    if (!hidden) return;
    void hidden.play().catch(() => undefined);
    setFront((slot) => 1 - slot);
    setActive((index) => (index + 1) % list.length);
  };

  return (
    <div className="relative aspect-video overflow-hidden rounded-lg border border-gold/25 bg-black shadow-elevated">
      {[0, 1].map((slot) => (
        <video
          key={slot}
          ref={slot === 0 ? frontRef : backRef}
          className={"absolute inset-0 h-full w-full object-cover transition-opacity duration-500 " + (slot === front ? "opacity-100" : "opacity-0")}
          muted
          playsInline
          preload={slot === front ? "auto" : "metadata"}
          onEnded={slot === front ? handleEnded : undefined}
          aria-hidden={slot !== front}
        />
      ))}
    </div>
  );
}
const HERO_SLIDES = [
  { src: heroTerrain, label: "Vente de terrains" },
  { src: heroFoncier, label: "Aménagement foncier & lotissement" },
  { src: heroBtp, label: "BTP & VRD" },
  { src: heroImmobilier, label: "Construction immobilière" },
  { src: heroInfra, label: "Hydraulique & infrastructures" },
  { src: heroEnergie, label: "Électrification" },
  { src: heroConseil, label: "Topographie & études" },
];

function Hero() {
  const { data: company } = useQuery(companyQuery);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % HERO_SLIDES.length), 6000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="relative isolate flex min-h-[88vh] w-full items-end overflow-hidden bg-ink">
      {HERO_SLIDES.map((slide, i) => (
        <img
          key={slide.src}
          src={slide.src}
          alt={slide.label}
          width={1920}
          height={1088}
          loading={i === 0 ? "eager" : "lazy"}
          className={
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-[1500ms] " +
            (i === index ? "opacity-100 animate-slow-zoom" : "opacity-0")
          }
          aria-hidden={i !== index}
        />
      ))}
      <div className="absolute inset-0 bg-hero-veil" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-16 pt-36 lg:px-8 lg:pb-24">
        <p className="inline-flex items-center gap-3 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          {HERO_SLIDES[index]!.label}
        </p>
        <h1 className="mt-6 max-w-4xl text-4xl leading-[1.08] text-white sm:text-5xl lg:text-7xl">
          Bâtir la terre, <span className="text-gold-gradient">éclairer l'avenir</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85">
          {company?.description ??
            "LT GROUP accompagne particuliers, entreprises et institutions en Côte d'Ivoire : vente de terrains, aménagement foncier, BTP, immobilier, hydraulique et électrification."}
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Button asChild variant="gold" size="lg"><Link to="/services">Demander un devis</Link></Button>
          <Button asChild size="lg" variant="outline" className="border-white/60 bg-white/10 text-white backdrop-blur hover:bg-white hover:text-foreground">
            <Link to="/projets">Voir nos réalisations</Link>
          </Button>
        </div>
        <div className="mt-12 flex gap-2">
          {HERO_SLIDES.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              aria-label={`Afficher : ${slide.label}`}
              onClick={() => setIndex(i)}
              className={i === index ? "h-1 w-12 rounded-full bg-gold" : "h-1 w-6 rounded-full bg-white/40 transition hover:bg-white/70"}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function KeyFigures() {
  const items = [
    { value: "7", label: "pôles d'expertise" },
    { value: "100 %", label: "documents fonciers vérifiés" },
    { value: "Étude → livraison", label: "un seul interlocuteur" },
    { value: "Abidjan", label: "et tout le territoire ivoirien" },
  ];
  return (
    <section className="relative z-20 mx-auto -mt-12 max-w-7xl px-5 lg:px-8">
      <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border shadow-elevated sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it) => (
          <div key={it.label} className="bg-card p-6 lg:p-8">
            <p className="font-display text-2xl text-gold-deep lg:text-3xl">{it.value}</p>
            <p className="mt-2 text-sm text-muted-foreground">{it.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function IntroSection() {
  return (
    <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
      <div>
        <p className="eyebrow">Qui sommes-nous</p>
        <h2 className="mt-3 text-3xl lg:text-4xl">Un partenaire solide pour vos projets fonciers et immobiliers</h2>
        <hr className="gold-rule mt-6 w-24" />
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
          De la recherche du terrain à la remise des clés, LT GROUP réunit topographes, ingénieurs et
          bâtisseurs pour sécuriser chaque étape de votre investissement.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild variant="gold"><Link to="/a-propos">Découvrir le groupe</Link></Button>
          <Button asChild variant="outline"><Link to="/contact">Nous rencontrer</Link></Button>
        </div>
      </div>
      <IntroVideoLoop />
    </section>
  );
}

function Visuals() {
  return (
    <section className="bg-secondary py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <p className="eyebrow">Opportunités du moment</p>
        <h2 className="mt-3 text-3xl lg:text-4xl">Nos terrains disponibles</h2>
        <hr className="gold-rule mt-6 w-24" />
        <div className="mt-10"><MediaGallery /></div>
      </div>
    </section>
  );
}

function HomeMap() {
  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-5 py-20 lg:grid-cols-[1fr_1.4fr] lg:px-8 lg:py-24">
      <div>
        <p className="eyebrow">Nous trouver</p>
        <h2 className="mt-3 text-3xl lg:text-4xl">Notre siège à Abidjan</h2>
        <hr className="gold-rule mt-6 w-24" />
        <p className="mt-6 leading-relaxed text-muted-foreground">
          Cocody Akouédo extension sud-est, Lot 637, îlot 60 ; 01 BP 2259 Abidjan 01.
        </p>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          (+225) 07 49 22 47 22 / 07 07 74 14 84<br />contact@ltgroup-ci.com
        </p>
        <Button asChild variant="gold" className="mt-8"><Link to="/contact">Prendre rendez-vous</Link></Button>
      </div>
      <OfficeMap className="h-80 lg:h-96" />
    </section>
  );
}

function VideoShowcase() {
  const { data: videos } = useQuery(showcaseVideosQuery);
  const videoList = videos ?? [];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (videoList.length < 2) return;
    const timer = window.setInterval(
      () => setIndex((i) => (i + 1) % videoList.length),
      8500,
    );
    return () => window.clearInterval(timer);
  }, [videoList.length]);

  if (!videoList.length) return null;

  const safeIndex = index % videoList.length;
  const current = videoList[safeIndex]!;

  return (
    <section className="bg-muted/40 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="max-w-3xl">
          <p className="eyebrow">Projets en images</p>
          <h2 className="mt-3 text-3xl lg:text-4xl">
            Découvrez nos opportunités et réalisations
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Présentations immersives, vues aériennes et contenus vidéo publiés depuis l’administration.
          </p>
        </div>

        <div className="relative mt-10 overflow-hidden rounded-2xl border border-border bg-ink shadow-elevated">
          <div className="relative aspect-video sm:aspect-[16/8]">
            <video
              key={current.id}
              src={current.video_url}
              className="absolute inset-0 h-full w-full object-cover"
              muted
              playsInline
              autoPlay
              loop
              controls
              preload="auto"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 p-5 pointer-events-none sm:p-8 lg:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                {current.label}
              </p>
              <h3 className="mt-2 max-w-2xl text-2xl text-white sm:text-3xl lg:text-4xl">
                {current.title || current.label}
              </h3>
              {current.description ? (
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
                  {current.description}
                </p>
              ) : null}
            </div>
          </div>

          {videoList.length > 1 ? (
            <div className="absolute bottom-4 right-5 flex gap-2">
              {videoList.map((video, i) => (
                <button
                  key={video.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Afficher la vidéo ${i + 1}`}
                  className={
                    i === safeIndex
                      ? "h-1.5 w-10 rounded-full bg-gold"
                      : "h-1.5 w-4 rounded-full bg-white/45 hover:bg-white/75"
                  }
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function Activities() {
  const { data: activities } = useQuery(activitiesQuery);
  if (!activities || activities.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
      <p className="eyebrow">Nos pôles d'activité</p>
      <h2 className="mt-3 text-3xl lg:text-4xl">Un groupe, plusieurs expertises</h2>
      <hr className="gold-rule mt-6 w-24" />
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {activities.map((activity) => {
          const Icon = activityIcon(activity.icon);
          return (
            <Link key={activity.id} to="/activites/$slug" params={{ slug: activity.slug }} className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-gold/60 hover:shadow-elevated">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-accent text-gold-deep transition group-hover:bg-gold group-hover:text-ink"><Icon className="h-7 w-7" /></span>
              <h3 className="mt-5 text-xl">{activity.title}</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">{activity.short_description}</p>
              <span className="mt-6 inline-flex items-center text-sm font-semibold text-gold-deep">En savoir plus <ArrowRight className="ml-1 h-4 w-4 transition group-hover:translate-x-1" /></span>
            </Link>
          );
        })}
      </div>
      <div className="mt-10"><Button asChild variant="outline"><Link to="/activites">Découvrir nos activités <ArrowRight className="ml-2 h-4 w-4" /></Link></Button></div>
    </section>
  );
}

function FeaturedProjects() {
  const { data: projects } = useQuery(projectsQuery);
  const list = (projects ?? []).slice(0, 3);
  if (list.length === 0) return null;

  return (
    <section className="bg-muted/50 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <p className="eyebrow">Réalisations</p>
        <h2 className="mt-3 text-3xl lg:text-4xl">Des projets qui transforment le territoire</h2>
        <hr className="gold-rule mt-6 w-24" />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {list.map((project) => (
            <Link to="/projets/$slug" params={{ slug: project.slug }} key={project.id} className="overflow-hidden rounded-lg border border-border bg-card transition hover:-translate-y-1 hover:shadow-elevated">
              {project.cover_image_url || project.image_url ? <MediaPreview url={project.cover_image_url || project.image_url || ""} alt={project.title} className="aspect-[4/3] w-full object-cover" /> : null}
              <div className="p-6">
                <p className="eyebrow">{project.category ?? "Projet"}</p>
                <h3 className="mt-2 text-lg">{project.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{project.summary}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-10"><Button asChild variant="gold"><Link to="/projets">Tous nos projets</Link></Button></div>
      </div>
    </section>
  );
}

function LatestNews() {
  const { data: news } = useQuery(newsListQuery);
  const list = (news ?? []).slice(0, 3);
  if (list.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
      <p className="eyebrow">Actualités</p>
      <h2 className="mt-3 text-3xl lg:text-4xl">La vie du groupe</h2>
      <hr className="gold-rule mt-6 w-24" />
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {list.map((item) => (
          <Link key={item.id} to="/actualites/$slug" params={{ slug: item.slug }} className="group overflow-hidden rounded-lg border border-border bg-card transition hover:-translate-y-1 hover:shadow-elevated">
            {item.cover_image_url || item.image_url || item.video_url ? <MediaPreview url={item.cover_image_url ?? item.image_url ?? item.video_url ?? ""} alt={item.title} poster={item.video_poster_url} className="aspect-[16/9] w-full object-cover transition duration-500 group-hover:scale-[1.02]" /> : null}
            <div className="p-6">
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{formatDateFr(item.published_at ?? item.created_at)}</p>
              <h3 className="mt-3 text-lg">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.excerpt}</p>
              <span className="mt-5 inline-flex text-sm font-semibold underline underline-offset-4">Lire l’actualité →</span>
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-10"><Button asChild variant="outline"><Link to="/actualites">Toutes les actualités</Link></Button></div>
    </section>
  );
}

function CallToAction() {
  const { data: company } = useQuery(companyQuery);
  return (
    <section className="bg-ink-gradient py-20 text-ink-foreground lg:py-24">
      <div className="mx-auto flex max-w-7xl flex-col items-start gap-8 px-5 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <h2 className="text-3xl lg:text-4xl">Un projet foncier, immobilier ou électrique ?</h2>
          <p className="mt-4 max-w-xl text-ink-foreground/70">Nos équipes vous accompagnent de l'étude à la livraison. Décrivez votre besoin, nous revenons vers vous rapidement.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="gold" size="lg"><Link to="/services">Demander un devis</Link></Button>
          {company?.phone_primary ? (
            <Button asChild size="lg" variant="outline" className="border-gold/50 bg-transparent text-ink-foreground hover:bg-gold hover:text-ink">
              <a href={`tel:${company.phone_primary.replace(/\s/g, "")}`}>{company.phone_primary}</a>
            </Button>
          ) : null}
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
        <IntroSection />
        <Activities />
        <Visuals />
        <VideoShowcase />
        <FeaturedProjects />
        <LatestNews />
        <HomeMap />
        <NewsletterSignup />
        <CallToAction />
      </main>
      <PartnersStrip />
      <SiteFooter />
      <AiAssistant />
    </div>
  );
}
