# Refonte visuelle LT GROUP — inspirée de belifegroupe.com

## Direction visuelle
- **Fond clair** : blanc cassé chaud et beige sable à la place du noir. Le noir ne sert plus que pour le pied de page et quelques bandeaux d'accent. L'or du logo sert aux titres, aux filets et aux boutons.
- **Style Belife** : grandes sections aérées, photos plein cadre aux coins arrondis, chiffres clés, cartes blanches avec ombre légère, titres forts, et une touche LT en plus (filets dorés, motif triangle et œil du logo).
- **Typographie plus lisible** : Cinzel seulement pour les grands titres, et Plus Jakarta Sans pour tout le reste (sous-titres, texte, menus), en taille plus grande avec plus d'interligne.
- **Adapté au mobile** : menu, grilles et en-tête revus pour téléphone, tablette et ordinateur.

## Bannière d'accueil animée
- Retour d'un diaporama en fond avec un zoom lent et un fondu. Il montre **7 images réalistes**, une par pôle : vente de terrain, aménagement foncier, BTP, promotion immobilière, énergie, infrastructures, conseil. Style photo de reportage, lumière naturelle, chantiers et paysages ivoiriens, sans effet artificiel.
- Un voile clair en dégradé garde le titre lisible. Vos 2 vidéos d'intro et vos visuels Assinie et Dabou restent dans leurs sections.

## Pôles d'activité
- Ajout du pôle **« Vente de terrains »** avec sa page détail et son icône.
- Chaque pôle a son icône professionnelle et sa page détail cliquable.

## Coordonnées (exactement comme vous les avez fournies)
- Téléphones : (+225) 07 49 22 47 22 / 07 07 74 14 84
- **Un seul WhatsApp** : +225 07 49 22 47 22 (le bouton et les liens WhatsApp en double sont supprimés)
- contact@ltgroup-ci.com
- Siège social : Abidjan Cocody Akouédo extension sud-est, Lot 637, îlot 60 ; 01 BP 2259 Abidjan 01
- Affichées partout (en-tête, pied de page, contact, fiche entreprise, assistant) depuis les paramètres de l'admin.

## Carte et fiche entreprise
- Carte interactive du siège sur l'accueil, la page Contact et la page À propos, placée selon les coordonnées GPS enregistrées dans l'admin.
- Fiche entreprise complète : identité, coordonnées réelles, liste des 7 services, horaires et itinéraire.

## Pages concernées
Accueil, À propos, Activités et leurs pages détail, Projets et leurs pages détail, Actualités et leurs pages détail, Services et devis, Témoignages, Contact, en-tête et pied de page.

## Google Search Console
- Search Console est connecté : dès que le site sera en ligne, je vérifie la propriété, j'ajoute la balise de vérification et j'envoie le plan du site.

## Hors de cette étape
- L'affichage des réponses reçues par e-mail dans l'admin, et la modernisation de l'admin, feront l'objet de l'étape suivante.

## Détails techniques
- Nouveaux jetons de couleur dans styles.css (fond sable, surfaces claires, variante sombre réservée au pied de page) et tailles de texte de base augmentées.
- 7 images générées au format réaliste dans src/assets/hero-*.jpg, puis diaporama en CSS avec les animations slow-zoom et fondu.
- Ajout de l'activité « vente-de-terrains » par une insertion SQL, et de l'icône « map » dans les tables d'icônes.
- Mise à jour de company_info : whatsapp_secondary vidé, puis vérification que le code n'affiche qu'un seul WhatsApp.
- Composant OfficeMap réutilisé.
