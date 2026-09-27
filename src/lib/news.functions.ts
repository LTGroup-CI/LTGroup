import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  title: z.string().trim().min(3).max(220),
  excerpt: z.string().trim().max(700).nullable().optional(),
  content: z.string().trim().min(3).max(30000),
  slug: z.string().trim().max(220),
});

const emojiPattern = /[\p{Extended_Pictographic}\p{Emoji_Presentation}\uFE0F\u20E3]/gu;

function removeUnwantedEmoji(value: string) {
  return value
    .replace(emojiPattern, "")
    .replace(/^[\s•·|*_#-]+$/gm, "")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 180);
}

function normalizeContent(value: string, title: string) {
  const cleanTitle = removeUnwantedEmoji(title).replace(/^#+\s*/, "").trim();
  const lines = removeUnwantedEmoji(value)
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.replace(/^\s*#{3,}\s*/, "## ").replace(/^\s*\*\*(.*?)\*\*\s*$/, "$1").trim())
    .filter((line) => !/^[-_=]{3,}$/.test(line));

  const result: string[] = [];
  for (const line of lines) {
    if (!line) {
      if (result[result.length - 1] !== "") result.push("");
      continue;
    }

    const normalized = line.replace(/^#+\s*/, "").trim();
    if (normalized.toLowerCase() === cleanTitle.toLowerCase()) continue;
    if (/^(?:light terra group|lt group)[\s\-–—:]*$/i.test(normalized)) continue;

    result.push(line);
  }

  return result.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

function fallback(input: z.infer<typeof schema>) {
  const title = removeUnwantedEmoji(input.title).replace(/^#+\s*/, "").trim();
  const body = normalizeContent(input.content, title);
  const paragraphs = body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

  return {
    title,
    excerpt: removeUnwantedEmoji(input.excerpt?.trim() || paragraphs[0] || title).replace(/\s+/g, " ").slice(0, 320),
    content: paragraphs.join("\n\n"),
    slug: slugify(input.slug || title),
  };
}

const outputSchema = z.object({
  title: z.string().min(3).max(220),
  excerpt: z.string().min(1).max(700),
  content: z.string().min(3).max(30000),
  slug: z.string().min(1).max(220),
});

export const optimizeNewsForPublication = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    const basic = fallback(data);
    const key = process.env["LOVABLE_API_KEY"];

    if (!key) {
      return { ok: true as const, optimized: false as const, ...basic };
    }

    const instructions = [
      "Tu es l’éditeur en chef numérique de LIGHT TERRA GROUP SARL.",
      "Ta mission est de transformer un brouillon brut en une vraie actualité professionnelle, moderne, claire, naturelle et agréable à lire.",
      "",
      "RÈGLES ÉDITORIALES OBLIGATOIRES :",
      "1. Réécris et structure le texte au lieu de simplement le corriger.",
      "2. Supprime tous les emojis, symboles décoratifs, hashtags, signatures inutiles, répétitions, slogans répétés, formules creuses et remplissage.",
      "3. Ne mets aucun emoji dans title, excerpt ou content. Même si le brouillon en contient, ils doivent disparaître.",
      "4. Ne répète jamais le titre dans le corps de l’article.",
      "5. Supprime le nom de l’entreprise lorsqu’il est répété inutilement en fin de texte.",
      "6. Améliore la grammaire, l’orthographe, la ponctuation, les transitions et le vocabulaire sans rendre le texte artificiel.",
      "7. Conserve strictement les faits fournis : lieux, surfaces, prix, références, coordonnées, dates, statuts, conditions, noms propres et informations techniques.",
      "8. N’invente jamais une disponibilité, une garantie, un titre foncier, une rentabilité, un délai, un prix, une superficie, un avantage juridique, une certification ou une promesse commerciale.",
      "9. Mets en avant l’intérêt du sujet uniquement à partir des informations réellement fournies. Pas de publicité agressive.",
      "10. Regroupe les informations proches et élimine les doublons.",
      "11. Le premier paragraphe doit servir d’introduction claire et donner immédiatement le contexte.",
      "12. Lorsque le contenu le justifie, organise ensuite l’article avec 2 à 5 intertitres courts. Utilise exactement le préfixe « ## » pour ces intertitres.",
      "13. Utilise « • » uniquement pour une courte liste de faits utiles : localisation, caractéristiques, conditions, contacts ou points clés. Pas de liste artificielle.",
      "14. Les coordonnées utiles présentes dans le brouillon doivent rester disponibles.",
      "15. Si un appel à l’action est pertinent, il doit rester factuel et utiliser uniquement les coordonnées fournies.",
      "16. Le résultat doit ressembler à un article publié par une entreprise professionnelle : hiérarchie claire, paragraphes aérés, phrases lisibles et ton humain.",
      "",
      "FORMAT DE SORTIE :",
      "Texte simple uniquement, sans HTML et sans Markdown gras/italique. Les seuls marqueurs autorisés sont « ## » pour les intertitres et « • » pour les listes factuelles.",
      "Une ligne vide entre les paragraphes.",
      "Réponds uniquement avec un JSON valide contenant title, excerpt, content et slug.",
      "",
      "TITRE : " + data.title,
      "RÉSUMÉ : " + (data.excerpt ?? ""),
      "BROUILLON :",
      data.content,
    ].join("\n");

    try {
      const response = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + key,
          "X-Lovable-AIG-SDK": "fetch",
        },
        body: JSON.stringify({
          model: "openai/gpt-6-astra",
          instructions,
          reasoning: { effort: "low" },
          store: false,
          input: [{ role: "user", content: "Prépare cette actualité pour publication." }],
        }),
      });

      if (!response.ok) throw new Error("AI gateway unavailable");

      const body = (await response.json()) as {
        output_text?: string;
        output?: Array<{ content?: Array<{ text?: string }> }>;
      };
      const raw =
        body.output_text ??
        body.output?.flatMap((x) => x.content ?? []).map((x) => x.text ?? "").join("") ??
        "";

      const cleaned = raw.trim().replace(/^\`\`\`json\s*/i, "").replace(/\s*\`\`\`$/i, "");
      const parsed = outputSchema.parse(JSON.parse(cleaned));

      const title = removeUnwantedEmoji(parsed.title).replace(/^#+\s*/, "").trim();
      const content = normalizeContent(parsed.content, title);

      return {
        ok: true as const,
        optimized: true as const,
        title,
        excerpt: removeUnwantedEmoji(parsed.excerpt).replace(/\s+/g, " ").slice(0, 700),
        content,
        slug: slugify(parsed.slug || title),
      };
    } catch (error) {
      console.error("News AI optimization fallback", error);
      return { ok: true as const, optimized: false as const, ...basic };
    }
  });
