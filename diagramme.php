<!DOCTYPE html>
<html lang="fr">

    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Diagramme</title>
        <link href="css/style.css" rel="stylesheet" type="text/css">
    <!-- Bootstrap core CSS -->
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
        <?php //  include 'header.php' ; ?>
    </head>

    <body>
        <!--<script type='module' src="js/affichage_diagramme.js"></script> -->
        <div class="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark" style="width: 280px;height: 1000px;">
        <a href="/example_bootstrap.html" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
        <svg class="bi me-2" width="40" height="32"><use xlink:href="#bootstrap"/></svg>
        <span class="fs-4">SecYourDev</span>
        </a>

        <button type="button" id="creerCarre" class="btn btn-secondary click">Créer un carré</button>
        <button type="button" id="suppression" class="btn btn-secondary click">Supprimer élément</button>
        <button type="button" id="dessin" class="btn btn-secondary click">Dessiner des flèches</button>
        <button type="button" id="afficherChemins" class="btn btn-secondary click">Afficher chemins</button>
        <button type="button" id="chemins" class="btn btn-secondary click">Dessiner chemins</button>
        <button type="button" id="importButton" class="btn btn-secondary click">Importer</button>
        <button type="button" id="export" class="btn btn-secondary click">Sauvegarder diagramme</button>
        <div id="txtHint3">
        <canvas id="canvas"></canvas>
      </ul>

        </div>

        </nav>

 
        <div class="col-2">
            <header></header>
            <script type='module' src="js/main.js"></script>

            <main class="content">
                
            <!-- TEST GRAPHIQUE -->

                <div id="contextMenu" class="card mb-4 box-shadow">
                    <div class="card-header bg-secondary">
                    <div class="d-flex justify-content-center">
                        <h3>Menu</h3>
                    </div>
                        <select id="selectCarre" name="typeCarre" class="form-select">
                        <option value="sources_de_risques" selected>Sources de risques</option>
                        <option value="partie_prenante">Parties Prenantes</option>
                        <option value="valeur_metier">Valeur métier</option>
                        </select>
                        </div>
                        <div class="card-body">
                            <div class="d-flex justify-content-center align-self-center">
                                <div class="col" align="center"> <button class="btn btn-dark" id="valider">Valider</button></div>
                                <div class="col" align="center"><button class="btn btn-dark" id="fermer">Fermer</button></div>
                            </div>
                        </div>
    <!--                    <button id="valider">Valider</button>
                        <div id="txtHint">
                        </div>
                        <button id="fermer">Fermer</button>-->
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

                <div id="menuChemins" class="card mb-4 box-shadow">
                    <div class="card-header bg-secondary">
                    <div class="d-flex justify-content-center">
                        <h3>Menu</h3>
                    </div>

                    <h3>Chemins</h3>
                    <table>
                        <tbody id='tableChemins'>
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


