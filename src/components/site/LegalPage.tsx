import type { ReactNode } from "react";
import { PageHero, SiteLayout } from "@/components/site/SiteLayout";

export function LegalPage({ title, intro, sections }: { title: string; intro: string; sections: { h: string; body: ReactNode }[] }) {
  return (
    <SiteLayout>
      <PageHero eyebrow="Informations légales" title={title} description={intro} />
      <section className="mx-auto max-w-4xl space-y-8 px-5 py-12 lg:px-8">
        {sections.map((s) => (
          <div key={s.h}>
            <h2 className="text-xl">{s.h}</h2>
            <div className="mt-3 space-y-2 text-justify text-sm leading-relaxed text-muted-foreground">{s.body}</div>
          </div>
        ))}
      </section>
    </SiteLayout>
  );
}
