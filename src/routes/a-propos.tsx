import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Eye, Gem, Target, ShieldCheck, Workflow, MapPinned } from "lucide-react";

import { PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { companyQuery } from "@/lib/site-data";
import { OfficeMap } from "@/components/site/OfficeMap";

const title = "À propos de LIGHT TERRA GROUP SARL | Entreprise ivoirienne";
const description =
  "Découvrez LIGHT TERRA GROUP SARL, entreprise basée à Abidjan en Côte d’Ivoire, spécialisée dans le foncier, l’aménagement, la construction et les infrastructures.";

export const Route = createFileRoute("/a-propos")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://ltgroup-ci.com/media/og-light-terra.jpg" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: "https://ltgroup-ci.com/media/og-light-terra.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `https://ltgroup-ci.com${"/a-propos"}` }],
  }),
  component: Page,
});

const VALUES = [
  {
    icon: Target,
    title: "Notre mission",
    text: "Valoriser la terre et accompagner nos clients de l'étude à la livraison, avec des ouvrages fiables et durables.",
  },
  {
    icon: Eye,
    title: "Notre vision",
    text: "Devenir une référence en Côte d'Ivoire et dans la sous-région pour l'aménagement, la construction et l'énergie.",
  },
  {
    icon: Gem,
    title: "Nos valeurs",
    text: "Rigueur, transparence, respect des délais et proximité avec chaque client, du particulier à l'institution.",
  },
];

function Page() {
  const { data: company } = useQuery(companyQuery);

  return (
    <SiteLayout>
      <PageHero
        eyebrow="À propos"
        title="LIGHT TERRA GROUP SARL"
        description={company?.slogan ?? "Bâtir la terre, éclairer l'avenir"}
      />

      <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Qui sommes-nous</p>
            <h2 className="mt-3 text-3xl">Un groupe pluridisciplinaire</h2>
            <hr className="gold-rule mt-6 w-24" />
            <p className="mt-6 leading-relaxed text-muted-foreground">
              {company?.description ??
                "LT GROUP intervient sur toute la chaîne de valeur : identification et sécurisation du foncier, viabilisation, construction, promotion immobilière et infrastructures électriques."}
            </p>
            {company?.address ? (
              <p className="mt-6 text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">Siège social : </span>
                {[company.address, company.city, company.country].filter(Boolean).join(", ")}
              </p>
            ) : null}
          </div>

          <div className="grid gap-5">
            {VALUES.map((value) => (
              <article key={value.title} className="rounded-lg border border-border bg-card p-6">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-sm bg-accent text-gold-deep">
                  <value.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-xl">{value.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{value.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>



      <section className="bg-ink-gradient py-12 text-ink-foreground">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 lg:grid-cols-3 lg:px-8">
          <div className="lg:col-span-2">
            <p className="eyebrow text-gold">Notre manière de travailler</p>
            <h2 className="mt-3 max-w-3xl text-3xl lg:text-4xl">Une approche structurée, du terrain à la réalisation</h2>
            <p className="mt-6 max-w-3xl leading-8 text-ink-foreground/70">
              LT GROUP intervient dans un environnement où la qualité d’un projet dépend autant de la pertinence de l’opportunité que de la rigueur de sa préparation. Nous mettons donc l’accent sur l’identification du besoin, la lecture du terrain, la structuration des informations, la coordination des intervenants et le suivi des étapes clés.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {[
              [ShieldCheck, "Clarté documentaire", "Présenter les informations disponibles de façon organisée et compréhensible."],
              [Workflow, "Coordination", "Faire dialoguer foncier, études, travaux et partenaires autour d’un même objectif."],
              [MapPinned, "Ancrage local", "Concevoir des réponses adaptées aux réalités des territoires ivoiriens."]
            ].map(([Icon, title, text]) => {
              const I = Icon as typeof ShieldCheck;
              return <div key={String(title)} className="rounded-xl border border-white/10 bg-white/5 p-5"><I className="h-6 w-6 text-gold" /><h3 className="mt-3 font-semibold">{String(title)}</h3><p className="mt-2 text-sm leading-relaxed text-ink-foreground/60">{String(text)}</p></div>;
            })}
          </div>
        </div>
      </section>
      <section className="bg-muted/50 py-12">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-2 lg:px-8">
          <div className="rounded-lg border border-border bg-card p-8">
            <p className="eyebrow">Fiche entreprise</p>
            <h2 className="mt-3 text-2xl">LIGHT TERRA GROUP SARL</h2>
            <dl className="mt-6 space-y-3 text-sm">
              {[
                ["Activité", "Aménagement foncier, BTP, immobilier, énergie"],
                ["Siège social", [company?.address, company?.city, company?.country].filter(Boolean).join(", ")],
                ["Boîte postale", company?.postal_box],
                ["Téléphone", [company?.phone_primary, company?.phone_secondary].filter(Boolean).join(" / ")],
                ["WhatsApp", company?.whatsapp],
                ["E-mail", company?.email],
                ["Horaires", company?.opening_hours],
                ["Site web", company?.website],
              ]
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[130px_1fr] gap-3 border-b border-border pb-3">
                    <dt className="font-semibold">{k}</dt>
                    <dd className="text-muted-foreground">{v}</dd>
                  </div>
                ))}
            </dl>
            <Link to="/contact" className="mt-6 inline-flex font-semibold underline">Nous contacter →</Link>
          </div>
          <div>
            <p className="eyebrow">Nous trouver</p>
            <OfficeMap className="h-96" />
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
