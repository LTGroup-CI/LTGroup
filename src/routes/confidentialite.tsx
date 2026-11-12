import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";

const title = "Politique de confidentialité | LIGHT TERRA GROUP SARL";
const description = "Comment LIGHT TERRA GROUP SARL collecte, utilise et protège vos données personnelles.";

export const Route = createFileRoute("/confidentialite")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://ltgroup-ci.com/confidentialite" }],
  }),
  component: Page,
});

function Page() {
  return (
    <LegalPage
      title="Politique de confidentialité"
      intro="Vos données sont utilisées uniquement pour répondre à vos demandes."
      sections={[
        { h: "Données collectées", body: <p>Lorsque vous remplissez un formulaire (contact, devis, newsletter, témoignage) ou échangez avec l'assistante Raï, nous recueillons votre nom, e-mail, téléphone et le contenu de votre message.</p> },
        { h: "Utilisation", body: <p>Ces données servent à traiter votre demande, vous recontacter et, si vous y êtes abonné, vous envoyer nos actualités. Elles ne sont jamais vendues ni cédées.</p> },
        { h: "Conservation", body: <p>Les données sont conservées le temps nécessaire au suivi de votre demande et de la relation commerciale.</p> },
        { h: "Vos droits", body: <p>Vous pouvez demander l'accès, la correction ou la suppression de vos données en écrivant à contact@ltgroup-ci.com. Chaque e-mail de la newsletter contient un lien de désabonnement.</p> },
      ]}
    />
  );
}
