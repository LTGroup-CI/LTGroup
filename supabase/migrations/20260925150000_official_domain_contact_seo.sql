-- Canonical LT GROUP contact/domain data.
update public.company_info
set phone_primary = '+225 07 49 22 47 22',
    phone_secondary = '+225 07 07 74 14 84',
    whatsapp = '+225 07 49 22 47 22',
    email = 'contact@ltgroup-ci.com',
    website = 'https://ltgroup-ci.com';

update public.ai_knowledge
set answer = replace(replace(answer, 'contact@lightterragroup.com', 'contact@ltgroup-ci.com'), 'https://lightterragroup.com', 'https://ltgroup-ci.com');
