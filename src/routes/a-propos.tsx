import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Eye, Gem, Target } from "lucide-react";

import { PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { companyQuery } from "@/lib/site-data";

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
      { property: "og:url", content: "https://ltgroup-ci.com/a-propos" },
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
            <p className="mt-6 text-justify leading-relaxed text-muted-foreground">
              {company?.description ??
                "LT GROUP intervient sur toute la chaîne de valeur : identification et sécurisation du foncier, viabilisation, construction, promotion immobilière et infrastructures électriques."}
            </p>
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



      <section className="bg-muted/50 py-12">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 lg:grid-cols-[1.2fr_1fr] lg:px-8">
          <div className="min-w-0 rounded-lg border border-border bg-card p-6 sm:p-8">
            <p className="eyebrow">Identité de l'entreprise</p>
            <h2 className="mt-3 text-2xl">LIGHT TERRA GROUP SARL</h2>
            <dl className="mt-6 space-y-3 text-sm">
              {[
                ["Raison sociale", "LIGHT TERRA GROUP SARL"],
                ["Nom commercial", "LT GROUP"],
                ["Forme juridique", "Société à responsabilité limitée (SARL)"],
                ["Implantation", [company?.city, company?.country].filter(Boolean).join(", ") || "Abidjan, Côte d'Ivoire"],
                ["Domaines", "9 services, des études à la sécurité électronique"],
              ].map(([k, v]) => (
                <div key={k} className="grid gap-1 border-b border-border pb-3 sm:grid-cols-[150px_1fr] sm:gap-3">
                  <dt className="font-semibold">{k}</dt>
                  <dd className="text-muted-foreground">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="flex min-w-0 flex-col justify-center rounded-lg bg-ink-gradient p-6 text-ink-foreground sm:p-8">
            <p className="eyebrow text-gold">Aller plus loin</p>
            <h2 className="mt-3 text-2xl">Découvrez ce que nous faisons et où nous trouver</h2>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/services" className="rounded-md bg-gold px-5 py-2.5 text-sm font-semibold text-ink">Nos 9 services</Link>
              <Link to="/projets" className="rounded-md border border-gold/50 px-5 py-2.5 text-sm font-semibold">Nos projets</Link>
              <Link to="/contact" className="rounded-md border border-gold/50 px-5 py-2.5 text-sm font-semibold">Coordonnées et plan</Link>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
