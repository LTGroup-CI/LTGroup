import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { MediaPreview } from "@/components/site/MediaPreview";
import { PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { activitiesQuery } from "@/lib/site-data";

export const Route = createFileRoute("/activites")({
  head: () => ({
    meta: [
      { title: "Pôles d’activité | LIGHT TERRA GROUP SARL" },
      { name: "description", content: "Découvrez les pôles d’activité et expertises de LIGHT TERRA GROUP SARL en Côte d’Ivoire." },
      { property: "og:title", content: "Pôles d’activité | LIGHT TERRA GROUP SARL" },
      { property: "og:description", content: "Les domaines d’intervention de LIGHT TERRA GROUP SARL." },
    ],
    links: [{ rel: "canonical", href: "https://ltgroup-ci.com/activites" }],
  }),
  component: Page,
});

function Page() {
  const { data: activities, isLoading } = useQuery(activitiesQuery);
  const list = activities ?? [];

  return (
    <SiteLayout>
      <PageHero eyebrow="Nos domaines d’intervention" title="Nos pôles d’activité" description="Des expertises complémentaires réunies pour accompagner vos projets, de l’étude à la réalisation." />
      <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        {isLoading ? <p className="text-muted-foreground">Chargement des pôles d’activité…</p> : null}
        {!isLoading && list.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center">
            <p className="text-muted-foreground">Les présentations de nos pôles d’activité seront publiées prochainement.</p>
            <Link to="/services" className="mt-5 inline-flex items-center gap-2 font-semibold text-gold-deep">Consulter nos expertises <ArrowRight className="h-4 w-4" /></Link>
          </div>
        ) : null}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((activity) => {
            const image = activity.cover_image_url ?? activity.image_url;
            return (
              <Link key={activity.id} to="/activites/$slug" params={{ slug: activity.slug }} className="group overflow-hidden rounded-2xl border border-border/80 bg-card shadow-soft transition duration-500 hover:-translate-y-1.5 hover:border-gold/50 hover:shadow-elevated">
                <div className="relative aspect-[16/10] overflow-hidden bg-ink-gradient">{image ? <MediaPreview url={image} alt={activity.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /> : <div className="flex h-full items-end p-6"><span className="text-xs uppercase tracking-[0.22em] text-gold/80">LIGHT TERRA GROUP · EXPERTISE</span></div>}<div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" /></div>
                <div className="p-6">
                  <h2 className="text-xl transition-colors group-hover:text-gold-deep">{activity.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{activity.short_description}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gold-deep">Découvrir ce pôle <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </SiteLayout>
  );
}
