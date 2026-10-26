import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import snapshot from "@/content/snapshot.json";

// Copie locale du contenu (textes + chemins de médias servis par le site).
// Si la base ne répond pas (quota, panne), le site affiche cette copie.
type SnapTable = keyof typeof snapshot;
const STORAGE_PREFIX = /https:\/\/[a-z0-9]+\.supabase\.co\/storage\/v1\/object\/public\/site-media\//;
const LOCAL_MEDIA: Array<[RegExp, string]> = [
  [/brand\/logo\.jpg/, "/media/logo.jpg"],
  [/brand\/logo\.png/, "/media/logo.png"],
  [/dabou/i, "/media/content/lt-group-dabou.jpg"],
  [/7f347a4e|e6c9f45e|9a07b2c8/, "/media/content/lt-group-assinie.jpg"],
  [/16-16-22/, "/media/content/lt-group-video-1.mp4"],
  [/19-56-04|381285/, "/media/content/lt-group-video-2.mp4"],
];
function localize<T>(value: T): T {
  const json = JSON.stringify(value ?? null).replace(/https:\/\/[^"\\]+/g, (url) => {
    if (!STORAGE_PREFIX.test(url)) return url;
    for (const [re, local] of LOCAL_MEDIA) if (re.test(url)) return local;
    return url;
  });
  return JSON.parse(json) as T;
}
function snap<T>(table: SnapTable, filter: (row: any) => boolean = () => true): T {
  return localize((snapshot[table] as any[]).filter(filter)) as T;
}
async function withFallback<T>(run: () => Promise<T>, fallback: () => T): Promise<T> {
  try {
    const result = await Promise.race([
      run(),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error("timeout")), 6000)),
    ]);
    if (Array.isArray(result) && result.length === 0) {
      const fb = fallback();
      if (Array.isArray(fb) && fb.length > 0) return fb;
    }
    if (result === null || result === undefined) return fallback();
    return localize(result);
  } catch {
    return fallback();
  }
}
const byPos = (a: any, b: any) => (a.position ?? 0) - (b.position ?? 0);

export type CompanyInfo = {
  id: string;
  name: string;
  slogan: string;
  description: string | null;
  phone_primary: string | null;
  phone_secondary: string | null;
  whatsapp: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  opening_hours: string | null;
  website: string | null;
  facebook_url: string | null;
  linkedin_url: string | null;
  instagram_url: string | null;
  logo_url: string | null;
  logo_png_url: string | null;
  postal_box?: string | null;
  logo_jpg_url: string | null;
};

export type HeroSlide = {
  id: string;
  title: string | null;
  subtitle: string | null;
  image_url: string;
  cta_label: string | null;
  cta_url: string | null;
  duration_ms: number;
  position: number;
  is_active: boolean;
};

export type IntroVideo = {
  id: string;
  label: string;
  video_url: string;
  position: number;
  is_active: boolean;
  placement: "hero_intro" | "home_showcase";
  title: string | null;
  description: string | null;
  cta_label: string | null;
  cta_url: string | null;
};

export type Activity = {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  description: string | null;
  icon: string | null;
  image_url: string | null;
  cover_image_url: string | null;
  media_urls: Array<{ url: string; kind?: "photo" | "video"; poster?: string | null }>;
  position: number;
  is_active: boolean;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  content: string | null;
  image_url: string | null;
  cover_image_url: string | null;
  media_urls: Array<{ url: string; kind?: "photo" | "video"; poster?: string | null }>;
  category: string | null;
  location: string | null;
  status: string;
  is_featured: boolean;
  is_published: boolean;
  position: number;
};

export type NewsItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  image_url: string | null;
  cover_image_url: string | null;
  author: string | null;
  published_at: string | null;
  is_published: boolean;
  view_count: number;
  created_at: string;
  video_url: string | null;
  video_poster_url: string | null;
  media_urls: Array<{ url: string; kind?: "photo" | "video"; poster?: string | null }>;
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  category: string;
  position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export const faqItemsQuery = queryOptions({
  queryKey: ["faq_items", "public"],
  queryFn: async (): Promise<FaqItem[]> =>
    unwrap(
      await supabase
        .from("faq_items")
        .select("*")
        .eq("is_active", true)
        .order("position", { ascending: true }),
    ),
  staleTime: 60_000,
});

export type Partner = {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  position: number;
  is_active: boolean;
};

export type Testimonial = {
  id: string;
  author_name: string;
  author_role: string | null;
  company: string | null;
  message: string;
  rating: number | null;
  status: string;
  is_published: boolean;
  created_at: string;
};

