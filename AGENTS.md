# LT GROUP — Repository guidance

This repository is maintained independently for LT GROUP by Inocent KOFFI.

## Rules
- Do not commit secrets, API keys, tokens, or `.env` files.
- Keep server credentials server-side only.
- Preserve the TanStack Start architecture and Vercel compatibility.
- Validate security-sensitive changes against Supabase RLS and server-side authorization.

- Build config uses @lovable.dev/vite-tanstack-config (nitro preset "vercel" only when VERCEL is set) — Lovable publishing requires output in dist/.
- Detail routes use the `name_.$slug.tsx` form so they are not nested inside the list page (which has no Outlet) — otherwise clicks change the URL but show the list.
