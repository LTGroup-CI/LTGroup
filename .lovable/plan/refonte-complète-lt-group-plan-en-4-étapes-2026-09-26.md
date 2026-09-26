# Refonte complète LT GROUP — plan en 4 étapes

Le travail est découpé en étapes. À la fin de chaque étape, vous pourrez vérifier le résultat avant la suite.

## Étape 1 — Corrections urgentes (ce qui ne fonctionne pas)

- **Assistant virtuel Raï** : il répète la même question parce qu'il ne reconnaît pas votre nom. Je le reconstruis avec l'IA intégrée de Lovable, pour qu'il comprenne les réponses comme un humain (« inocent koffi », « je m'appelle… », etc.). Il demandera le nom, puis l'e-mail, puis le téléphone, en conversant naturellement. Il enregistrera ensuite le contact dans l'admin et répondra à partir des informations du site.
- **Newsletter** : l'inscription envoie automatiquement un e-mail de bienvenue au nom de l'abonné. Chaque publication d'actualité envoie aussi un e-mail aux abonnés. Les e-mails auront un logo hébergé de façon fiable (aucune image cassée), un titre, un extrait et un bouton « Lire l'article ». J'ai besoin de votre clé Resend : je vous ouvrirai un formulaire sécurisé pour la saisir.
- **Coordonnées** : mise à jour dans les paramètres avec vos informations : (+225) 07 49 22 47 22 / 07 07 74 14 84, WhatsApp +225 07 49 22 47 22, contact@ltgroup-ci.com, siège à Abidjan Cocody Akouédo extension sud-est, Lot 637, îlot 60, 01 BP 2259 Abidjan 01.
- **Pages détail** : un clic sur n'importe quelle carte (projet, actualité, pôle d'activité) ouvre sa page individuelle, partout sur le site.
- **Vercel** : correction du routage et de la configuration pour que toutes les pages s'ouvrent aussi bien sur Vercel que sur Lovable.
- **Mot de passe** : le bouton afficher/masquer est vérifié sur la connexion. Je l'ajoute aussi à tous les autres champs de mot de passe de l'admin.

## Étape 2 — Nouveau design, fidèle aux couleurs du logo

- **Palette** : or (dégradé du logo), noir profond et blanc cassé. Plus de mélange de couleurs.
- **Typographies** : une police à caractère pour les titres (esprit de « LIGHT TERRA ») et une police moderne et lisible pour le texte.
- **Arrière-plans** : je supprime toutes les images d'arrière-plan générées par IA. Je les remplace par des fonds sobres (noir, filets dorés, motifs géométriques discrets inspirés du triangle et de l'œil du logo). J'y place vos vrais visuels.
- **Médias conservés** : les 2 vidéos d'intro, les 2 vidéos Assini et Dabou, et les 2 visuels Assini et Dabou (ceux que vous venez d'envoyer). Tout le reste est supprimé.
- **Pôles d'activité** : plus de photos. Chaque pôle a une icône professionnelle adaptée à son métier (foncier, BTP, énergie, etc.), dans une mise en page élégante.

## Étape 3 — Admin complet et tout modifiable

- **Paramètres du site** : logo, favicon, nom, slogan, coordonnées, WhatsApp, horaires, réseaux sociaux, adresse et carte. Chaque changement s'applique immédiatement partout (en-tête, pied de page, contact, e-mails, assistant, fiche entreprise).
- **Contenus** : ajouter, modifier et supprimer tous les contenus (projets, actualités, pôles, vidéos, visuels, partenaires, témoignages, base de connaissances de l'assistant), avec envoi de fichiers.
- **Suivi** : abonnés newsletter, historique des envois, conversations de l'assistant et demandes de contact.

## Étape 4 — Référencement Google

- **Logo dans Google** : informations de l'entreprise lisibles par Google (logo, nom, coordonnées, adresse, réseaux sociaux), pour que le logo s'affiche en miniature dans les résultats.
- **Favicon** : un favicon carré tiré de votre logo, présent sur toutes les pages.
- **Fiche entreprise** : une page « À propos » claire, générée automatiquement à partir des paramètres.
- **Google Search Console** : je lance la connexion. Il faudra peut-être que vous validiez l'accès avec votre compte Google.

## Ce dont j'ai besoin de vous

1. Votre clé Resend, via le formulaire sécurisé que je vous ouvrirai.
2. Votre domaine d'envoi validé chez Resend (par exemple ltgroup-ci.com), pour que les e-mails partent de contact@ltgroup-ci.com.
3. Les noms exacts de vos pôles d'activité, s'ils doivent changer.

## Détails techniques

- **Assistant** : réponses en direct via l'IA intégrée de Lovable. Seul le texte du visiteur est transmis à l'IA ; ses instructions restent côté serveur. Le contact est enregistré dans la base.
- **E-mails** : envoyés depuis le serveur via Resend. Le logo est hébergé dans le stockage public du site. Les modèles utilisent le prénom de l'abonné. L'envoi est déclenché à la publication d'une actualité, et un journal évite les doublons.
- **Base de données** : ajout des coordonnées manquantes (deuxième téléphone, siège, boîte postale), suppression des médias générés par IA et ajout des nouveaux visuels.
- **Google** : balises de l'entreprise et du site web à l'accueil, favicon et icônes pour mobile, sitemap mis à jour.
