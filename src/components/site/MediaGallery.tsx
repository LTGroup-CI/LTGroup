import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { mediaItemsQuery } from "@/lib/site-data";

/**
 * Galerie éditoriale : uniquement les médias explicitement publiés depuis
 * l'administration. Les couvertures de projets, actualités et activités
 * ne sont jamais injectées automatiquement ici afin d'éviter les doublons.
 */
export function MediaGallery() {
  const { data: mediaItems } = useQuery(mediaItemsQuery);

  const items = (mediaItems ?? []).filter(
    (item, index, all) =>
      Boolean(item.url) &&
      all.findIndex((candidate) => candidate.url === item.url) === index,
  );

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index >= items.length) setIndex(0);
  }, [index, items.length]);

  useEffect(() => {
    if (items.length < 2 || items[index]?.kind === "video") return;
    const timer = window.setTimeout(
      () => setIndex((current) => (current + 1) % items.length),
      5000,
    );
    return () => window.clearTimeout(timer);
  }, [index, items]);

  if (!items.length) return null;

  const current = items[index]!;

  return (
    <section className="border-t border-border bg-secondary py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <p className="eyebrow">Médias du groupe</p>
        <h2 className="mt-3 text-3xl lg:text-4xl">Découvrez nos contenus</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Photos et vidéos publiées depuis l’administration de LT GROUP.
        </p>
        <hr className="gold-rule mt-5 w-20" />

        <div className="relative mt-8 overflow-hidden rounded-2xl border border-gold/25 bg-ink shadow-elevated">
          {current.kind === "video" ? (
            <video
              key={current.id}
              src={current.url}
              poster={current.poster_url ?? undefined}
              className="aspect-video w-full bg-black object-cover"
              controls
              muted
              playsInline
              autoPlay
              onEnded={() => setIndex((i) => (i + 1) % items.length)}
            />
          ) : (
            <img
              key={current.id}
              src={current.url}
              alt={current.title ?? "Média LT GROUP"}
              loading="lazy"
              className="aspect-video w-full object-cover"
            />
          )}

          {items.length > 1 ? (
            <>
              <button
                type="button"
                aria-label="Média précédent"
                onClick={() => setIndex((i) => (i - 1 + items.length) % items.length)}
                className="absolute left-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-ink/70 text-gold"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                aria-label="Média suivant"
                onClick={() => setIndex((i) => (i + 1) % items.length)}
                className="absolute right-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-ink/70 text-gold"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          ) : null}
        </div>

        <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
          {items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={item.title ?? `Média ${i + 1}`}
              className={
                i === index
                  ? "h-16 w-24 shrink-0 overflow-hidden rounded-md border-2 border-gold"
                  : "h-16 w-24 shrink-0 overflow-hidden rounded-md border border-border opacity-70"
              }
            >
              {item.kind === "video" && !item.poster_url ? (
                <span className="flex h-full w-full items-center justify-center bg-ink text-[10px] uppercase tracking-wider text-gold">
                  Vidéo
                </span>
              ) : (
                <img
                  src={item.kind === "video" ? item.poster_url! : item.url}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              )}
            </button>
          ))}
        </div>

        {current.title ? <p className="mt-4 text-sm font-semibold">{current.title}</p> : null}
        {current.description ? (
          <p className="mt-1 text-sm text-muted-foreground">{current.description}</p>
        ) : null}
      </div>
    </section>
  );
}
