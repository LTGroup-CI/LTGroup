import { withSupabase } from "npm:@supabase/server";

const LOGO_URL =
  "https://ghkijyimotuivykvwlge.supabase.co/storage/v1/object/public/site-media/brand/logo-email-fond-blanc.jpg";
const SITE_URL = "https://ltgroup-ci.com";
const NOTIFY_LIST = [
  "lightterragroup@gmail.com",
  "raissaamon@ltgroup-ci.com",
  "contact@ltgroup-ci.com",
];

type Payload = Record<string, unknown>;

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[c]!)
  );
}

function emailLayout(body: string) {
  return `<div style="margin:0;background:#f5f7f5;padding:32px;font-family:Arial,sans-serif;color:#17211d">
    <div style="max-width:680px;margin:auto;background:#fff;border-radius:18px;overflow:hidden;border:1px solid #e4e9e6">
      <div style="padding:24px 30px;background:#0b1f18;text-align:center">
        <img src="${LOGO_URL}" alt="LIGHT TERRA GROUP" width="200" style="display:inline-block;width:200px;max-width:70%;height:auto;background:#fff;border-radius:12px;padding:8px">
      </div>
      ${body}
    </div>
  </div>`;
}

function unsubscribeBlock(id: string) {
  const link = `${SITE_URL}/desabonnement?id=${encodeURIComponent(id)}`;
  return `<div style="margin-top:28px;padding-top:18px;border-top:1px solid #e4e9e6;text-align:center;font-size:12px;color:#8a938e">
    Vous recevez cet e-mail car vous êtes abonné à la newsletter LIGHT TERRA GROUP.<br>
    <a href="${link}" style="color:#a47a28">Se désabonner</a>
  </div>`;
}

