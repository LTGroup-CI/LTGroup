import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { invokeLtgroupMail } from "@/lib/edge-mail";

const signupSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().min(6).max(40),
});

const notifySchema = z.object({
  accessToken: z.string().min(20),
  newsId: z.string().uuid(),
});

export const subscribeNewsletter = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => signupSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      const result = await invokeLtgroupMail("newsletter_subscribe", {
        full_name: data.fullName,
        email: data.email.toLowerCase(),
        phone: data.phone,
      });

      return {
        ok: true as const,
        alreadySubscribed: Boolean(result.alreadySubscribed),
        welcomeSent: Boolean(result.welcomeSent),
        message: String(result.message || "Inscription confirmée."),
      };
    } catch (error) {
      console.error("Newsletter subscription error", error);
      return {
        ok: false as const,
        alreadySubscribed: false,
        welcomeSent: false,
        message:
          error instanceof Error
            ? error.message
            : "Service e-mail momentanément indisponible. Merci de réessayer plus tard.",
      };
    }
  });

export const notifyNewsSubscribers = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => notifySchema.parse(data))
  .handler(async ({ data }) => {
    try {
      const result = await invokeLtgroupMail(
        "newsletter_broadcast",
        { news_id: data.newsId },
        data.accessToken,
      );
      return {
        ok: true as const,
        sent: Number(result.sent || 0),
        skipped: Boolean(result.skipped),
      };
    } catch (error) {
      console.error("Newsletter broadcast error", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Envoi de la newsletter impossible.",
      );
    }
  });

export const unsubscribeNewsletter = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    // Désabonnement public : on conserve ce flux côté serveur avec la table
    // exposée uniquement selon ses politiques RLS.
    const { createClient } = await import("@supabase/supabase-js");
    const url =
      process.env["SUPABASE_URL"] ??
      process.env["VITE_SUPABASE_URL"] ??
      "https://ghkijyimotuivykvwlge.supabase.co";
    const key =
      process.env["SUPABASE_PUBLISHABLE_KEY"] ??
      process.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ??
      "";
    if (!key) throw new Error("Configuration Supabase publique manquante.");

    const db = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { error } = await db
      .from("newsletter_subscribers")
      .update({ status: "unsubscribed" })
      .eq("id", data.id);

    if (error) throw new Error("Désabonnement impossible.");
    return { ok: true as const };
  });
