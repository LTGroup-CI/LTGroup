UPDATE public.activities SET is_active = true, icon = 'map', position = 0, title = 'Vente de terrains',
  short_description = COALESCE(short_description, 'Terrains viabilisés et sécurisés, avec documents en règle, à Abidjan et dans ses environs.'),
  description = COALESCE(description, 'LT GROUP commercialise des terrains lotis et viabilisés, avec accompagnement administratif complet : visite, réservation, documents fonciers et suivi jusqu''à la remise.')
WHERE slug = 'vente-de-terrain';
UPDATE public.activities SET icon = 'droplets' WHERE slug = 'hydraulique';
UPDATE public.activities SET icon = 'ruler' WHERE slug = 'topographie-et-etudes';
UPDATE public.company_info SET whatsapp = '+225 07 49 22 47 22';