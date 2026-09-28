import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { SiteFooter, SiteHeader, PageHero } from "@/components/site/SiteLayout";
import { AiAssistant } from "@/components/site/AiAssistant";
import { faqItemsQuery } from "@/lib/site-data";

export const Route = createFileRoute("/faq")({
  component: FaqPage,
});

function FaqPage() {
  const { data: items, isLoading } = useQuery(faqItemsQuery);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Toutes");
  const [openId, setOpenId] = useState<string | null>(null);

  const categories = useMemo(
    () => ["Toutes", ...Array.from(new Set((items ?? []).map((item) => item.category).filter(Boolean)))],
    [items],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (items ?? []).filter((item) => {
      const matchesCategory = category === "Toutes" || item.category === category;
      const matchesQuery =
        !q ||
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [items, query, category]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <PageHero
          eyebrow="Centre d'information"
          title="Questions fréquentes"
          description="Retrouvez les réponses aux questions les plus courantes sur LT GROUP, ses expertises, ses projets, ses prestations et les moyens de nous contacter."
        />

        <section className="mx-auto w-full max-w-[1180px] px-5 py-14 sm:px-8 lg:py-12">
          <div className="rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-7">
            <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
              <label className="relative block">
                <span className="sr-only">Rechercher une question</span>
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Rechercher une question…"
                  className="h-12 w-full rounded-xl border border-input bg-background pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-gold/30"
                />
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    className={
                      item === category
                        ? "rounded-full bg-gold px-4 py-2 text-sm font-semibold text-ink"
                        : "rounded-full border border-border px-4 py-2 text-sm text-foreground/75 transition hover:border-gold/60 hover:text-foreground"
                    }
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10">
            {isLoading ? (
              <p className="py-10 text-center text-sm text-muted-foreground">Chargement des questions…</p>
            ) : filtered.length ? (
              <div className="space-y-3">
                {filtered.map((item) => {
                  const open = openId === item.id;
                  return (
                    <article key={item.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
                      <button
                        type="button"
                        onClick={() => setOpenId(open ? null : item.id)}
                        className="flex w-full items-center justify-between gap-6 px-5 py-5 text-left sm:px-7"
                        aria-expanded={open}
                      >
                        <span className="min-w-0">
                          <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-deep">
                            {item.category}
                          </span>
                          <span className="block text-base font-semibold leading-7 sm:text-lg">
                            {item.question}
                          </span>
                        </span>
                        <ChevronDown className={"h-5 w-5 shrink-0 text-muted-foreground transition-transform " + (open ? "rotate-180" : "")} />
                      </button>
                      {open ? (
                        <div className="border-t border-border px-5 py-5 sm:px-7 sm:py-6">
                          <p className="max-w-5xl text-[1.02rem] leading-8 text-foreground/80 [text-align:justify]">
                            {item.answer}
                          </p>
                        </div>
                      ) : null}
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border p-10 text-center">
                <p className="font-medium">Aucune question ne correspond à votre recherche.</p>
                <p className="mt-2 text-sm text-muted-foreground">Essayez un autre terme ou choisissez une autre catégorie.</p>
              </div>
            )}
          </div>

          <div className="mt-14 rounded-3xl bg-ink p-7 text-ink-foreground sm:p-10">
            <p className="eyebrow text-gold">Besoin d'une réponse personnalisée ?</p>
            <h2 className="mt-3 text-2xl text-white sm:text-3xl">Raï peut vous orienter</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
              Si votre question concerne un projet, un terrain, une prestation ou une demande de devis, utilisez l'assistante virtuelle Raï ou contactez directement l'équipe LT GROUP.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
      <AiAssistant />
    </div>
  );
}
