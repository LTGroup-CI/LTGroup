import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ShieldCheck, Users, HardHat, Handshake } from "lucide-react";
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
  heroSlidesQuery,
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
    <section className="relative overflow-hidden border-b border-border bg-ink">
      <div className="absolute inset-0">
        <img
          src={current.image_url}
          alt=""
          aria-hidden
          className="h-full w-full object-cover opacity-35 transition-opacity duration-700"
        />
        <div className="absolute inset-0 bg-black/75" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/85" />
      </div>

      <div className="relative mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12 xl:px-16">
        <div className="grid min-h-[70vh] gap-8 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14 lg:py-14">
          <div className="order-2 min-w-0 lg:order-1">
            <div className="mb-6">
              <p className="eyebrow text-gold">Qui sommes-nous</p>
              <h2 className="mt-3 text-2xl leading-tight text-white sm:text-3xl lg:text-[1.75rem] xl:text-[2.05rem]">
                <span className="lg:block lg:whitespace-nowrap">Un partenaire solide pour vos projets </span>
                <span className="lg:block lg:whitespace-nowrap">fonciers et immobiliers</span>
              </h2>
              <hr className="gold-rule mt-5 w-24" />
              <p className="mt-5 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">
                De la recherche du terrain à la remise des clés, LT GROUP réunit topographes, ingénieurs et bâtisseurs pour sécuriser chaque étape de votre investissement.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild variant="gold">
                  <Link to="/a-propos">Découvrir le groupe</Link>
                </Button>
                <Button asChild variant="outline" className="border-white/40 bg-transparent text-white hover:bg-white hover:text-foreground">
                  <Link to="/contact">Nous rencontrer</Link>
                </Button>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl border border-gold/25 bg-black/60 shadow-elevated">
              <IntroVideoLoop />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
            </div>
          </div>

          <div className="order-1 flex min-w-0 items-center lg:order-2">
            <div className="w-full">
              <p className="eyebrow text-gold">LT GROUP · Côte d’Ivoire</p>
              <h1 className="mt-4 text-4xl leading-[1.05] text-white sm:text-5xl lg:text-6xl xl:text-[4.5rem]">
                Bâtir la terre, <span className="text-gold-gradient">éclairer l’avenir</span>
              </h1>
              <p className="mt-7 max-w-2xl text-base leading-7 text-white/75 sm:text-lg sm:leading-8">
                {company?.description ?? "LT GROUP accompagne particuliers, entreprises et institutions en Côte d’Ivoire : vente de terrains, aménagement foncier, BTP, immobilier, hydraulique et électrification."}
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
      </div>
    </section>
  );
}

function KeyFigures() {
  const items = [
    { value: "6", label: "pôles d'expertise" },
    { value: "100 %", label: "documents fonciers vérifiés" },
    { value: "Étude → livraison", label: "un seul interlocuteur" },
    { value: "Abidjan", label: "et tout le territoire ivoirien" },
  ];
  return (
    <section className="relative z-20 mx-auto -mt-8 max-w-[1480px] px-5 sm:px-8 lg:px-12 xl:px-16">
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

function Visuals() {
  return (
    <section className="bg-secondary py-12 lg:py-12">
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
    <section className="mx-auto grid max-w-[1480px] gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[0.9fr_1.4fr] lg:px-12 lg:py-12 xl:px-16">
      <div className="min-w-0 self-center">
        <h2 className="mt-0 text-3xl lg:text-4xl">Nos locaux à Abidjan</h2>
        <hr className="gold-rule mt-6 w-24" />
        <p className="mt-6 leading-relaxed text-muted-foreground">
          <span className="font-semibold text-foreground">Siège social :</span> Cocody Akouédo Extension Sud-Est, Lot 637, Îlot 60, 01 BP 2259 Abidjan 01.
        </p>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          (+225) 07 49 22 47 22 / 07 07 74 14 84<br />contact@ltgroup-ci.com
        </p>
        <Button asChild variant="gold" className="mt-8"><Link to="/contact">Prendre rendez-vous</Link></Button>
      </div>
      <div className="min-w-0">
        <div className="mb-4">
          <p className="eyebrow">Nous trouver</p>
        </div>
        <OfficeMap className="h-80 sm:h-96 lg:h-[27rem]" />
      </div>
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
    <section className="bg-muted/40 py-12 sm:py-12 lg:py-12">
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
    <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-12">
      <p className="eyebrow">Nos pôles d'activité</p>
      <h2 className="mt-3 text-3xl lg:text-4xl">Un groupe, plusieurs expertises</h2>
      <hr className="gold-rule mt-6 w-24" />
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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

const WHY = [
  { icon: ShieldCheck, title: "Sécurité foncière", text: "Terrains vérifiés, documents contrôlés et accompagnement jusqu'au titre foncier." },
  { icon: Users, title: "Équipe pluridisciplinaire", text: "Topographes, ingénieurs, juristes et bâtisseurs réunis autour de votre projet." },
  { icon: HardHat, title: "Maîtrise des chantiers", text: "Études, VRD, construction et réseaux réalisés dans le respect des normes." },
  { icon: Handshake, title: "Suivi transparent", text: "Un interlocuteur unique, des comptes rendus réguliers et des délais tenus." },
];
const STEPS = ["Écoute et étude du besoin", "Visite et vérifications", "Proposition et devis", "Réalisation et remise"];

function WhyUs() {
  return (
    <section className="bg-secondary py-12 lg:py-16">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[1fr_1.3fr] lg:px-8">
        <div>
          <p className="eyebrow">Pourquoi LT GROUP</p>
          <h2 className="mt-3 text-3xl lg:text-4xl">Un accompagnement sérieux, de A à Z</h2>
          <hr className="gold-rule mt-5 w-24" />
          <p className="mt-5 text-justify leading-relaxed text-muted-foreground">LIGHT TERRA GROUP SARL accompagne particuliers, entreprises et institutions dans leurs projets fonciers, immobiliers et d'infrastructures en Côte d'Ivoire, avec rigueur, transparence et proximité.</p>
          <ol className="mt-6 space-y-3">
            {STEPS.map((s, i) => (
              <li key={s} className="flex items-center gap-3">
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold font-semibold text-ink">{i + 1}</span>
                <span className="font-medium">{s}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {WHY.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-xl border border-border bg-card p-6 shadow-soft">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-accent text-gold-deep"><Icon className="h-5 w-5" /></span>
              <h3 className="mt-4 text-lg">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedProjects() {
  const { data: projects } = useQuery(projectsQuery);
  const list = (projects ?? []).slice(0, 3);
  if (list.length === 0) return null;

  return (
    <section className="bg-muted/50 py-12 lg:py-12">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <p className="eyebrow">Réalisations</p>
        <h2 className="mt-3 text-3xl lg:text-4xl">Des projets qui transforment le territoire</h2>
        <hr className="gold-rule mt-6 w-24" />
        <div className="mt-8 grid gap-6 md:grid-cols-3">
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
    <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-12">
      <p className="eyebrow">Actualités</p>
      <h2 className="mt-3 text-3xl lg:text-4xl">La vie du groupe</h2>
      <hr className="gold-rule mt-6 w-24" />
      <div className="mt-8 grid gap-6 md:grid-cols-3">
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
    <section className="bg-ink-gradient py-12 text-ink-foreground lg:py-12">
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
        <Activities />
        <WhyUs />
        <Visuals />
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
