# Activ Esaip - Sec Your Dev
  
Une petite description du projet

## Pré-requis

- Wampserver64
- Phpmyadmin

## Installation

Les étapes :

1-Télécharger le projet sur le github

2-Mettre le projet dézipper dans le dossier C:\wamp64\www

3-Lancer Phpmyadmin sur Wampserver64 puis récupérer le script sql ``secyourdev_script.sql``

4-Lancer le script

5-Se rendre sur le web en http://localhost/SecYourDev-EBIOS-RM-main/

## Fonctionnement

### Connexion à la Base de Donnée

Les fonctions ajax permet d'interagir avec la base de données.

La connexion se fait par l'instance de la classe mysqli.
$mysqli = new mysqli("localhost", "root", "", "secyourdev");

"localhost" = nom ou l'adresse IP du serveur MySQL

"root" = nom d'utilisateur pour se connecter à la base de données MySQL

"" =  mot de passe pour se connecter à la base de données MySQL

"secyourdev" = nom de la base de données MySQL à laquelle se connecter
***
*Export.php :* 
Méthode d’export pour insérer les différentes données en base qui sont les trois
variables $squares, $arrows et $paths, données envoyées par un formulaire HTML
via la méthode POST. (pour stocker les informations sur les carrés, les flèches et les chemins dans un
diagramme.)

*Getcategory.php :*
Méthode pour récupérer la table qu’on veut en base de donnée effectue une requête
select dessus.

*Getdiagrams.php :*
Méthode pour récupérer un diagramme déjà conçu en base de données stocké en
json.

*Import.php :*
Méthode pour mettre en base de données un diagramme conçu sous format json

### Fonction Clé

**arrows.js**

Objet Arrow représente une flèche avec une tête de flèche à une extrémité.
La classe Arrow a plusieurs propriétés et méthodes qui permettent de dessiner,
modifier et vérifier si un point est contenu dans la flèche.

**square.js**

Objet Square qui représente un carré dans un canvas HTML5. La classe possèdent
les propriétés telles que l'identifiant, la position, la taille, la couleur, les entrées et
sorties maximales, les connexions et la description.
La méthode draw est définie pour dessiner le carré dans le canvas en utilisant le
contexte de dessin fourni en paramètre (ctx). Elle remplit le carré avec la couleur
spécifiée et, si le nom est non nul, écrit le nom en bas centré juste à l'extérieur du
carré.

La méthode containsPoint est définie pour vérifier si les coordonnées (x, y) fournies
sont à l'intérieur du carré ou non. Elle retourne true si les coordonnées sont à
l'intérieur et false sinon.


## Auteurs

* **Mathieu Guignard**
* **Alexis Koch** 
* **Paul-henri Ourdoff** 
* **Raphael Mongrolle** 
* **Alexandre Lucas** 
