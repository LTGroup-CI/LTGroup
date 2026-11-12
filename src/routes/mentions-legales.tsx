import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";

const title = "Mentions légales | LIGHT TERRA GROUP SARL";
const description = "Mentions légales du site de LIGHT TERRA GROUP SARL : éditeur, siège social, contact et hébergement.";

export const Route = createFileRoute("/mentions-legales")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://ltgroup-ci.com/mentions-legales" }],
  }),
  component: Page,
});

function Page() {
  return (
    <LegalPage
      title="Mentions légales"
      intro="Informations sur l'éditeur et l'hébergement du site ltgroup-ci.com."
      sections={[
        { h: "Éditeur du site", body: <><p>LIGHT TERRA GROUP SARL (LT GROUP), société à responsabilité limitée de droit ivoirien.</p><p>Siège social : Abidjan Cocody Akouédo extension sud-est, Lot 637, îlot 60 — 01 BP 2259 Abidjan 01, Côte d'Ivoire.</p><p>Téléphone : (+225) 07 49 22 47 22 / 07 07 74 14 84 — E-mail : contact@ltgroup-ci.com</p></> },
        { h: "Hébergement", body: <p>Le site est hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis.</p> },
        { h: "Propriété intellectuelle", body: <p>Les textes, logos, photos et vidéos de ce site appartiennent à LIGHT TERRA GROUP SARL. Toute reproduction sans autorisation écrite est interdite.</p> },
        { h: "Responsabilité", body: <p>Les informations publiées (offres de terrains, prix, disponibilités) sont données à titre indicatif et peuvent évoluer. Seuls les documents signés avec LT GROUP font foi.</p> },
      ]}
    />
  );
}
