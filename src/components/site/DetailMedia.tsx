import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { isVideoMedia } from "@/components/site/MediaPreview";

export type DetailMediaItem = {
  url: string;
  kind?: "photo" | "video";
  poster?: string | null;
};

function normalize(items: DetailMediaItem[], cover?: string | null) {
  const all = cover ? [{ url: cover, kind: "photo" as const }, ...items] : items;
  return all.filter((item, index, list) => item.url && list.findIndex((candidate) => candidate.url === item.url) === index);
}

export function DetailMedia({
  cover,
  items,
  alt,
}: {
  cover?: string | null;
  items: DetailMediaItem[];
  alt: string;
}) {
  const media = useMemo(() => normalize(items, cover), [items, cover]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [cover, items]);

  useEffect(() => {
    if (media.length < 2) return;
    const current = media[index];
    if (!current) return;

    if (isVideoMedia(current.url) || current.kind === "video") return;

    const timer = window.setTimeout(() => {
      setIndex((value) => (value + 1) % media.length);
    }, 5000);
    return () => window.clearTimeout(timer);
  }, [index, media]);

  if (!media.length) return null;
  const current = media[index]!;

  const selectNext = () => setIndex((value) => (value + 1) % media.length);
  const selectPrevious = () => setIndex((value) => (value - 1 + media.length) % media.length);

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-black shadow-elevated">
        {isVideoMedia(current.url) || current.kind === "video" ? (
          <video
            key={current.url}
            src={current.url}
            poster={current.poster ?? undefined}
            className="aspect-video w-full object-contain"
            autoPlay
            muted
            playsInline
            controls
            onEnded={selectNext}
          />
        ) : (
          <img
            key={current.url}
            src={current.url}
            alt={alt}
            className="aspect-video w-full object-cover"
            loading="eager"
          />
        )}

        {media.length > 1 ? (
          <>
            <button
              type="button"
              onClick={selectPrevious}
              aria-label="Média précédent"
              className="absolute left-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/65 text-white backdrop-blur"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={selectNext}
              aria-label="Média suivant"
              className="absolute right-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/65 text-white backdrop-blur"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        ) : null}
      </div>

      {media.length > 1 ? (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {media.map((item, itemIndex) => {
            const video = isVideoMedia(item.url) || item.kind === "video";
            return (
              <button
                key={item.url}
                type="button"
                onClick={() => setIndex(itemIndex)}
                aria-label={`Afficher le média ${itemIndex + 1}`}
                className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-lg border-2 transition ${itemIndex === index ? "border-gold" : "border-border opacity-75 hover:opacity-100"}`}
              >
                {video ? (
                  item.poster ? (
                    <img src={item.poster} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <video src={item.url.includes("#") ? item.url : item.url + "#t=0.5"} muted playsInline preload="metadata" className="h-full w-full object-cover" />
                  )
                ) : (
                  <img src={item.url} alt="" className="h-full w-full object-cover" loading="lazy" />
                )}
                {video ? (
                  <span className="absolute bottom-1 left-1 inline-flex items-center gap-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] text-white">
                    <Play className="h-2.5 w-2.5 fill-current" /> Vidéo
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
