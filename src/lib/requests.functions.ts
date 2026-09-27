import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { invokeLtgroupMail } from "@/lib/edge-mail";

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

export const submitRequest = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    try {
      const result = await invokeLtgroupMail("contact", {
        request_type: data.request_type,
        full_name: data.full_name,
        email: data.email,
        phone: data.phone || "",
        company: data.company || "",
        subject: data.subject || "",
        project_type: data.project_type || "",
        budget_range: data.budget_range || "",
        desired_date: data.desired_date || "",
        message: data.message,
      });

      return {
        ok: true as const,
        message:
          String(result["message"]) ||
          "Votre demande a bien été envoyée. Un e-mail de confirmation vous a été adressé.",
      };
    } catch (error) {
      console.error("LT GROUP mail request error", error);
      return {
        ok: false as const,
        message:
          error instanceof Error
            ? error.message
            : "L'envoi a échoué. Merci de réessayer.",
      };
    }
  });
