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
      intro="LIGHT TERRA GROUP SARL utilise vos données uniquement pour répondre à vos demandes et vous informer de nos activités."
      sections={[
        { h: "Responsable du traitement", body: <p>LIGHT TERRA GROUP SARL, Abidjan Cocody Akouédo extension sud-est, Lot 637, îlot 60 — 01 BP 2259 Abidjan 01, Côte d'Ivoire. Contact : contact@ltgroup-ci.com — (+225) 07 49 22 47 22.</p> },
        { h: "Données collectées", body: <><p>Lorsque vous remplissez un formulaire (contact, devis, newsletter, témoignage), nous recueillons votre nom, e-mail, téléphone, le service concerné et le contenu de votre message.</p><p>Lorsque vous échangez avec l'assistante virtuelle Raï, nous enregistrons la conversation et les coordonnées que vous choisissez de donner. Les réponses de Raï sont produites par un service d'intelligence artificielle auquel le contenu de vos messages est transmis.</p></> },
        { h: "Utilisation", body: <p>Ces données servent à traiter votre demande, vous recontacter, vous envoyer un devis et, si vous êtes abonné, nos actualités. Elles ne sont jamais vendues ni cédées.</p> },
        { h: "Destinataires et prestataires", body: <><p>Seule l'équipe de LT GROUP accède à vos demandes. Nous faisons appel à des prestataires techniques : Supabase (stockage des données du site), Resend (envoi des e-mails), notre hébergeur web, et le service d'intelligence artificielle de Lovable pour l'assistante Raï.</p><p>La carte de nos bureaux sur la page Contact est fournie par OpenStreetMap, qui reçoit votre adresse IP lorsque la carte s'affiche.</p></> },
        { h: "Stockage sur votre appareil", body: <p>Le site n'utilise pas de cookies publicitaires. Pour que Raï retrouve votre conversation, un identifiant aléatoire est enregistré dans votre navigateur. Vous pouvez l'effacer à tout moment en vidant les données du site dans votre navigateur.</p> },
        { h: "Mesure d'audience", body: <><p>Nous utilisons la mesure d'audience de Lovable. Elle n'utilise aucun cookie, n'enregistre rien sur votre appareil, ne conserve pas les adresses IP et ne permet pas de vous identifier. Lovable collecte ces données pour nous. <a className="text-gold-deep underline" href="https://lovable.dev/privacy" target="_blank" rel="noreferrer noopener">La politique de confidentialité de Lovable</a> explique comment elle les traite.</p><p>Elle enregistre les pages visitées, la provenance des visiteurs, leur pays, navigateur, système d'exploitation et type d'appareil, la durée de visite, la vitesse de chargement des pages, les erreurs et les clics sur les boutons et liens. Les données détaillées sont conservées 90 jours et les résumés quotidiens un an. Ces informations sont enregistrées pour chaque visiteur.</p></> },
        { h: "Conservation", body: <p>Les demandes et conversations sont conservées le temps nécessaire à leur suivi et à la relation commerciale. Les abonnés à la newsletter restent inscrits jusqu'à leur désabonnement.</p> },
        { h: "Vos droits", body: <p>Vous pouvez demander l'accès, la correction ou la suppression de vos données en écrivant à contact@ltgroup-ci.com. Chaque e-mail de la newsletter contient un lien de désabonnement.</p> },
      ]}
    />
  );
}
