import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Breadcrumb } from "@/components/site/Breadcrumb";
import { DetailMedia } from "@/components/site/DetailMedia";
import { PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { activitiesQuery, activityItemQuery } from "@/lib/site-data";
import { SITE_URL } from "@/lib/media";

export const Route = createFileRoute("/activites_/$slug")({
  loader: async ({ context, params }) => {
    try {
      return await context.queryClient.ensureQueryData(activityItemQuery(params.slug));
    } catch {
      return null;
    }
  },
  head: ({ loaderData, params }) => {
    const activity = loaderData ?? null;
    const title = activity ? `${activity.title} | Expertises — LT GROUP` : "Expertise — LT GROUP";
    const description = activity?.short_description ?? "Découvrez les expertises de LIGHT TERRA GROUP SARL en Côte d’Ivoire.";
    const url = `${SITE_URL}/activites/${params.slug}`;
    const image = activity?.cover_image_url ?? activity?.image_url ?? null;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        ...(image ? [{ property: "og:image", content: image }, { name: "twitter:image", content: image }] : []),
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: Page,
});

function Page() {
  const { slug } = Route.useParams();
  const { data: activity, isLoading } = useQuery(activityItemQuery(slug));
  const { data: allActivities } = useQuery(activitiesQuery);

  if (isLoading) {
    return <SiteLayout><section className="mx-auto max-w-7xl px-5 py-24 lg:px-8"><p className="text-muted-foreground">Chargement…</p></section></SiteLayout>;
  }

  if (!activity) {
    return <SiteLayout><PageHero eyebrow="Expertise" title="Expertise introuvable" description="Cette présentation n’est plus disponible." /><section className="mx-auto max-w-7xl px-5 py-12 lg:px-8"><Link to="/services" className="font-semibold underline">← Toutes nos expertises</Link></section></SiteLayout>;
  }

  const media = activity.media_urls?.length
    ? activity.media_urls
    : activity.image_url
      ? [{ url: activity.image_url, kind: "photo" as const }]
      : [];

  return (
    <SiteLayout>
      <Breadcrumb section="Expertises" to="/services" current={activity.title} />
      <PageHero eyebrow="Nos expertises" title={activity.title} description={activity.short_description} />
      <article className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,.8fr)] lg:items-start">
          <div className="min-w-0">
            <DetailMedia cover={activity.cover_image_url} items={media} alt={activity.title} />
          </div>
          <div>
            {activity.description ? (
              <div className="whitespace-pre-line text-base leading-8 text-foreground/80 [text-align:justify]">{activity.description}</div>
            ) : (
              <p className="text-base leading-8 text-muted-foreground">Notre équipe vous accompagne dans cette expertise, de l’étude de votre besoin à la réalisation de votre projet.</p>
            )}
            <Link to="/contact" className="mt-8 inline-flex rounded-md bg-gold px-5 py-3 font-semibold text-ink transition hover:-translate-y-0.5 hover:shadow-gold">
              Échanger avec notre équipe →
            </Link>
          </div>
        </div>

        {(allActivities ?? []).filter((item) => item.slug !== activity.slug).length ? (
          <section className="mt-16 border-t border-border pt-12">
            <p className="eyebrow">Nos autres expertises</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(allActivities ?? []).filter((item) => item.slug !== activity.slug).slice(0, 6).map((item) => (
                <Link key={item.id} to="/activites/$slug" params={{ slug: item.slug }} className="rounded-xl border border-border bg-card p-5 transition hover:-translate-y-1 hover:border-gold/50 hover:shadow-elevated">
                  <h2 className="text-lg">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.short_description}</p>
                  <span className="mt-4 inline-flex text-sm font-semibold text-gold-deep">Découvrir →</span>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </article>
    </SiteLayout>
  );
}
