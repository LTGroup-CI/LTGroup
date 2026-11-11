import { Building2, Cctv, Compass, Droplets, HardHat, MapPinned, RadioTower, Route as RouteIcon, Zap, type LucideIcon } from "lucide-react";

export type Service = { n: string; title: string; text: string; points: string[]; icon: LucideIcon };

/** Les 9 services officiels de LIGHT TERRA GROUP SARL, dans l'ordre voulu. */
export const SERVICES: Service[] = [
  { n: "01", title: "Études", icon: Compass, text: "Études topographiques, géotechniques et de faisabilité pour sécuriser chaque projet dès le départ.", points: ["Levés topographiques", "Études de faisabilité", "Plans et dossiers techniques"] },
  { n: "02", title: "Aménagement foncier", icon: MapPinned, text: "Lotissement, bornage et viabilisation de terrains, avec accompagnement jusqu'au titre foncier.", points: ["Lotissement et bornage", "Viabilisation", "Accompagnement ACD / TF"] },
  { n: "03", title: "Promotion immobilière", icon: Building2, text: "Conception et réalisation de logements et programmes immobiliers, de l'idée à la remise des clés.", points: ["Villas et résidences", "Programmes immobiliers", "Vente de terrains"] },
  { n: "04", title: "Adduction d'eau potable", icon: Droplets, text: "Forages, châteaux d'eau, réseaux de distribution et branchements pour un accès durable à l'eau.", points: ["Forages et pompage", "Réseaux de distribution", "Branchements"] },
  { n: "05", title: "Électrification HTA, MT, BT et EP", icon: Zap, text: "Réseaux haute, moyenne et basse tension, postes de transformation et éclairage public.", points: ["Réseaux HTA / MT / BT", "Postes de transformation", "Éclairage public (EP)"] },
  { n: "06", title: "BTP", icon: HardHat, text: "Construction de bâtiments et ouvrages, gros œuvre et second œuvre, dans le respect des normes.", points: ["Gros œuvre", "Second œuvre", "Réhabilitation"] },
  { n: "07", title: "VRD", icon: RouteIcon, text: "Voiries, réseaux divers, assainissement et drainage pour des sites durablement praticables.", points: ["Voiries et pistes", "Assainissement", "Drainage"] },
  { n: "08", title: "Réseau télécom", icon: RadioTower, text: "Déploiement de fibre optique, génie civil télécom et infrastructures de communication.", points: ["Fibre optique", "Génie civil télécom", "Pylônes et liaisons"] },
  { n: "09", title: "Sécurité et électronique", icon: Cctv, text: "Vidéosurveillance, contrôle d'accès, alarmes et systèmes électroniques pour protéger vos sites.", points: ["Vidéosurveillance", "Contrôle d'accès", "Alarmes et détection"] },
];

const KEYWORDS: [string, RegExp][] = [
  ["01", /étude|topo|géotech/i],
  ["02", /foncier|lotis|terrain|bornage|viabil/i],
  ["03", /immobili|villa|logement|résidence/i],
  ["04", /eau|hydraul|forage|AEP/i],
  ["05", /électri|HTA|énergie|éclairage/i],
  ["07", /VRD|voirie|assainiss|drainage/i],
  ["06", /BTP|construct|bâtiment/i],
  ["08", /télécom|fibre/i],
  ["09", /sécurité|vidéo|surveillance|électronique/i],
];

/** Retrouve le service officiel correspondant à un texte (catégorie, titre…). */
export function serviceFor(...texts: (string | null | undefined)[]): Service | undefined {
  const t = texts.filter(Boolean).join(" ");
  const hit = KEYWORDS.find(([, re]) => re.test(t));
  return hit ? SERVICES.find((s) => s.n === hit[0]) : undefined;
}
