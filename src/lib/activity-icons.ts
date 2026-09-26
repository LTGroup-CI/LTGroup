import {
  Building2,
  Cctv,
  Compass,
  Droplets,
  HardHat,
  KeyRound,
  MapPinned,
  Ruler,
  Truck,
  Zap,
  type LucideIcon,
} from "lucide-react";

/** Icônes professionnelles des pôles d'activité (clé = champ « icon » en base). */
export const ACTIVITY_ICONS: Record<string, LucideIcon> = {
  map: MapPinned,
  compass: Compass,
  hammer: HardHat,
  "hard-hat": HardHat,
  building: Building2,
  zap: Zap,
  droplets: Droplets,
  ruler: Ruler,
  cctv: Cctv,
  truck: Truck,
  "key-round": KeyRound,
};

export function activityIcon(key: string | null | undefined): LucideIcon {
  return ACTIVITY_ICONS[key ?? ""] ?? Building2;
}
