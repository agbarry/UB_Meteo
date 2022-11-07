# UB_Meteo

Une application web réalisé dans le cadre du td de l'UE Programmation Web.
Le but est de pouvoir faire des requêtes sur le site [Prevention meteo](https://www.prevision-meteo.ch/services/) pour ensuite
afficher la météo de la ville spécifiée dans la requête sur toutes les localités de la Suisse, France et Belgique.

La recherche peut être faite à partir de la barre de recherche ou sur la carte faite par l'api [Leaflet](https://leafletjs.com/).
Par défaut, la carte pointe sur la ville de **Bordeaux** mais par le moyen de zoom on peut également chercher d'autres villes.

## Exécution
Pour l'exécution il faut lancer un serveur avec **live server** car j'ai rencontré un problème du genre **Blocage d’une requête multiorigine (Cross-Origin Request) :** avec le lancement du fichier html uniquement.
J'ai essayé de le corrigé sans succès.