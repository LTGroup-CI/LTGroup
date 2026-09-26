import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { activityIcon } from "@/lib/activity-icons";

import { PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { activitiesQuery } from "@/lib/site-data";

const title = "Nos activités — LT GROUP";
const description =
  "Aménagement foncier, BTP, promotion immobilière, infrastructures électriques : découvrez les pôles d'activité de LT GROUP.";

export const Route = createFileRoute("/activites")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});


function Page() {
  const { data: activities, isLoading } = useQuery(activitiesQuery);

  return (
    <SiteLayout>
      <PageHero eyebrow="Nos activités" title="Nos pôles d'activité" description={description} />
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        {isLoading ? <p className="text-muted-foreground">Chargement…</p> : null}
        <div className="grid gap-6 lg:grid-cols-2">
          {(activities ?? []).map((activity, i) => {
            const Icon = activityIcon(activity.icon);
            return (
              <Link to="/activites/$slug" params={{ slug: activity.slug }}
                key={activity.id}
                className="group grid gap-6 rounded-2xl border border-border bg-card p-6 shadow-soft transition hover:-translate-y-0.5 hover:border-gold/60 hover:shadow-elevated lg:grid-cols-[auto_1fr] lg:p-8"
              >
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-sm bg-accent text-gold-deep">
                  <Icon className="h-7 w-7" />
                </span>
                <div>
                  <p className="eyebrow">{String(i + 1).padStart(2, "0")}</p>
                  <h2 className="mt-2 text-2xl">{activity.title}</h2>
                  <p className="mt-3 leading-relaxed text-muted-foreground">
                    {activity.description ?? activity.short_description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-12">
          <Button asChild variant="gold" size="lg">
            <Link to="/services">Demander un devis</Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}
