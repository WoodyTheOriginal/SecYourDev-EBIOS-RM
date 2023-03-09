<!DOCTYPE html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Diagramme</title>
    <link href="css/style.css" rel="stylesheet">
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


    <div id='contextMenu'>
        <select name="typeCarre" id="selectCarre">
            <option value="cat1">Catégorie 1</option>
            <option value="cat2">Catégorie 2</option>
            <option value="cat3">Catégorie 3</option>
        </select>
        <button id="valider">Valider</button>
    </div>

    <canvas id="canvas">
      <p>Add suitable fallback here.</p>
    </canvas>


<!--  Fin TEST GRAPHIQUE -->





    </body>

        <?php include 'footer.php' ; ?>
</html>


