import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

export function Breadcrumb({ section, to, current }: { section: string; to: "/actualites" | "/projets"; current: string }) {
  return (
    <nav aria-label="Fil d'Ariane" className="border-b border-border bg-muted/40">
      <ol className="mx-auto flex max-w-7xl min-w-0 items-center gap-1.5 px-5 py-3 text-xs text-muted-foreground lg:px-8">
        <li className="shrink-0"><Link to="/" className="hover:text-gold-deep">Accueil</Link></li>
        <ChevronRight className="h-3.5 w-3.5 shrink-0" />
        <li className="shrink-0"><Link to={to} className="hover:text-gold-deep">{section}</Link></li>
        <ChevronRight className="h-3.5 w-3.5 shrink-0" />
        <li className="min-w-0 truncate font-medium text-foreground" aria-current="page">{current}</li>
      </ol>
    </nav>
  );
}
