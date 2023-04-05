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
<<<<<<< Updated upstream
=======
                <button id="chemins">Dessiner chemins</button>  
                <input type="text" id="showChemin" placeholder="ID"/>
                <button id='submit'>Submit</button>
                <button id='import'>Importer</button>
                <button id="export">Sauvegarder diagramme</button> 
                <div id="txtHint3">
                </div> 
>>>>>>> Stashed changes
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

        <div id="infoMenu">
            <h3>Informations</h3>
            <table>
                <tr>
                    <th>ID</th>
                    <th>Nom</th>
                    <th>Description</th>
                    <th>Vraisemblance</th>
                </tr>
                <tr id="infoMenuList">
                </tr>
            </table>
            <input type='text' id='inputInfoData' placeholder='modifier' style='display:none'>
            <button id='modifierData' style='display:none'>Modifier</button>
            <h3>Dans la base de données</h3>
            <div id="txtHint2">
            </div>
            <button id="fermer2">Fermer</button>
        </div>

        <canvas id="canvas">

        </canvas>

    <!--  Fin TEST GRAPHIQUE -->

    </body>

        <?php include 'footer.php' ; ?>
</html>


