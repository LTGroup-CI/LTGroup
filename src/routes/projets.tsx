import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { MapPin } from "lucide-react";

import { PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { MediaPreview } from "@/components/site/MediaPreview";
import { projectsQuery } from "@/lib/site-data";
import { SERVICES, serviceFor } from "@/content/services";

const title = "Projets & réalisations en Côte d’Ivoire | LIGHT TERRA GROUP";
const description =
  "Explorez les projets et réalisations de LIGHT TERRA GROUP SARL : aménagement foncier, lotissements, construction, immobilier et infrastructures en Côte d’Ivoire.";

export const Route = createFileRoute("/projets")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://ltgroup-ci.com/projets" },
      { property: "og:image", content: "https://ltgroup-ci.com/media/og-light-terra.jpg" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: "https://ltgroup-ci.com/media/og-light-terra.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `https://ltgroup-ci.com${"/projets"}` }],
  }),
  component: Page,
});

const STATUS_LABEL: Record<string, string> = {
  en_cours: "En cours",
  termine: "Terminé",
  a_venir: "À venir",
};

function Page() {
  const { data: projects, isLoading } = useQuery(projectsQuery);
  const [filter, setFilter] = useState<string>("tous");

  const all = (projects ?? []).map((p) => ({ ...p, service: serviceFor(p.category, p.title) }));
  const used = SERVICES.filter((s) => all.some((p) => p.service?.n === s.n));
  const categories = used.map((s) => s.n);
  const list = all.filter((p) => filter === "tous" || p.service?.n === filter);

  return (
    <SiteLayout>
      <PageHero eyebrow="Réalisations" title="Nos projets" description="Chaque projet est classé selon l'un de nos 9 services. Filtrez pour voir nos réalisations par domaine." />
      <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        {categories.length > 0 ? (
          <div className="mb-10 flex flex-wrap gap-2">
            {["tous", ...categories].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilter(cat)}
                className={
                  filter === cat
                    ? "rounded-sm bg-ink px-4 py-2 text-xs uppercase tracking-[0.14em] text-ink-foreground"
                    : "rounded-sm border border-border px-4 py-2 text-xs uppercase tracking-[0.14em] text-muted-foreground transition hover:border-gold hover:text-foreground"
                }
              >
                {cat === "tous" ? "Tous" : `${cat} · ${SERVICES.find((s) => s.n === cat)?.title}`}
              </button>
            ))}
          </div>
        ) : null}

        {isLoading ? <p className="text-muted-foreground">Chargement…</p> : null}
        {!isLoading && list.length === 0 ? (
          <p className="text-muted-foreground">Nos projets seront publiés prochainement.</p>
        ) : null}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map((project) => (
            <Link to="/projets/$slug" params={{ slug: project.slug }}
              key={project.id}
              className="overflow-hidden rounded-lg border border-border bg-card transition hover:-translate-y-1 hover:shadow-elevated"
            >
              {project.cover_image_url || project.image_url ? <MediaPreview url={project.cover_image_url || project.image_url || ""} alt={project.title} className="aspect-[4/3] w-full object-cover" /> : null}
              <div className="p-6">
                <div className="flex items-center justify-between gap-3">
                  <p className="eyebrow min-w-0 truncate">{project.service ? `${project.service.n} · ${project.service.title}` : project.category ?? "Projet"}</p>
                  <span className="shrink-0 rounded-full bg-accent px-3 py-1 text-[0.65rem] uppercase tracking-[0.12em] text-gold-deep">
                    {STATUS_LABEL[project.status] ?? project.status}
                  </span>
                </div>
                <h2 className="mt-2 text-lg">{project.title}</h2>
                {project.location ? (
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 text-gold" /> {project.location}
                  </p>
                ) : null}
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {project.summary ?? project.content}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}