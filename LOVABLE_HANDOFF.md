# LT GROUP — dossier de reprise pour Lovable et développeurs

Date : 25 novembre 2026
Dépôt officiel : https://github.com/LTGroup-CI/LTGroup
Branche de référence : main
Production : https://ltgroup-ci.com
Dernier déploiement vérifié : commit 890c2aaed19aefb8b7311fa97d7c43f211163c5b, Vercel READY.

> Lire ce document, AGENTS.md, README.md et roadmap.md avant toute modification. Les anciens plans dans .lovable/plan/ sont des historiques de demandes, pas des preuves de réalisation.

## 1. Objectif validé

Le client demande une refonte complète, immersive, premium et professionnelle de l'ensemble du site LIGHT TERRA GROUP SARL, avec animations élégantes, images de qualité adaptées au contexte ivoirien, expérience responsive desktop/tablette/mobile, et conservation des fonctionnalités existantes.

Palette : or du logo, noir profond, blanc cassé et tons clairs. Le noir sert aux contrastes et sections fortes ; ne pas rendre tout le site uniformément sombre. Respecter la charte du logo. Ne pas modifier globalement les polices ni remplacer massivement les visuels sans raison. Les images illustratives ne doivent jamais être présentées comme des chantiers réels. Pour les projets, privilégier les médias authentiques administrés par l'équipe.

## 2. Stack et règles d'architecture

- React 19, TypeScript, Vite 8, TanStack Start/Router, TanStack Query.
- Supabase (Auth, base, Storage), Resend via Supabase Edge Function, Vercel.
- Bun 1.3.10 ; Node 24.x (package.json).
- vite.config.ts utilise @lovable.dev/vite-tanstack-config. Il intègre déjà TanStack Start, React, Tailwind, tsconfig paths et Nitro. Ne pas ajouter ces plugins une seconde fois.
- Lovable doit conserver la sortie dist/. Le preset Vercel est activé conditionnellement à VERCEL.
- Routes file-based dans src/routes/. Ne pas créer de structure Next.js/Remix. Ne pas éditer routeTree.gen.ts à la main.
- Routes détail au format nom_.$slug.tsx pour éviter une imbrication sans Outlet.
- Contenus de secours : src/content/snapshot.json et médias sous public/media/. Ne pas supprimer ces fallbacks.

Commandes : bun install ; bun run dev ; bun run lint ; bun run build.

## 3. Pages et navigation

Menu principal : Accueil, Expertises, Projets & Terrains, Le Groupe, Contact, plus bouton devis. Actualités, Témoignages et FAQ sont accessibles depuis le pied de page.

Routes présentes : /, /services, /projets, /projets/:slug, /a-propos, /actualites, /actualites/:slug, /activites, /activites/:slug, /temoignages, /faq, /contact, /mentions-legales, /confidentialite, /desabonnement et /admin.

Chaque carte projet, actualité ou activité doit ouvrir sa fiche individuelle. Cela doit marcher aussi automatiquement pour les nouveaux enregistrements créés depuis l'admin. Tester clic, URL directe et rafraîchissement navigateur en production.

## 4. Expertises et contenu

Les dix expertises officielles sont définies dans src/content/services.ts, dans cet ordre : 1 Études ; 2 Aménagement foncier ; 3 Promotion immobilière ; 4 Adduction d'eau potable ; 5 Électrification HTA/MT/BT/EP ; 6 BTP ; 7 VRD ; 8 Réseau télécom ; 9 Sécurité électronique ; 10 Gestion immobilière.

Accueil : hero, chiffres clés, aperçu compact des expertises, activités, vidéos, engagements, un projet phare, actualités récentes si disponibles, newsletter et CTA. Il oriente vers les pages détaillées sans dupliquer leur contenu.

Coordonnées fournies : +225 07 49 22 47 22 ; +225 07 07 74 14 84 ; fixe 27 22 42 26 27 ; WhatsApp unique +225 07 49 22 47 22 ; contact@ltgroup-ci.com. Localisation : Abidjan, Cocody, Akouédo extension sud-est. GPS : 5°20'58.3"N, 3°55'26.5"W. Nom exact sur la carte : LIGHT TERRA GROUP SARL.

IMPORTANT : l'adresse complète est contradictoire dans les anciens documents : Lot 637, îlot 60, 01 BP 2259 Abidjan 01 et Lot 640, îlot 60. Ne pas choisir arbitrairement ; demander confirmation. Aucun prix ne doit être affiché pour les terrains de Dabou sans instruction explicite.

## 5. Médias et homepage

Les visuels de slides sont dans src/assets/hero-*.jpg. Médias locaux dans public/media/. Les contenus administrables sont récupérés via src/lib/site-data.ts. La copie src/content/snapshot.json sert de secours si Supabase échoue.

Le hero dispose de slides et d'une vidéo d'introduction. Les vidéos gérées depuis l'admin doivent alimenter la section de présentation des opportunités et réalisations. Employer un texte d'immersion / vues aériennes sans inventer de faits.

