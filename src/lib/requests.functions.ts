import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const schema = z.object({
  request_type: z.enum(["contact", "devis"]),
  full_name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  subject: z.string().trim().max(200).optional().or(z.literal("")),
  project_type: z.string().trim().max(120).optional().or(z.literal("")),
  budget_range: z.string().trim().max(120).optional().or(z.literal("")),
  desired_date: z.string().trim().max(20).optional().or(z.literal("")),
  message: z.string().trim().min(5).max(5000),
});

const NOTIFY_TO = "contact@ltgroup-ci.com";
const NOTIFY_LIST = ["lightterragroup@gmail.com", "raissaamon@ltgroup-ci.com", "contact@ltgroup-ci.com"];
const DEFAULT_SUPABASE_URL = "https://ghkijyimotuivykvwlge.supabase.co";
const DEFAULT_SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdoa2lqeWltb3R1aXZ5a3Z3bGdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyNzAyMDYsImV4cCI6MjEwNTg0NjIwNn0.jR9CJTPUNM0GHWnB4i2GXaT5DHoWT6oXAmQL5UJ0q9Q";

export const submitRequest = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    const url =
      process.env["SUPABASE_URL"] ??
      process.env["VITE_SUPABASE_URL"] ??
      DEFAULT_SUPABASE_URL;
    const key =
      process.env["SUPABASE_PUBLISHABLE_KEY"] ??
      process.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ??
      DEFAULT_SUPABASE_PUBLISHABLE_KEY;

    const client = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const h = new Headers(init?.headers);
          if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
            h.delete("Authorization");
          }
          h.set("apikey", key);
          return fetch(input, { ...init, headers: h });
        },
      },
    });

    const row = {
      request_type: data.request_type,
      full_name: data.full_name,
      email: data.email,
      phone: data.phone || null,
      company: data.company || null,
      subject: data.subject || null,
      project_type: data.project_type || null,
      budget_range: data.budget_range || null,
      desired_date: data.desired_date ? data.desired_date : null,
      message: data.message,
      status: "nouveau",
    };

    const { error } = await client.from("messages").insert(row);
    if (error) {
      console.error("insert message error", error.message);
      return { ok: false as const, message: "L'envoi a échoué. Merci de réessayer." };
    }

    const apiKey = process.env["RESEND_API_KEY"];
    if (apiKey) {
      const from = process.env["RESEND_FROM_EMAIL"] ?? "LT GROUP <assistance@ltgroup-ci.com>";
      const subject =
        data.request_type === "devis"
          ? `Nouvelle demande de devis — ${data.full_name}`
          : `Nouveau message — ${data.full_name}`;
      const lines = [
        `Nom : ${data.full_name}`,
        `E-mail : ${data.email}`,
        data.phone ? `Téléphone : ${data.phone}` : "",
        data.company ? `Structure : ${data.company}` : "",
        data.project_type ? `Type de projet : ${data.project_type}` : "",
        data.budget_range ? `Budget : ${data.budget_range}` : "",
        data.desired_date ? `Date souhaitée : ${data.desired_date}` : "",
        "",
        data.message,
      ].filter(Boolean);
      try {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            from,
            to: NOTIFY_LIST,
            reply_to: data.email,
            subject,
            text: lines.join("\n"),
          }),
        });
        if (!res.ok) console.error("resend error", res.status, await res.text());
      } catch (e) {
        console.error("resend exception", e);
      }

      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
          body: JSON.stringify({
            from,
            to: [data.email],
            reply_to: NOTIFY_TO,
            subject: "Confirmation de votre demande — LT GROUP",
            text: `Bonjour ${data.full_name},\n\nNous confirmons la bonne réception de votre demande. L’équipe LT GROUP reviendra vers vous si nécessaire.\n\nLT GROUP — Light Terra Group\nBâtir la terre, éclairer l'avenir\n${NOTIFY_TO}`,
          }),
        });
      } catch (e) {
        console.error("resend visitor confirmation error", e);
      }
    }

    return { ok: true as const, message: "Votre demande a bien été envoyée. Un e-mail de confirmation vous a été adressé." };
  });
