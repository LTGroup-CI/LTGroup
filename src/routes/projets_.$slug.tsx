import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { DetailMedia } from "@/components/site/DetailMedia";
import { companyQuery, projectItemQuery, projectsQuery } from "@/lib/site-data";

const STATUS_LABEL: Record<string, string> = {
  en_cours: "En cours",
  termine: "Terminé",
  a_venir: "À venir",
};

export const Route = createFileRoute("/projets_/$slug")({
  loader: async ({ context, params }) => {
    try {
      const [project, company] = await Promise.all([
        context.queryClient.ensureQueryData(projectItemQuery(params.slug)),
        context.queryClient.ensureQueryData(companyQuery),
      ]);
      return { project, company };
    } catch {
      return { project: null, company: null };
    }
  },
  component: Page,
});

function Page() {
  const { slug } = Route.useParams();
  const { data: project, isLoading } = useQuery(projectItemQuery(slug));
  const { data: allProjects } = useQuery(projectsQuery);

  if (isLoading) {
    return <SiteLayout><section className="mx-auto max-w-7xl px-5 py-24 lg:px-8"><p className="text-muted-foreground">Chargement…</p></section></SiteLayout>;
  }

  if (!project) {
    return <SiteLayout><PageHero eyebrow="Projet" title="Projet introuvable" description="Ce projet n’est plus disponible." /><section className="mx-auto max-w-7xl px-5 py-12 lg:px-8"><Link to="/projets" className="font-semibold underline">← Tous les projets</Link></section></SiteLayout>;
  }

  const legacyMedia = [
    ...(project.image_url ? [{ url: project.image_url }] : []),
  ];
  const related = (allProjects ?? []).filter((item) => item.slug !== project.slug).slice(0, 3);

  return (
    <SiteLayout>
      <PageHero eyebrow={project.category ?? "Projet"} title={project.title} description={project.summary ?? ""} />

      <article className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-12">
        <div className="min-w-0">
          <DetailMedia
            cover={project.cover_image_url}
            items={project.media_urls?.length ? project.media_urls : legacyMedia}
            alt={project.title}
          />

          <div className="mt-10 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.16em] text-muted-foreground">
            {project.category ? <span>{project.category}</span> : null}
            <span className="rounded-full bg-accent px-3 py-1 text-gold-deep">
              {STATUS_LABEL[project.status] ?? project.status}
            </span>
            {project.location ? <span>— {project.location}</span> : null}
          </div>

          {project.content ? (
            <div className="mt-8 w-full whitespace-pre-line text-[1.02rem] leading-8 text-foreground/80 [text-align:justify]">
              {project.content}
            </div>
          ) : null}

          <Link to="/contact" className="mt-8 inline-flex font-semibold underline underline-offset-4">
            Parler de ce projet →
          </Link>
        </div>

        {related.length ? (
          <section className="mt-10 border-t border-border pt-12">
            <p className="eyebrow">Autres projets</p>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {related.map((item) => (
                <Link key={item.id} to="/projets/$slug" params={{ slug: item.slug }} className="overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-1 hover:shadow-elevated">
                  {item.cover_image_url || item.image_url ? <img src={item.cover_image_url || item.image_url || ""} alt={item.title} className="aspect-[4/3] w-full object-cover" /> : null}
                  <div className="p-5">
                    <h2 className="text-lg">{item.title}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.summary}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </article>
    </SiteLayout>
  );
}
