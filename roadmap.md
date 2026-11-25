# Roadmap LT GROUP — suivi opérationnel

Dernière mise à jour : 25 novembre 2026. Dépôt officiel : LTGroup-CI/LTGroup, branche main.

**Consigne :** lire [LOVABLE_HANDOFF.md](./LOVABLE_HANDOFF.md) avant de commencer. Une tâche ne passe à [x] qu'après vérification dans le code et, si nécessaire, sur le site déployé. Un build réussi ne prouve pas que les fonctions marchent.

## Déjà réalisé / présent dans le dépôt
- [x] Architecture du site répartie en pages dédiées (voir README).
- [x] Menu principal ramené à cinq entrées et pages Actualités, Témoignages, FAQ accessibles depuis le pied de page.
- [x] Accueil recentré sur une vitrine et un seul projet phare.
- [x] Pages détail dynamiques pour projets, actualités et activités (tester les nouveaux contenus admin).
- [x] Copie locale de secours des contenus et médias : src/lib/site-data.ts et src/content/snapshot.json.
- [x] Logo JPG/PNG, favicon et image Open Graph présents dans public/ (cohérence visuelle production encore à contrôler).
- [x] Logo avec fond blanc dans les e-mails et lien de désabonnement (à retester en conditions réelles).
- [x] Clé Resend validée précédemment ; ne jamais la copier dans Git.
- [x] Page FAQ et modèle de lecture publique présents ; confirmer l'édition admin.
- [x] Déploiement Vercel production du commit 890c2aa : statut READY le 25/11/2026.
- [x] Version Node fixée à 24.x dans package.json.
- [x] Sections visuelles existantes remontées sur l'accueil, overlays du hero éclaircis et zoom lent activé (commit 890c2aa).

## À terminer — priorité haute
- [ ] Refonte immersive cohérente de toutes les pages publiques, desktop/tablette/mobile, sans casser les fonctions existantes. Première tranche codée et déployée (commit 6225675 READY) : PageHero partagé avec images contextuelles différentes par page et médias réels sur les fiches, animation discrète, cartes projets/actualités/activités/expertises, galerie détaillée, accueil, panneaux contact/FAQ/témoignages/devis ; validation visuelle réelle de toutes les routes encore nécessaire.
- [ ] Vérifier images, diaporama, vidéos d'introduction et section vidéo « Découvrez nos opportunités et réalisations » sur le domaine officiel.
- [ ] Vérifier qualité, pertinence ivoirienne, droits et absence de doublons des visuels ; ne pas présenter une image illustrative comme un chantier réel.
- [ ] Vérifier les liens de toutes les cartes vers leurs fiches, y compris les nouveaux enregistrements créés depuis l'admin.
- [ ] Vérifier Supabase en production : connexion admin, contenus actualités/projets/activités, paramètres et médias.
- [ ] Vérifier logo en production : en-tête, pied de page, admin, favicon, Open Graph/Twitter et e-mails.
- [ ] Vérifier Raï : collecte nom/prénoms, e-mail et téléphone avant de poursuivre, sans répétition ; sauvegarde du contact et réponses utiles.
- [ ] Vérifier Resend/newsletter en production : bienvenue, publication d'actualité, désabonnement et délivrabilité.
- [x] Panneau admin « Demandes » : lecture des messages, historique des réponses et envoi de réponse présents dans src/routes/admin.tsx et src/lib/admin.functions.ts (reste à tester en production).
- [x] Formulaires projets/actualités/activités : deux champs média présents (médias principaux jusqu'à 5 fichiers + couverture). Vérifier les aperçus et l'ergonomie en production.
- [ ] Moderniser l'admin et corriger les débordements sur mobile.
- [ ] Harmoniser les textes : largeur utile, alignement/justification lisible, titres non confinés dans une petite colonne.
- [ ] Contrôler SEO : métadonnées par page, canonical, sitemap, robots, données structurées, partage social et indexation.
- [x] Migrer les appels TanStack Start createServerFn().inputValidator() vers .validator() dans newsletter.functions.ts, news.functions.ts, requests.functions.ts, admin.functions.ts et assistant.functions.ts ; le build de production ne signale plus ces dépréciations.

## À confirmer avec le client — ne pas inventer
- [ ] Adresse exacte : deux versions existent dans l'historique (Lot 637, îlot 60 et Lot 640, îlot 60). Demander confirmation avant modification.
- [ ] Numéro RCCM pour les mentions légales.
- [ ] Témoignages réels (nom, fonction, entreprise, photo) et photos HD/textes authentiques des chantiers.
- [ ] Aucun prix pour les terrains de Dabou sans instruction expresse.

## Infrastructure / sécurité
- [ ] Vérifier dans Vercel les variables serveur : SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY (ne jamais afficher leurs valeurs).
- [ ] Confirmer le fonctionnement de la fonction Edge ltgroup-mail avec les bons headers/authentifications.
- [ ] Vérifier RLS et autorisations côté serveur pour chaque fonction admin.
- [ ] Ne supprimer aucune donnée Supabase, table, ligne, bucket ou média sans autorisation explicite.
- [ ] Ne jamais committer une clé de service, clé Resend, token ou fichier .env.

