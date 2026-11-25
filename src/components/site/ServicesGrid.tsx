import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SERVICES } from "@/content/services";

export function ServicesGrid({ detailed = false, compact = false }: { detailed?: boolean; compact?: boolean }) {
  if (compact) {
    return (
      <div className="grid gap-x-10 md:grid-cols-2 md:gap-x-12">
        {SERVICES.map((s) => (
          <Link
            key={s.n}
            to="/services"
            className="group flex min-w-0 items-center gap-4 border-b border-border/80 py-5 transition-colors hover:border-gold/70 sm:gap-5 sm:py-6"
          >
            <span className="w-8 shrink-0 font-display text-sm tracking-[0.12em] text-gold-deep/80 sm:w-9">{s.n}</span>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-gold-deep transition duration-300 group-hover:border-gold/50 group-hover:bg-accent sm:h-12 sm:w-12">
              <s.icon className="h-5 w-5 sm:h-[1.35rem] sm:w-[1.35rem]" />
            </span>
            <span className="min-w-0 flex-1 py-1">
              <span className="block text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-gold-deep sm:text-lg">{s.title}</span>
              <span className="mt-1 block text-xs leading-relaxed text-muted-foreground sm:text-sm">{s.text}</span>
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground/60 transition duration-300 group-hover:translate-x-1 group-hover:text-gold-deep" />
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 xl:grid-cols-5">
      {SERVICES.map((s) => (
        <article key={s.n} className="group relative flex min-w-0 flex-col bg-card p-6 transition duration-500 hover:-translate-y-1 hover:bg-accent/40 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <span className="font-display text-4xl leading-none text-gold/70 transition group-hover:text-gold sm:text-5xl">{s.n}</span>
            <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent text-gold-deep transition group-hover:bg-gold group-hover:text-ink">
              <s.icon className="h-6 w-6" />
            </span>
          </div>
          <h3 className="mt-5 text-lg transition-colors group-hover:text-gold-deep sm:text-xl">{s.title}</h3>
          {!compact && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.text}</p>}
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
    <div className="mt-9 flex justify-center sm:justify-start">
      <Link to="/services" className="inline-flex min-h-11 items-center gap-2 rounded-md border border-border px-5 py-2.5 text-sm font-semibold transition-colors hover:border-gold hover:bg-accent">
        Explorer nos expertises <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