Le commit 890c2aa a remonté dans la page d'accueil les sections visuelles et vidéo déjà codées, corrigé les overlays trop sombres du hero et activé le zoom lent. Il ne représente PAS la refonte complète de toutes les pages. Vérifier les images, les vidéos, les médias Assinie/Dabou et l'orthographe « Assinie » partout.

## 6. Assistant, admin et e-mails

Raï : composant src/components/site/AiAssistant.tsx ; logique serveur à auditer dans src/lib/assistant.functions.ts. Parcours demandé : nom et prénoms, e-mail, téléphone avant de continuer si non déjà collectés. Ne pas répéter une question déjà répondue ; comprendre les formulations naturelles ; enregistrer le contact de façon sécurisée.

Admin : tester authentification Supabase en production, actualités, projets, paramètres, médias, FAQ modifiable, et responsive mobile. Le client veut des champs médias simplifiés (couverture + médias principaux, aperçu, sans champs redondants). L'affichage des réponses reçues par e-mail dans l'admin reste à développer ou à valider.

E-mails : fonction Supabase supabase/functions/ltgroup-mail/index.ts et Resend. Tester inscription newsletter, bienvenue, envoi d'actualité, désabonnement et délivrabilité. Secrets uniquement dans les secrets Edge Functions / variables sécurisées Vercel, jamais dans SQL, navigateur ou Git. Vérifier la présence (sans afficher les valeurs) de SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY et RESEND_API_KEY.

## 7. Logo et SEO

Contrôler logo dans en-tête, pied de page, admin, favicon, icône mobile, Open Graph/Twitter et e-mails. Fichiers présents : public/media/logo.jpg, public/media/logo.png, public/favicon.png, public/apple-touch-icon.png, public/media/og-light-terra.jpg. Leur présence ne prouve pas leur cohérence visuelle ; contrôler avant remplacement.

SEO : métadonnées uniques, canonical, sitemap, robots, Open Graph/Twitter, données structurées d'entreprise et contenu naturel autour de LT GROUP, Light Terra Group, Côte d'Ivoire et des expertises. Ne pas bourrer les mots-clés. Ne pas affirmer que l'indexation Google est acquise sans vérification.

## 8. État vérifié au 25/11/2026

- Dépôt : LTGroup-CI/LTGroup, branche main.
- Commit de production : 890c2aaed19aefb8b7311fa97d7c43f211163c5b.
- Déploiement Vercel : dpl_JANVXS79AxqT79EYQNpBWUQRxvZ5, statut READY.
- Node : 24.x.
- Les routes listées ci-dessus existent dans le dépôt.
- Les dix expertises existent dans src/content/services.ts.
- Le fallback Supabase/local existe ; la FAQ dispose d'une page et d'une query publique.
- Le composant Raï existe, mais son parcours complet doit être testé.
- La homepage monte hero, chiffres, galerie visuelle, activités, showcase vidéo, engagements, projet phare, actualités, newsletter et CTA.
- READY confirme le build et la publication, pas le bon fonctionnement de chaque fonctionnalité.
- Les problèmes précédemment rapportés (connexion admin, actualités vides, ancien logo en production, e-mails) ne sont pas déclarés résolus sans test réel.

## 9. Ordre de reprise recommandé

1. Auditer chaque page et parcours, sur desktop et mobile ; consigner les défauts reproductibles.
2. Terminer la direction artistique immersive sur toutes les pages publiques sans casser les fonctions.
3. Vérifier les images, vidéos, galerie, hero, chargement et accessibilité.
4. Tester les routes dynamiques sur contenus existants et un nouvel enregistrement non destructif.
5. Auditer admin, authentification, formulaires et responsive.
6. Auditer Raï et les flux e-mail de bout en bout.
7. Vérifier Vercel, Supabase, RLS et secrets sans exposer de valeur.
8. Finaliser SEO et partage social.
9. Exécuter bun run lint et bun run build ; corriger les erreurs bloquantes.
10. Déployer sur preview, tester, puis publier en production ; noter commit, URL et statut.
11. Mettre à jour README.md, roadmap.md et ce document après chaque tâche vérifiée.

## 10. Consignes non négociables

- Travailler uniquement sur LTGroup-CI/LTGroup.
- Lire ce document et AGENTS.md avant toute intervention.
- Ne pas refaire les tâches cochées sans preuve de régression.
- Ne pas remplacer TanStack par une autre architecture.
- Ne supprimer ni réinitialiser aucune donnée Supabase, table, ligne, bucket ou média sans autorisation explicite.
- Ne jamais committer secrets, tokens ou fichiers .env.
- Ne pas inventer réalisations, témoignages, prix, adresses, RCCM ou chiffres.
- Ne pas supprimer les fallbacks locaux ni casser l'édition admin.
- Ne jamais déclarer une fonctionnalité terminée sur la seule base d'un build réussi.
- Préserver les fonctionnalités existantes et tester les parcours après chaque changement important.
- Garder ce dossier à jour afin qu'une autre IA puisse poursuivre sans perdre les décisions du client.