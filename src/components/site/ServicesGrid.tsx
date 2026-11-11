import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SERVICES } from "@/content/services";

export function ServicesGrid({ detailed = false }: { detailed?: boolean }) {
  return (
    <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
      {SERVICES.map((s) => (
        <article key={s.n} className="group relative flex min-w-0 flex-col bg-card p-6 transition duration-300 hover:bg-accent/40 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <span className="font-display text-4xl leading-none text-gold/70 transition group-hover:text-gold sm:text-5xl">{s.n}</span>
            <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent text-gold-deep transition group-hover:bg-gold group-hover:text-ink">
              <s.icon className="h-6 w-6" />
            </span>
          </div>
          <h3 className="mt-5 text-lg sm:text-xl">{s.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
          {detailed && (
            <ul className="mt-4 space-y-1.5 text-sm">
              {s.points.map((p) => (
                <li key={p} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />{p}</li>
              ))}
            </ul>
          )}
          <span className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gold transition duration-300 group-hover:scale-x-100" />
        </article>
      ))}
    </div>
  );
}

export function ServicesCta() {
  return (
    <div className="mt-8 flex flex-wrap gap-3">
      <Link to="/services" className="inline-flex items-center rounded-md border border-border px-5 py-2.5 text-sm font-semibold hover:border-gold">
        Voir tous nos services <ArrowRight className="ml-2 h-4 w-4" />
      </Link>
    </div>
  );
}