async function sendResend(input: {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  unsubscribeId?: string;
}) {
  const key = Deno.env.get("RESEND_API_KEY");
  if (!key) throw new Error("RESEND_API_KEY n'est pas configurée dans Supabase Edge Functions.");

  const from = Deno.env.get("RESEND_FROM_EMAIL") || "LT GROUP <assistance@ltgroup-ci.com>";
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      from,
      to: Array.isArray(input.to) ? input.to : [input.to],
      subject: input.subject,
      html: input.unsubscribeId
        ? input.html.replace("</div></div>", `${unsubscribeBlock(input.unsubscribeId)}</div></div>`)
        : input.html,
      text: input.text,
      reply_to: input.replyTo,
      ...(input.unsubscribeId
        ? {
            headers: {
              "List-Unsubscribe": `<${SITE_URL}/desabonnement?id=${input.unsubscribeId}>`,
            },
          }
        : {}),
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Resend ${response.status}: ${detail.slice(0, 800)}`);
  }

  return await response.json();
}

export default {
  fetch: withSupabase({ auth: ["user", "publishable"] }, async (req, ctx) => {
    if (req.method !== "POST") {
      return Response.json({ ok: false, message: "Méthode non autorisée." }, { status: 405 });
    }

    try {
      const body = (await req.json()) as Payload;
      const action = String(body.action || "");

      if (action === "contact") {
        const fullName = String(body.full_name || "").trim();
        const email = String(body.email || "").trim().toLowerCase();
        const phone = String(body.phone || "").trim();
        const company = String(body.company || "").trim();
        const subject = String(body.subject || "").trim();
        const projectType = String(body.project_type || "").trim();
        const budgetRange = String(body.budget_range || "").trim();
        const desiredDate = String(body.desired_date || "").trim();
        const message = String(body.message || "").trim();
        const requestType = body.request_type === "devis" ? "devis" : "contact";

        if (fullName.length < 2 || !email.includes("@") || message.length < 5) {
          return Response.json({ ok: false, message: "Données de demande invalides." }, { status: 400 });
        }

        const db = ctx.supabaseAdmin;
        const { error: insertError } = await db.from("messages").insert({
          request_type: requestType,
          full_name: fullName,
          email,
          phone: phone || null,
          company: company || null,
          subject: subject || null,
          project_type: projectType || null,
          budget_range: budgetRange || null,
          desired_date: desiredDate || null,
          message,
          status: "nouveau",
        });
        if (insertError) throw new Error(insertError.message);

        const lines = [
          `Nom : ${fullName}`,
          `E-mail : ${email}`,
          phone ? `Téléphone : ${phone}` : "",
          company ? `Structure : ${company}` : "",
          projectType ? `Type de projet : ${projectType}` : "",
          budgetRange ? `Budget : ${budgetRange}` : "",
          desiredDate ? `Date souhaitée : ${desiredDate}` : "",
          "",
          message,
        ].filter(Boolean);

        const subjectLine =
          requestType === "devis"
            ? `Nouvelle demande de devis — ${fullName}`
            : `Nouveau message — ${fullName}`;

        await sendResend({
          to: NOTIFY_LIST,
          replyTo: email,
          subject: subjectLine,
          text: lines.join("\n"),
          html: emailLayout(
            `<div style="padding:34px"><p style="color:#a47a28;text-transform:uppercase;letter-spacing:2px;font-size:11px;font-weight:700">Nouvelle demande</p>
            <h1 style="font-size:27px;line-height:1.25;margin:10px 0 20px">${escapeHtml(subjectLine)}</h1>
            <div style="font-size:15px;line-height:1.8;color:#59635e">${lines.map((line) => `<div>${escapeHtml(line)}</div>`).join("")}</div></div>`
          ),
        });

        await sendResend({
          to: email,
          replyTo: "contact@ltgroup-ci.com",
          subject: "Confirmation de votre demande — LT GROUP",
          text: `Bonjour ${fullName},\n\nNous confirmons la bonne réception de votre demande. L’équipe LT GROUP reviendra vers vous si nécessaire.\n\nLT GROUP — Light Terra Group\nBâtir la terre, éclairer l'avenir\ncontact@ltgroup-ci.com`,
          html: emailLayout(
            `<div style="padding:34px"><p style="color:#a47a28;text-transform:uppercase;letter-spacing:2px;font-size:11px;font-weight:700">Confirmation</p>
            <h1 style="font-size:28px;margin:10px 0 16px">Bonjour ${escapeHtml(fullName)},</h1>
            <p style="font-size:16px;line-height:1.7;color:#59635e">Nous confirmons la bonne réception de votre demande. L’équipe LT GROUP reviendra vers vous si nécessaire.</p>
            <div style="margin-top:28px;padding:18px;background:#f5f7f5;border-radius:12px"><strong>LT GROUP — Light Terra Group</strong><br><span style="color:#59635e">Bâtir la terre, éclairer l'avenir</span></div></div>`
          ),
        });

        return Response.json({ ok: true, message: "Votre demande a bien été envoyée. Un e-mail de confirmation vous a été adressé." });
      }

      if (action === "newsletter_subscribe") {
        const fullName = String(body.full_name || "").trim();
        const email = String(body.email || "").trim().toLowerCase();
        const phone = String(body.phone || "").trim();
        if (fullName.length < 2 || !email.includes("@") || phone.length < 6) {
          return Response.json({ ok: false, message: "Informations d'inscription invalides." }, { status: 400 });
        }

        const db = adminClient(ctx);
        const { data: existing } = await db.from("newsletter_subscribers").select("*").eq("email", email).maybeSingle();

        if (existing?.welcome_sent_at && existing.status === "active") {
          return Response.json({ ok: true, alreadySubscribed: true, welcomeSent: false, message: "Cette adresse est déjà abonnée à la newsletter." });
        }

        const { data: subscriber, error } = await db.from("newsletter_subscribers").upsert({
          full_name: fullName,
          email,
          phone,
          status: "active",
          source: "website",
        }, { onConflict: "email" }).select("*").single();

        if (error || !subscriber) throw new Error(error?.message || "Inscription impossible.");

        if (subscriber.welcome_sent_at) {
          return Response.json({ ok: true, alreadySubscribed: true, welcomeSent: false, message: "Votre abonnement est déjà actif." });
        }

        const name = escapeHtml(fullName);
        await sendResend({
          to: email,
          subject: "Bienvenue dans la newsletter LT GROUP",
          unsubscribeId: subscriber.id,
          html: emailLayout(
            `<div style="padding:34px"><p style="color:#a47a28;text-transform:uppercase;letter-spacing:2px;font-size:11px;font-weight:700">Bienvenue</p>
            <h1 style="font-size:28px;margin:10px 0 16px">Bonjour ${name},</h1>
            <p style="font-size:16px;line-height:1.7;color:#59635e">Votre inscription à la newsletter LT GROUP est confirmée.</p>
            <p style="font-size:16px;line-height:1.7;color:#59635e">Vous recevrez nos principales actualités, opportunités et informations sur nos projets directement par e-mail.</p>
            <div style="margin-top:28px;padding:18px;background:#f5f7f5;border-radius:12px"><strong>LT GROUP</strong><br><span style="color:#59635e">Bâtir la terre, éclairer l'avenir</span></div></div>`
          ),
        });

        await db.from("newsletter_subscribers").update({ welcome_sent_at: new Date().toISOString(), status: "active" }).eq("id", subscriber.id);
        return Response.json({ ok: true, alreadySubscribed: false, welcomeSent: true, message: "Inscription confirmée. Un e-mail de bienvenue vient de vous être envoyé." });
      }

      if (action === "newsletter_broadcast") {
        if (ctx.authMode !== "user" || !ctx.userClaims?.sub) {
          return Response.json({ ok: false, message: "Session administrateur requise." }, { status: 401 });
        }

        const db = adminClient(ctx);
        const { data: role } = await db.from("user_roles").select("role").eq("user_id", ctx.userClaims.sub).eq("role", "admin").maybeSingle();
        if (!role) return Response.json({ ok: false, message: "Accès administrateur requis." }, { status: 403 });

        const newsId = String(body.news_id || "");
        const { data: news, error: newsError } = await db.from("news").select("id,title,slug,excerpt,content,cover_image_url,image_url,published_at,is_published").eq("id", newsId).maybeSingle();
        if (newsError || !news || !news.is_published) return Response.json({ ok: true, sent: 0, skipped: true });

        const { data: subscribers } = await db.from("newsletter_subscribers").select("id,email,full_name").eq("status", "active");
        let sent = 0;

        for (const subscriber of subscribers ?? []) {
          const { data: delivery, error: deliveryError } = await db.from("newsletter_deliveries").upsert({
            subscriber_id: subscriber.id,
            news_id: news.id,
            status: "pending",
          }, { onConflict: "subscriber_id,news_id", ignoreDuplicates: true }).select("id,status").maybeSingle();

          if (deliveryError || !delivery || delivery.status === "sent") continue;

          try {
            const link = `${SITE_URL}/actualites/${encodeURIComponent(news.slug)}`;
            const name = escapeHtml(subscriber.full_name);
            const title = escapeHtml(news.title);
            const excerpt = escapeHtml(news.excerpt || news.content?.slice(0, 260) || "");
            const visual = news.cover_image_url || news.image_url;
            await sendResend({
              to: subscriber.email,
              subject: `LT GROUP — ${news.title}`,
              unsubscribeId: subscriber.id,
              html: emailLayout(
                ` ${visual ? `<img src="${escapeHtml(visual)}" alt="" style="display:block;width:100%;height:280px;object-fit:cover">` : ""}
                <div style="padding:34px"><p style="color:#a47a28;text-transform:uppercase;letter-spacing:2px;font-size:11px;font-weight:700">Actualité LT GROUP</p>
                <h1 style="font-size:27px;line-height:1.25;margin:10px 0 16px">${title}</h1>
                <p style="font-size:16px;line-height:1.7;color:#59635e">Bonjour ${name},</p>
                <p style="font-size:16px;line-height:1.7;color:#59635e">${excerpt}</p>
                <a href="${link}" style="display:inline-block;margin-top:18px;background:#b58a3a;color:#fff;text-decoration:none;padding:13px 20px;border-radius:8px;font-weight:700">Lire l'actualité</a></div>`
              ),
            });
            await db.from("newsletter_deliveries").update({ status: "sent", sent_at: new Date().toISOString(), error_message: null }).eq("id", delivery.id);
            sent++;
          } catch (error) {
            await db.from("newsletter_deliveries").update({
              status: "failed",
              error_message: error instanceof Error ? error.message.slice(0, 500) : "Erreur d'envoi",
            }).eq("id", delivery.id);
          }
        }

        return Response.json({ ok: true, sent });
      }

      if (action === "assistant_confirmation") {
        const email = String(body.email || "").trim().toLowerCase();
        const fullName = String(body.full_name || "Visiteur").trim();
        if (!email.includes("@")) return Response.json({ ok: false, message: "E-mail invalide." }, { status: 400 });

        await sendResend({
          to: email,
          replyTo: "contact@ltgroup-ci.com",
          subject: "Votre demande a bien été prise en compte — LT GROUP",
          text: `Bonjour ${fullName},\n\nRaï, l’assistante virtuelle de LT GROUP, a bien enregistré vos informations. Notre équipe pourra reprendre votre demande si nécessaire.\n\nLT GROUP — Light Terra Group\nBâtir la terre, éclairer l'avenir\ncontact@ltgroup-ci.com`,
          html: emailLayout(
            `<div style="padding:34px"><h1 style="font-size:28px;margin:0 0 16px">Bonjour ${escapeHtml(fullName)},</h1><p style="font-size:16px;line-height:1.7;color:#59635e">Raï, l’assistante virtuelle de LT GROUP, a bien enregistré vos informations. Notre équipe pourra reprendre votre demande si nécessaire.</p></div>`
          ),
        });
        return Response.json({ ok: true });
      }

      return Response.json({ ok: false, message: "Action inconnue." }, { status: 400 });
    } catch (error) {
      console.error("ltgroup-mail error", error);
      return Response.json({
        ok: false,
        message: error instanceof Error ? error.message : "Service d'e-mail momentanément indisponible.",
      }, { status: 500 });
    }
  }),
};
