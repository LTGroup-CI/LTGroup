const DEFAULT_SUPABASE_URL = "https://ghkijyimotuivykvwlge.supabase.co";
const DEFAULT_SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdoa2lqeWltb3R1aXZ5a3Z3bGdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyNzAyMDYsImV4cCI6MjEwNTg0NjIwNn0.jR9CJTPUNM0GHWnB4i2GXaT5DHoWT6oXAmQL5UJ0q9Q";

export async function invokeLtgroupMail(
  action: string,
  payload: Record<string, unknown> = {},
  accessToken?: string,
) {
  const configuredUrl =
    process.env["SUPABASE_URL"] ??
    process.env["VITE_SUPABASE_URL"] ??
    "";
  const url = configuredUrl.trim() || DEFAULT_SUPABASE_URL;

  const configuredKey =
    process.env["SUPABASE_PUBLISHABLE_KEY"] ??
    process.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ??
    "";
  const key = configuredKey.trim() || DEFAULT_SUPABASE_PUBLISHABLE_KEY;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    apikey: key,
  };
  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

  const endpoint = new URL("/functions/v1/ltgroup-mail", url).toString();
  const response = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify({ action, ...payload }),
  });

  let data: Record<string, unknown> = {};
  try {
    data = (await response.json()) as Record<string, unknown>;
  } catch {
    data = {};
  }

  if (!response.ok || data["ok"] === false) {
    throw new Error(String(data["message"] || `Service e-mail indisponible (HTTP ${response.status}).`));
  }

  return data;
}