const unwrap = <T,>(result: { data: T | null; error: { message: string } | null }): T => {
  if (result.error) throw new Error(result.error.message);
  return (result.data ?? []) as T;
};

export const companyQuery = queryOptions({
  queryKey: ["company_info"],
  queryFn: async (): Promise<CompanyInfo | null> => {
    const { data, error } = await supabase
      .from("company_info")
      .select("*")
      .limit(1)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data as CompanyInfo | null;
  },
  staleTime: 60_000,
});

export const heroSlidesQuery = queryOptions({
  queryKey: ["hero_slides", "public"],
  queryFn: async (): Promise<HeroSlide[]> =>
    unwrap(
      await supabase
        .from("hero_slides")
        .select("*")
        .eq("is_active", true)
        .order("position", { ascending: true }),
    ),
});

export const introVideosQuery = queryOptions({
  queryKey: ["intro_videos", "hero_intro"],
  queryFn: async (): Promise<IntroVideo[]> => {
    const rows = unwrap(
      await supabase
        .from("intro_videos")
        .select("*")
        .eq("is_active", true)
        .eq("placement", "hero_intro")
        .order("position", { ascending: true }),
    );
    return rows.map((row) => ({ ...row, placement: row.placement as IntroVideo["placement"] }));
  },
});

export const showcaseVideosQuery = queryOptions({
  queryKey: ["intro_videos", "home_showcase"],
  queryFn: async (): Promise<IntroVideo[]> => {
    const rows = unwrap(
      await supabase
        .from("intro_videos")
        .select("*")
        .eq("is_active", true)
        .eq("placement", "home_showcase")
        .order("position", { ascending: true }),
    );
    return rows.map((row) => ({ ...row, placement: row.placement as IntroVideo["placement"] }));
  },
});

export const activitiesQuery = queryOptions({
  queryKey: ["activities", "public"],
  queryFn: async (): Promise<Activity[]> =>
    (unwrap as (r: unknown) => Activity[])(
      await supabase
        .from("activities")
        .select("*")
        .eq("is_active", true)
        .order("position", { ascending: true }),
    ),
});

export const activityItemQuery = (slug: string) =>
  queryOptions({
    queryKey: ["activities", "public", slug],
    queryFn: async (): Promise<Activity | null> => {
      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .maybeSingle();
      if (error) throw new Error(error.message);
      return data as Activity | null;
    },
  });

export const projectsQuery = queryOptions({
  queryKey: ["projects", "public"],
  queryFn: async (): Promise<Project[]> =>
    (unwrap as (r: unknown) => Project[])(
      await supabase
        .from("projects")
        .select("*")
        .eq("is_published", true)
        .order("position", { ascending: true }),
    ),
});

export const newsListQuery = queryOptions({
  queryKey: ["news", "public"],
  queryFn: async (): Promise<NewsItem[]> =>
    (unwrap as (r: unknown) => NewsItem[])(
      await supabase
        .from("news")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false }),
    ),
});

export const newsItemQuery = (slug: string) =>
  queryOptions({
    queryKey: ["news", "public", slug],
    queryFn: async (): Promise<NewsItem | null> => {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();
      if (error) throw new Error(error.message);
      return data as NewsItem | null;
    },
  });

export const projectItemQuery = (slug: string) =>
  queryOptions({
    queryKey: ["projects", "public", slug],
    queryFn: async (): Promise<Project | null> => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();
      if (error) throw new Error(error.message);
      return data as Project | null;
    },
  });

export const partnersQuery = queryOptions({
  queryKey: ["partners", "public"],
  queryFn: async (): Promise<Partner[]> =>
    unwrap(
      await supabase
        .from("partners")
        .select("*")
        .eq("is_active", true)
        .order("position", { ascending: true }),
    ),
});

export const testimonialsQuery = queryOptions({
  queryKey: ["testimonials", "public"],
  queryFn: async (): Promise<Testimonial[]> =>
    unwrap(
      await supabase
        .from("testimonials")
        .select("*")
        .eq("is_published", true)
        .eq("status", "valide")
        .order("created_at", { ascending: false }),
    ),
});

export function formatDateFr(value: string | null | undefined) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export type MediaItem = {
  id: string;
  kind: string;
  title: string | null;
  description: string | null;
  url: string;
  poster_url: string | null;
  position: number;
  is_active: boolean;
};

export const mediaItemsQuery = queryOptions({
  queryKey: ["media_items", "public"],
  queryFn: async (): Promise<MediaItem[]> =>
    unwrap(
      await supabase
        .from("media_items")
        .select("*")
        .eq("is_active", true)
        .order("position", { ascending: true }),
    ),
});
