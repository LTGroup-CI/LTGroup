import { useQuery } from "@tanstack/react-query";
import { companyQuery } from "@/lib/site-data";

const FALLBACK = { lat: 5.355498313903809, lng: -3.925191879272461 };

export function OfficeMap({ className = "h-72" }: { className?: string }) {
  const { data: company } = useQuery(companyQuery);
  const lat = Number(company?.latitude ?? FALLBACK.lat);
  const lng = Number(company?.longitude ?? FALLBACK.lng);
  const d = 0.018;
  const bbox = `${lng - d}%2C${lat - d}%2C${lng + d}%2C${lat + d}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik`;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-elevated">
      <div className="relative">
        <iframe
          title="Carte de localisation des locaux LIGHT TERRA GROUP SARL et des environs"
          src={src}
          className={`block w-full ${className}`}
          loading="lazy"
        />

        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative flex flex-col items-center">
            <span className="absolute h-10 w-10 animate-ping rounded-full bg-red-500/40" />
            <span className="relative h-5 w-5 rounded-full border-[3px] border-white bg-red-600 shadow-[0_0_0_2px_rgba(220,38,38,0.65)]" />
            <span className="mt-2 whitespace-nowrap rounded-full border border-white/70 bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-slate-900 shadow-lg">
              LIGHT TERRA GROUP SARL
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 bg-card px-4 py-3 text-sm sm:gap-4">
        <a
          className="font-semibold text-gold-deep underline"
          target="_blank"
          rel="noreferrer"
          href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
        >
          Itinéraire Google Maps →
        </a>
        <a
          className="text-muted-foreground underline"
          target="_blank"
          rel="noreferrer"
          href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`}
        >
          Agrandir la carte
        </a>
      </div>
    </div>
  );
}
