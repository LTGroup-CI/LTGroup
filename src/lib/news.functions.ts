import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  title: z.string().trim().min(3).max(220),
  excerpt: z.string().trim().max(700).nullable().optional(),
  content: z.string().trim().min(3).max(30000),
  slug: z.string().trim().max(220),
});

function slugify(value: string) {
  return value.normalize("NFD").replace(/\\p{Diacritic}/gu, "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 180);
}

function fallback(input: z.infer<typeof schema>) {
  const title = input.title.replace(/^[\\s📍🏠📌📰✨🔔]+/u, "").trim();
  const text = input.content.replace(/\\r\\n?/g, "\\n").replace(/[ \\t]+/g, " ").replace(/\\n{3,}/g, "\\n\\n").trim();
  const body = text.replace(/^(?:LIGHT TERRA GROUP|LT GROUP)[\\s\\-–—:]*$/gim, "").replace(/^\\s*[📍🏠📌📰✨🔔☎️📞📐📜💰🪙]+\\s*/gmu, "").trim();
  const paragraphs = body.split(/\\n\\s*\\n/).map((p) => p.trim()).filter(Boolean);
  return { title, excerpt: (input.excerpt?.trim() || paragraphs[0] || title).replace(/\\s+/g, " ").slice(0, 320), content: paragraphs.join("\\n\\n"), slug: slugify(input.slug || title) };
}

export const optimizeNewsForPublication = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    const basic = fallback(data);
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) return { ok: true as const, optimized: false as const, ...basic };
    const instructions = [
      "Tu es l’éditeur en chef numérique de LIGHT TERRA GROUP SARL.",
      "Transforme ce brouillon en actualité claire, élégante, humaine et commercialement attractive, sans inventer.",
      "Conserve tous les faits : lieux, surfaces, prix, références, coordonnées, dates, statuts et conditions.",
      "N’invente jamais disponibilité, garantie, titre, rentabilité, délai, prix, superficie, avantage juridique ou promesse.",
      "Supprime répétitions, signatures, slogans répétés, le nom de l’entreprise en pied de texte, emojis décoratifs et remplissage.",
      "Si le titre est répété dans le corps, supprime-le. Regroupe les informations proches.",
      "Garde les coordonnées utiles présentes. Français naturel, professionnel et chaleureux.",
      "Mets en valeur l’opportunité uniquement à partir des faits fournis. Pas de publicité agressive.",
      "Texte simple sans HTML. Une ligne vide entre paragraphes. Utilise « • » pour quelques faits clés si pertinent.",
      "Si pertinent, termine par un appel à l’action factuel utilisant uniquement les coordonnées présentes.",
      "Réponds UNIQUEMENT avec un JSON valide : {"title":"...","excerpt":"...","content":"...","slug":"..."}.",
      "",
      "TITRE : " + data.title,
      "RÉSUMÉ : " + (data.excerpt ?? ""),
      "BROUILLON :\\n" + data.content,
    ].join("\\n");
    try {
      const response = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}`, "X-Lovable-AIG-SDK": "fetch" },
        body: JSON.stringify({ model: "openai/gpt-6-astra", instructions, reasoning: { effort: "low" }, store: false, input: [{ role: "user", content: "Prépare cette actualité pour publication." }] }),
      });
      if (!response.ok) throw new Error("AI gateway unavailable");
      const body = await response.json() as { output_text?: string; output?: Array<{ content?: Array<{ text?: string }> }> };
      const raw = body.output_text ?? body.output?.flatMap((x) => x.content ?? []).map((x) => x.text ?? "").join("") ?? "";
      const cleaned = raw.trim().replace(/^```json\\s*/i, "").replace(/\\s*```$/i, "");
      const parsed = z.object({ title: z.string().min(3).max(220), excerpt: z.string().min(1).max(700), content: z.string().min(3).max(30000), slug: z.string().min(1).max(220) }).parse(JSON.parse(cleaned));
      return { ok: true as const, optimized: true as const, ...parsed, slug: slugify(parsed.slug || parsed.title) };
    } catch (error) {
      console.error("News AI optimization fallback", error);
      return { ok: true as const, optimized: false as const, ...basic };
    }
  });
