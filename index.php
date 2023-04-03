<!DOCTYPE html>
<html lang="fr">

    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Diagramme</title>
        <link href="css/style.css" rel="stylesheet" type="text/css">
        <title>Diagramme</title>

        <?php //  include 'header.php' ; ?>
    </head>

    <body>
        <!--<script type='module' src="js/affichage_diagramme.js"></script> -->
        
        <script type='module' src="js/main.js"></script>

            <div class="toolbar">
                <button id="creerCarre">Créer un carré</button>
                <button id="suppression">Supprimer élément</button>
                <button id="dessin">Dessiner des flèches</button>
                <button id="findPath">Afficher chemins</button>  
            </div>

        <h1> Bonjour </h1>    

    <!-- TEST GRAPHIQUE -->

        <div id="contextMenu">
            <h3>Menu</h3>
            <select name="typeCarre" id="selectCarre">
                <option value="partie_prenantes" selected>Partie prenante</option>
                <option value="evements_intermediaires">Evémenent intermédiaire</option>
                <option value="evements_redoutes">Evénement redouté</option>
            </select>
            <button id="valider">Valider</button>
            <div id="txtHint">
            </div>
            <button id="fermer">Fermer</button>
        </div>

        <canvas id="canvas">

        </canvas>

    <!--  Fin TEST GRAPHIQUE -->

    </body>

        <?php include 'footer.php' ; ?>
</html>


