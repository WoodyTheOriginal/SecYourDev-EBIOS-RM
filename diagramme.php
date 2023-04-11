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
                <button id="chemins">Dessiner chemins</button>  
                <input type="text" id="showChemin" placeholder="ID"/>
                <button id='submit'>Submit</button>
                <button id='import'>Importer</button>
                <button id="export">Sauvegarder diagramme</button> 
                <div id="txtHint3">
                </div> 
            </div>

            <main class="content">
                <div id="activite">
                    <div class="toolbar">
                        <button id="creerCarre">Créer un carré</button>
                        <button id="suppression">Supprimer élément</button>
                        <button id="dessin">Dessiner des flèches</button>
                        <button id="afficherChemins">Afficher chemins</button>
                        <button id="chemins">Dessiner chemins</button>  
                        <!--<input type="text" id="showChemin" placeholder="ID"/>
                        <button id='submit'>Submit</button>-->
                        <button id='importButton'>Importer</button>
                        <button id="export">Sauvegarder diagramme</button> 
                        <div id="txtHint3">
                        </div> 
                    </div>
                    <canvas id="canvas">
                    </canvas>
                </div>
                
            <!-- TEST GRAPHIQUE -->

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

                <div id='mainMenu' style='display: none'>
                    <a href="diagramme.php"><button>Nouveau Diagramme</button></a>
                    <button id="importButton">Importer</button>
                </div>

                <div id='menuChemins'>
                    <h3>Chemins</h3>
                    <table>
                        <tbody id='tableChemins'>
                            <tr>
                                <th>ID</th>
                                <th></th>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div id='importMenu'>            
                </div>

        <canvas id="canvas">

        </canvas>

    <!--  Fin TEST GRAPHIQUE -->

    </body>

        <?php include 'footer.php' ; ?>
</html>


