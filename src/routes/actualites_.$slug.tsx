import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { DetailMedia } from "@/components/site/DetailMedia";
import { formatDateFr, companyQuery, newsItemQuery, newsListQuery } from "@/lib/site-data";
import { StructuredNewsContent } from "@/components/site/StructuredNewsContent";

export const Route = createFileRoute("/actualites_/$slug")({
  loader: async ({ context, params }) => {
    try {
      const [item, company] = await Promise.all([
        context.queryClient.ensureQueryData(newsItemQuery(params.slug)),
        context.queryClient.ensureQueryData(companyQuery),
      ]);
      return { item, company };
    } catch {
      return { item: null, company: null };
    }
  },
  component: Page,
});

function Page() {
  const { slug } = Route.useParams();
  const { data: item, isLoading } = useQuery(newsItemQuery(slug));
  const { data: allNews } = useQuery(newsListQuery);

  if (isLoading) {
    return <SiteLayout><section className="mx-auto max-w-7xl px-5 py-24 lg:px-8"><p className="text-muted-foreground">Chargement…</p></section></SiteLayout>;
  }

  if (!item) {
    return <SiteLayout><PageHero eyebrow="Actualités" title="Actualité introuvable" description="Cette publication n’est plus disponible." /><section className="mx-auto max-w-7xl px-5 py-12 lg:px-8"><Link to="/actualites" className="font-semibold underline">← Retour aux actualités</Link></section></SiteLayout>;
  }

  const legacyMedia = [
    ...(item.image_url ? [{ url: item.image_url }] : []),
    ...(item.video_url ? [{ url: item.video_url, kind: "video" as const, poster: item.video_poster_url }] : []),
  ];
  const related = (allNews ?? []).filter((news) => news.slug !== item.slug).slice(0, 3);

  return (
    <SiteLayout>
      <PageHero eyebrow="Actualité" title={item.title} description={item.excerpt ?? ""} />

      <article className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-12">
        <div className="mb-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">
          <span>{formatDateFr(item.published_at ?? item.created_at)}</span>
          {item.author ? <span>— {item.author}</span> : null}
        </div>

        <DetailMedia
          cover={item.cover_image_url}
          items={item.media_urls?.length ? item.media_urls : legacyMedia}
          alt={item.title}
        />

        <div className="mt-10 w-full">
          <StructuredNewsContent content={item.content} title={item.title} />
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
          <Link to="/actualites" className="text-sm font-semibold underline underline-offset-4">← Toutes les actualités</Link>
          <Link to="/contact" className="text-sm font-semibold text-gold-deep underline underline-offset-4">Être recontacté pour cette offre →</Link>
        </div>

        {related.length ? (
          <section className="mt-10">
            <p className="eyebrow">À découvrir également</p>
            <div className={"mt-6 grid gap-6 " + (related.length === 1 ? "" : related.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3")}>
              {related.map((news) => (
                <Link key={news.id} to="/actualites/$slug" params={{ slug: news.slug }} className={"overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-1 hover:shadow-elevated " + (related.length === 1 ? "grid md:grid-cols-[360px_1fr]" : "")}>
                  {news.cover_image_url || news.image_url || news.video_url ? <img src={news.cover_image_url || news.image_url || news.video_url || ""} alt={news.title} className="aspect-[16/9] h-full w-full object-cover" /> : null}
                  <div className="p-6">
                    <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{formatDateFr(news.published_at ?? news.created_at)}</p>
                    <h2 className="mt-2 text-lg">{news.title}</h2>
                    {news.excerpt ? <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{news.excerpt}</p> : null}
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
