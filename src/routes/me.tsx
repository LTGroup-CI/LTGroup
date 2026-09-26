import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LOGO_URL } from "@/lib/media";
import { companyQuery } from "@/lib/site-data";

export const Route = createFileRoute("/me")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Espace réservé — LT GROUP" },
      { name: "description", content: "Accès réservé à l'équipe LT GROUP." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Espace réservé — LT GROUP" },
      { property: "og:description", content: "Accès réservé à l'équipe LT GROUP." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LoginPage,
});

const field =
  "mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring";

function LoginPage() {
  const navigate = useNavigate();
  const { data: company } = useQuery(companyQuery);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) void navigate({ to: "/admin" });
    });
  }, [navigate]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: String(fd.get("email") ?? "").trim(),
      password: String(fd.get("password") ?? ""),
    });
    setLoading(false);
    if (error) {
      toast.error("Identifiants incorrects.");
      return;
    }
    toast.success("Connexion réussie.");
    void navigate({ to: "/admin" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-gradient px-5 py-16">
      <div className="w-full max-w-md rounded-lg border border-gold/30 bg-card p-8 shadow-elevated">
        <img src={company?.logo_png_url || company?.logo_url || LOGO_URL} alt="LT GROUP" className="mx-auto h-16 w-auto" />
        <h1 className="mt-6 text-center text-2xl">Espace réservé</h1>
        <hr className="gold-rule mx-auto mt-4 w-16" />
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <label className="block text-sm">
            E-mail
            <input name="email" type="email" required autoComplete="email" className={field} />
          </label>
          <label className="block text-sm">
            Mot de passe
            <div className="relative mt-1">
              <input name="password" type={showPassword ? "text" : "password"} required autoComplete="current-password" className={field + " pr-10"} />
              <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"} className="absolute inset-y-0 right-0 inline-flex w-10 items-center justify-center text-muted-foreground hover:text-foreground">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </label>
          <Button type="submit" variant="gold" size="lg" disabled={loading} className="w-full">
            {loading ? "Connexion…" : "Se connecter"}
          </Button>
        </form>
      </div>
    </div>
  );
}
