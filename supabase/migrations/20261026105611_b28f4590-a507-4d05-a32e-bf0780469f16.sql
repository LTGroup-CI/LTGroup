do $$
declare t text; c text;
begin
  for t, c in select table_name, column_name from information_schema.columns
    where table_schema='public' and table_name in ('company_info','hero_slides','intro_videos','activities','projects','news','media_items','partners')
      and (column_name like '%url%' or column_name='media_urls')
  loop
    execute format($f$update public.%I set %I = (
      replace(replace(replace(replace(replace(replace(replace(replace(
        %I::text,
        'https://raw.githubusercontent.com/LTGroup-CI/LTGroup/main/src/assets/', '/media/hero/'),
        'https://ghkijyimotuivykvwlge.supabase.co/storage/v1/object/public/site-media/brand/logo.jpg?v=1790343360452', '/media/logo.jpg'),
        'https://ghkijyimotuivykvwlge.supabase.co/storage/v1/object/public/site-media/brand/logo.png?v=1790343360452', '/media/logo.png'),
        'https://ghkijyimotuivykvwlge.supabase.co/storage/v1/object/public/site-media/media/LT-Group-dabou-d3b93eae-6e4b-463a-9a31-555c2cafe560.png', '/media/content/lt-group-dabou.jpg'),
        'https://ghkijyimotuivykvwlge.supabase.co/storage/v1/object/public/site-media/news/LT-Group-dabou-2d51a683-3d6e-416a-b0b1-e782e34484eb.png', '/media/content/lt-group-dabou.jpg'),
        'https://ghkijyimotuivykvwlge.supabase.co/storage/v1/object/public/site-media/projects/LT-Group-dabou-c397cfc5-64f9-4d83-88f8-f5fe53ddc537.png', '/media/content/lt-group-dabou.jpg'),
        'https://ghkijyimotuivykvwlge.supabase.co/storage/v1/object/public/site-media/media/LT-Group-7f347a4e-7948-479a-8a0f-a4011329c0e1.png', '/media/content/lt-group-assinie.jpg'),
        'https://ghkijyimotuivykvwlge.supabase.co/storage/v1/object/public/site-media/news/LT-Group-e6c9f45e-7d65-469d-942c-12f58f2fd406.png', '/media/content/lt-group-assinie.jpg')
    )::%s where %I is not null$f$, t, c, c,
      (select data_type from information_schema.columns where table_schema='public' and table_name=t and column_name=c), c);
  end loop;
end $$;

do $$
declare t text; c text; pairs text[][] := array[
  array['projects/LT-Group-9a07b2c8-0031-4530-b396-3a91747050cc.png','/media/content/lt-group-assinie.jpg'],
  array['media/WhatsApp-Video-2026-09-24-at-16-16-22-f9fc60b9-9029-4f39-aa78-dbfba9030919.mp4','/media/content/lt-group-video-1.mp4'],
  array['news/WhatsApp-Video-2026-09-24-at-16-16-22-22cef96e-7a78-4974-a64b-61bdad6d6c2d.mp4','/media/content/lt-group-video-1.mp4'],
  array['projects/WhatsApp-Video-2026-09-24-at-16-16-22-a7a3b887-e291-4d2b-8f83-7f0c92bfd7bd.mp4','/media/content/lt-group-video-1.mp4'],
  array['media/WhatsApp-Video-2026-09-24-at-19-56-04-d574b7f1-f7df-4705-9f6f-7b001f1433f1.mp4','/media/content/lt-group-video-2.mp4'],
  array['news/381285-118339f8-ec98-42ba-9607-91ccd1381e01.mp4','/media/content/lt-group-video-2.mp4'],
  array['projects/WhatsApp-Video-2026-09-24-at-19-56-04-eb3723ce-538c-4f3d-825d-62d690ab6339.mp4','/media/content/lt-group-video-2.mp4']
]; i int; dt text;
begin
  for t, c, dt in select table_name, column_name, data_type from information_schema.columns
    where table_schema='public' and table_name in ('company_info','hero_slides','intro_videos','activities','projects','news','media_items','partners')
      and (column_name like '%url%' or column_name='media_urls')
  loop
    for i in 1..array_length(pairs,1) loop
      execute format('update public.%I set %I = replace(%I::text, %L, %L)::%s where %I::text like %L', t, c, c,
        'https://ghkijyimotuivykvwlge.supabase.co/storage/v1/object/public/site-media/'||pairs[i][1], pairs[i][2], dt, c, '%'||pairs[i][1]||'%');
    end loop;
  end loop;
end $$;