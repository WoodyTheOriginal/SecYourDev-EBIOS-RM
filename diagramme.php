<!DOCTYPE html>
<html lang="fr">

    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Diagramme</title>
        <link href="css/style.css" rel="stylesheet" type="text/css">
        <?php //  include 'header.php' ; ?>
    </head>

    <body>
        <!--<script type='module' src="js/affichage_diagramme.js"></script> -->
        <nav class="col-1">
            <div id='logo'>SecYourDev</div>
        </nav>

        

        <div class="col-2">
            <header></header>
            <script type='module' src="js/main.js"></script>

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

                <div id="contextMenu">
                    <h3>Menu</h3>
                    <select name="typeCarre" id="selectCarre">
                        <option value="sources_de_risques" selected>Sources de risques</option>
                        <option value="partie_prenante">Parties Prenantes</option>
                        <option value="evenements_redoutes">Evénements redoutés</option>
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



    <!--  Fin TEST GRAPHIQUE -->
        </main>
    </div> 

    </body>

       <!-- <?php include 'footer.php' ; ?>-->
</html>


