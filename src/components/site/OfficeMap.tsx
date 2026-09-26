import { useQuery } from "@tanstack/react-query";
import { companyQuery } from "@/lib/site-data";

// Coordonnées provisoires (Cocody Akouédo) — remplacées automatiquement par celles saisies dans l'admin.
const FALLBACK = { lat: 5.3566, lng: -3.9361 };

export function OfficeMap({ className = "h-72" }: { className?: string }) {
  const { data: company } = useQuery(companyQuery);
  const lat = Number(company?.latitude ?? FALLBACK.lat);
  const lng = Number(company?.longitude ?? FALLBACK.lng);
  const d = 0.006;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - d}%2C${lat - d}%2C${lng + d}%2C${lat + d}&layer=mapnik&marker=${lat}%2C${lng}`;
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <iframe title="Localisation du siège LT GROUP" src={src} className={`w-full ${className}`} loading="lazy" />
      <div className="flex flex-wrap gap-4 bg-card px-4 py-3 text-sm">
        <a className="font-semibold text-gold-deep underline" target="_blank" rel="noreferrer" href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}>
          Itinéraire Google Maps →
        </a>
        <a className="text-muted-foreground underline" target="_blank" rel="noreferrer" href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=17/${lat}/${lng}`}>
          Agrandir la carte
        </a>
      </div>
    </div>
  );
}
