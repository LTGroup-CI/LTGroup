import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { unsubscribeNewsletter } from "@/lib/newsletter.functions";

export const Route = createFileRoute("/desabonnement")({
  validateSearch: (s) => z.object({ id: z.string().optional() }).parse(s),
  head: () => ({
    meta: [
      { title: "Désabonnement newsletter — LIGHT TERRA GROUP" },
      { name: "description", content: "Se désabonner de la newsletter LIGHT TERRA GROUP." },
      { property: "og:title", content: "Désabonnement newsletter — LIGHT TERRA GROUP" },
      { property: "og:description", content: "Se désabonner de la newsletter LIGHT TERRA GROUP." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Page,
});

function Page() {
  const { id } = Route.useSearch();
  const unsubscribe = useServerFn(unsubscribeNewsletter);
  const [state, setState] = useState<"idle" | "pending" | "done" | "error">("idle");
  async function go() {
    if (!id) return;
    setState("pending");
    try { await unsubscribe({ data: { id } }); setState("done"); } catch { setState("error"); }
  }
  return (
    <SiteLayout>
      <PageHero eyebrow="Newsletter" title="Désabonnement" description="Gérez votre inscription à la newsletter LIGHT TERRA GROUP." />
      <section className="mx-auto max-w-2xl px-5 py-12 text-justify">
        {!id ? <p>Lien de désabonnement invalide.</p>
          : state === "done" ? <p>Vous êtes désabonné. Vous ne recevrez plus nos e-mails d'information.</p>
          : <>
              <p>Confirmez-vous ne plus vouloir recevoir la newsletter LIGHT TERRA GROUP ?</p>
              {state === "error" ? <p className="mt-3 text-destructive">Une erreur est survenue, réessayez.</p> : null}
              <Button className="mt-6" variant="gold" disabled={state === "pending"} onClick={go}>{state === "pending" ? "Traitement…" : "Me désabonner"}</Button>
            </>}
      </section>
    </SiteLayout>
  );
}
