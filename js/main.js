// Initialisation de toutes les variables globales
var canvas = document.getElementById('canvas');
var ctx;
var offsetX = 0;
var offsetY = 0;
var mouseX;
var mouseY;
var nom;
var drawingPath = false;
var drawingTool = false;
var drawingArrow = false;
var removingTool = false;
var drawingSquare = false;
var squareChoice = null;
var maxInputChoice = null;
var maxOutputChoice = null;
var pathTemp = [];
var paths = [];
var adjList = [];
var selectedObject = null;
var selectedArrow = null;
var squares = [];
var arrows = [];
var currentArrow;
var selectedSquare;
var points = 0;

//Importation des classes
import { Square } from './modules/squares.js';
import { Arrow } from './modules/arrows.js';

//Récupération des éléments du DOM
let chemins = document.getElementById('chemins');
let dessin = document.getElementById('dessin');
let suppression = document.getElementById('suppression');
let valider = document.getElementById('valider');
let findPath = document.getElementById('findPath');
let submit = document.getElementById('submit');
let fermer2 = document.getElementById('fermer2');
let selectCarre = document.getElementById('selectCarre');
let exportBtn = document.getElementById('export');
let importBtn = document.getElementById('importButton');
let creerCarre = document.getElementById('creerCarre');
let fermer = document.getElementById('fermer');

//Attribution des onclick aux boutons en vérifiant leur existance pour éviter les erreurs
if (exists(canvas)) {
    ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth * 0.85;
    canvas.height = window.innerHeight * 0.7;
}
if (exists(chemins)) {
    chemins.onclick = dessinerChemin;
}
if (exists(dessin)) {
    dessin.onclick = dessinerFleche;
}
if (exists(suppression)) {
    suppression.onclick = supprimerObjet;
}if (exists(valider)) {
    valider.onclick = dessinerCarre;
}
if (exists(findPath)) {
    findPath.onclick = renderPaths;
}
if (exists(submit)) {
    submit.onclick = showChemin;
}
if (exists(fermer2)) {
    fermer2.addEventListener('click', () => exitMenu());
}
if (exists(selectCarre)) {
    selectCarre.addEventListener('change', (event) => showCategoryCarre(event.target.value));
}
if (exists(exportBtn)) {
    exportBtn.addEventListener('click', () => exportDiagram());
}
if (exists(importBtn)) {
    importBtn.addEventListener('click', () => showPaths());
}
if (exists(creerCarre)) {
    creerCarre.addEventListener('click', function() {
        document.getElementById('contextMenu').style.display = 'block';
    });
}
if (exists(fermer)) {
    fermer.addEventListener('click', function() {
        document.getElementById('contextMenu').style.display = 'none';
    });
}

//Fonction qui vérifie l'existence du canvas
if (exists(canvas)) {
    //Ajout de tous les event listeners sur le canvas

    //Détection du click souris lorsqu'elle est enfoncée
    canvas.addEventListener('mousedown', function(e){
        //Récupération des coordonnées de la souris
        mouseX = e.pageX - canvas.offsetLeft;
        mouseY = e.pageY - canvas.offsetTop;
        
        //Tous les cas pour les carrés
        for (let i = 0; i < squares.length; i++) {
            //Si la souris est sur un carré
            if (squares[i].containsPoint(mouseX, mouseY) === true){
                /*Si on n'est pas en train de poser un carré, ou une flèche et pas en train de supprimer un objet
                alors on attribue le carré en tant que carré et objet sélectionné*/
                if (!drawingTool && !drawingSquare && !removingTool){
                    selectedSquare = squares[i];
                    selectedObject = squares[i];
                }
                //Si on est en train de dessiner une flèche et qu'on a déjà un point de départ
                if (drawingArrow && points === 1){
                    //Si le carré peut encore accepter des inputs
                    if (squares[i].input + 1 <= squares[i].maxInput || squares[i].maxInput < 0){
                        points = 2;
                        squares[i].input += 1;
                        //update de la fin de la flèche avec les coordonnées du milieu du côté du carré
                        currentArrow.updateEnd(squares[i].x, squares[i].y + squares[i].size / 2);
                        currentArrow.endSquare = squares[i];
                        currentArrow.startSquare.connections.push(squares[i]);
                    } else {
                        alert("Pas plus d'entrées");
                        exitTool();
                    }
                }
                //Si on est en train de dessiner une flèche et qu'on n'a pas encore de point de départ
                if (drawingTool && points === 0){
                    //Si le carré peut encore accepter des outputs
                    if (squares[i].output + 1 <= squares[i].maxOutput || squares[i].maxOutput < 0){
                        drawingArrow = true;
                        points = 1;
                        //Création d'une nouvelle flèche avec les coordonnées du milieu du côté du carré
                        var newArrow = new Arrow(squares[i].x + squares[i].size, squares[i].y + squares[i].size / 2);
                        newArrow.startSquare = squares[i];
                        currentArrow = newArrow;
                        squares[i].output += 1;
                    } else {
                        alert("Pas plus de sorties");
                        exitTool();
                    }
                }
                //Si on est en train de supprimer un objet
                if (removingTool){
                    if (squares[i].input === 0 && squares[i].output === 0){
                        squares.splice(i, 1);
                        reassignIds(); //Réassignation des ids des carrés pour éviter les problèmes
                        drawCanvas();
                        exitTool();
                    } else {
                        alert('Impossible de supprimer une case avec des connexions');
                        exitTool();
                    }
                }
            }
        }
        //Tous les cas pour les flèches
        for (let i = 0; i < arrows.length; i++) {
            //Si la souris est sur une flèche
            if (arrows[i].containsPoint(mouseX, mouseY)) {
                selectedArrow = arrows[i];
                //Si on est en train de supprimer un objet
                if (removingTool){
                    //On retire 1 à l'output du carré de départ et 1 à l'input du carré d'arrivée
                    arrows[i].startSquare.output -= 1;
                    arrows[i].endSquare.input -= 1;
                    arrows.splice(i, 1);
                    drawCanvas();
                    exitTool();
                }

                //Si on est en train de dessiner un chemin
                if (drawingPath) {
                    arrows[i].color = 'red';
                    pathTemp[0] = squares[0];
                    if (arrows[i].startSquare !== pathTemp[pathTemp.length - 1] ) {
                        console.log("Chemin invalide");
                        pathTemp = [];
                        arrows.forEach(arrow => {
                            arrow.color = 'black';
                        });
                        drawCanvas();
                    }else {
                        if (arrows[i].startSquare === pathTemp[pathTemp.length - 1]) {
                            pathTemp.push(arrows[i], arrows[i].endSquare);
                        }
                        if (arrows[i].endSquare === (squares[squares.length - 1])){
                            pathTemp.push(arrows[i]);
                            mergePaths();
                        }
                        else {
                            pathTemp.push(arrows[i].startSquare, arrows[i], arrows[i].endSquare);
                        }
                    }
                    drawCanvas();
                    exitTool();
                }
    
                if (!drawingPath && !drawingTool && !removingTool) {
                    selectedObject = arrows[i];
                }   
            }        
        }
    
        if (drawingArrow && points === 2) {
            currentArrow.finishDrawing(ctx);
            showCategoryArrow();
            arrows.push(currentArrow);
            showInfoMenu(currentArrow);
            currentArrow = null;
            exitTool();
        }
    
        if (!drawingTool && !drawingSquare && !removingTool && !drawingArrow && !drawingPath && !selectedArrow && !selectedSquare){
            exitMenu();
        }
    
        if (drawingSquare){
            var newSquare = new Square(squares.length , mouseX, mouseY, 50, 'black', maxInputChoice, maxOutputChoice);
            newSquare.nom = nom;
            squares.push(newSquare);
            drawCanvas();
            exitTool();
        }
    })

    canvas.addEventListener('mousemove', function(e) {

        mouseX = e.pageX - canvas.offsetLeft;
        mouseY = e.pageY - canvas.offsetTop;
    
        if (selectedSquare && !drawingTool){
            selectedSquare.x = mouseX - (selectedSquare.size / 2);
            selectedSquare.y = mouseY - (selectedSquare.size / 2);
            drawCanvas();
        }

        //Boucle permettant de déplacer les flèches lorsque l'on déplace un carré
        for (let i = 0; i < arrows.length; i++) {
            arrows[i].updateEnd(arrows[i].endSquare.x, arrows[i].endSquare.y + arrows[i].endSquare.size / 2);
            arrows[i].updateStart(arrows[i].startSquare.x, arrows[i].startSquare.y + arrows[i].startSquare.size / 2);
    
            // Si la flèche pointe vers le haut
            if (arrows[i].endSquare.y < arrows[i].startSquare.y - (arrows[i].startSquare.size * 1.5)) {
                arrows[i].updateStart(arrows[i].startSquare.x + arrows[i].startSquare.size / 2, arrows[i].startSquare.y);
                arrows[i].updateEnd(arrows[i].endSquare.x + arrows[i].endSquare.size / 2, arrows[i].endSquare.y + arrows[i].endSquare.size);
            }
    
            // Si la flèche pointe vers le bas
            if (arrows[i].endSquare.y > arrows[i].startSquare.y + (arrows[i].startSquare.size * 1.5)) { 
                arrows[i].updateStart(arrows[i].startSquare.x + arrows[i].startSquare.size / 2, arrows[i].startSquare.y + arrows[i].startSquare.size);
                arrows[i].updateEnd(arrows[i].endSquare.x + arrows[i].endSquare.size / 2, arrows[i].endSquare.y);
            }
    
            // Si la flèche pointe vers la droite
            if (arrows[i].endSquare.x < arrows[i].startSquare.x - (arrows[i].startSquare.size * 1.5)) {
                arrows[i].updateStart(arrows[i].startSquare.x, arrows[i].startSquare.y + arrows[i].startSquare.size / 2);
                arrows[i].updateEnd(arrows[i].endSquare.x + arrows[i].endSquare.size, arrows[i].endSquare.y + arrows[i].endSquare.size / 2);
            }
    
            // Si la flèche pointe vers la gauche
            if (arrows[i].endSquare.x > arrows[i].startSquare.x + (arrows[i].startSquare.size * 1.5)) {
                arrows[i].updateStart(arrows[i].startSquare.x + arrows[i].startSquare.size, arrows[i].startSquare.y + arrows[i].startSquare.size / 2);
                arrows[i].updateEnd(arrows[i].endSquare.x, arrows[i].endSquare.y + arrows[i].endSquare.size / 2);
            }
        }
    })
    
    
    canvas.addEventListener('mouseup', function(e) {
    
        if (selectedObject) {
            showInfoMenu(selectedObject);
        }
    
        if (selectedSquare) {
            selectedSquare = null;
        }
    
        if (selectedArrow) {
            selectedArrow = null;
        }
    
    })
}


//Echap permet de quitter les outils de dessin, suppression, etc
document.addEventListener('keydown', evt => {
    if (evt.key === 'Escape') {
        exitTool();
    }
});

//Fonctions permettant le repérage automatique des chemins existants entre le départ et l'arrivée
/*
function printAllPaths(s, d) {
    let visited = [];
    let path = [];
    path.push(s);
    printAllPathsUtil(s, d, visited, path);
}

function printAllPathsUtil(u,d,isVisited,localPathList)
{
    if (u == (d)) {
        console.log(localPathList);
        // if match found then no need to
        // traverse more till depth
        return;
    }
  
    // Mark the current node
    isVisited[u] = true;

    // Recur for all the vertices
    // adjacent to current vertex
    if (adjList[u].length){
        for (let i=0;i< adjList[u].length;i++) {
            if (!isVisited[adjList[u][i]]) {
                // store current node
                // in path[]
                localPathList.push(adjList[u][i]);
                printAllPathsUtil(adjList[u][i], d, isVisited, localPathList);
    
                // remove current node
                // in path[]
                localPathList.splice(localPathList.indexOf(adjList[u][i]),1);
            }
        }
    }
      
    // Mark the current node
    isVisited[u] = false;
}

// Initalisation de la liste d'adjacence (pour chaque carré, on crée un tableau vide qui contiendra les carrés auxquels il est connecté)
function initAdjList() {
    for (let i = 0; i < squares.length; i++) {
        adjList[i] = [];
    }
    //console.log("adjList : ", adjList);
}

// Ajouter une connexion entre deux carrés
function addEdge(start, end) {
    adjList[start].push(end);
}

// Afficher tous les chemins possibles entre deux carrés
function renderPaths() {
    initAdjList();
    for (let i = 0; i < squares.length; i++) {
        for (let j = 0; j < squares[i].output; j++) {
            addEdge(squares[i].id, squares[i].connections[j].id);
        }
    }

    printAllPaths(squares[0].id, squares[squares.length - 1].id);
}
*/

// Reaffecter les id des carrés
function reassignIds() {
    for (let i = 0; i < squares.length; i++) {
        squares[i].id = i;
    }
}

function drawCanvas() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
		// Dessiner les carrés
		squares.forEach(function(square) {
			square.draw(ctx);
		});
		
		// Dessiner les flèches si elles existent
		if (currentArrow) {
			currentArrow.draw(ctx);
		}

        arrows.forEach(function(arrow) {
            arrow.draw(ctx);
        });
}

//Vérifier qu'un objet du DOM existe
function exists(object) {
    if (object !== undefined && object !== null) {
        return true;
    } else {
        return false;
    }   
}

//Outil dessin de flèche
function dessinerFleche() {
    document.body.style.cursor = 'crosshair';
    drawingTool = true;

}

//Outil suppression objet
function supprimerObjet() {
    document.body.style.cursor = 'crosshair';
    removingTool = true;
}

//Outil dessin de carré
function dessinerCarre() {
    document.body.style.cursor = 'crosshair';
    document.getElementById('contextMenu').style.display = 'none';
    drawingSquare = true;
    squareChoice = document.getElementById('selectCarre').value;
    //Définition du nombre d'outputs et inputs en fonction du type de carré
    switch (squareChoice) {
        case 'sources_de_risques':
            maxInputChoice = 0;
            maxOutputChoice = -1;
            break;

        case 'partie_prenante':
            maxInputChoice = -1;
            maxOutputChoice = -1;
            break;

        case 'evenements_redoutes':
            maxInputChoice = -1;
            maxOutputChoice = 0;
            break;

        default:
            break;
    }
}

//Quitter tous les outils
function exitTool() {
    document.body.style.cursor = 'default'; 
    drawingTool = false;
    drawingArrow = false;
    drawingSquare = false;
    drawingPath = false;
    removingTool = false;
    maxInputChoice = 0;
    maxOutputChoice = 0;  
    points = 0;
}

//Outil dessin de chemin
function dessinerChemin() {
    document.body.style.cursor = 'crosshair';
    drawingPath = true;
}

//Les chemins sont stockés dans des tableaux différents on les met tous dans le même tableau
function mergePaths() {
    paths[paths.length] = pathTemp;
    pathTemp = [];
    console.log(paths);
    arrows.forEach(arrow => {
        arrow.color = 'black';
    });
    drawCanvas();
}

//Afficher les chemins en mettant les flèches en vert
function showChemin() {
    let value = document.getElementById("showChemin").value;
    arrows.forEach(arrow => {
        arrow.color = 'black';
    }); 
    if (paths.length >= (value) && value > 0){
        paths[(value - 1)].forEach(arrow => {
            if (arrow instanceof Arrow){
                arrow.color = 'green';
            }
        });
    }
    drawCanvas();
}

//Afficher le menu d'information permettant de modifier les informations d'un carré ou d'une flèche
function showInfoMenu(object) {
    let infoMenu = document.getElementById("infoMenu");
    let infoMenuList = document.getElementById("infoMenuList");
    let inputInfoData = document.getElementById("inputInfoData");
    let modifierData = document.getElementById("modifierData");
    let modifiedData = null;
    infoMenu.style.display = "block";
    infoMenuList.innerHTML = "";
    infoMenuList.innerHTML += "<td>id : " + object.id + " <button class='modifierInfoMenu'>Modifier</button> </td>";
    infoMenuList.innerHTML += "<td>nom : " + object.nom + " <button class='modifierInfoMenu'>Modifier</button></td>";  
    infoMenuList.innerHTML += "<td>description : " + object.description + " <button class='modifierInfoMenu'>Modifier</button></td>";
    infoMenuList.innerHTML += "<td>vraisemblance : " + object.vraisemblance + " <button class='modifierInfoMenu'>Modifier</button></td>";
    let infoMenuButtons = document.getElementsByClassName("modifierInfoMenu");
    for (const button of infoMenuButtons) {
        button.addEventListener('click', function(e) {
            inputInfoData.style.display = "block";
            modifierData.style.display = "block";
            //En fonction de la position du bouton dans le tableau on modifie la variable modifiedData
            switch (this.parentNode.cellIndex) {
                case 0:
                    modifiedData = "id";
                    break;
                
                case 1:
                    modifiedData = "nom";
                    break;
                
                case 2:
                    modifiedData = "description";
                    break;

                case 3:
                    modifiedData = "vraisemblance";
                    break;

                default:
                    break;
            }
        });
    }
    modifierData.addEventListener('click', function(e) {
        //A partir de la variable modifiedData on peut savoir quel champ on doit modifier
        switch (modifiedData) {
            case "id":
                selectedObject.id = inputInfoData.value;
                modifiedData = null;
                break;

            case "nom":
                selectedObject.nom = inputInfoData.value;
                modifiedData = null;
                break;

            case "description":
                selectedObject.description = inputInfoData.value;
                modifiedData = null;
                break;

            case "vraisemblance":
                selectedObject.vraisemblance = inputInfoData.value;
                modifiedData = null;
                break;
        
            default:
                break;
        }
        inputInfoData.style.display = "none";
        modifierData.style.display = "none";
        showInfoMenu(selectedObject);
    });
}

//Fonction permettant de fermer le menu d'information
function exitMenu() {
    let infoMenu = document.getElementById("infoMenu");
    infoMenu.style.display = "none";
    selectedObject = null;
    selectedArrow = null;
}

//Fonction permettant de montrer les catégories de carrés dans la bdd (sources de risques, événements redoutés, parties prenantes)
function showCategoryCarre(str) {
    console.log('change : ' + str);
    var xhttp;
    if (str == "") {
      document.getElementById("txtHint").innerHTML = "";
      return;
    }
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById("txtHint").innerHTML = this.responseText;
        var validerBoutons = document.getElementsByClassName('validerTable');
        for (const validerBouton of validerBoutons) {
            validerBouton.addEventListener('click', function() {
                console.log('index : ' + this.parentNode.parentNode.rowIndex);
                var row = this.parentNode.parentNode;
                var cells = row.getElementsByTagName('td');
                var id = cells[0].innerHTML;                
                nom = cells[1].innerHTML;
                //var description = cells[2].innerHTML;
                console.log('id : ' + id + ', nom : ' + nom);
                dessinerCarre();
            });
        }
      }
    };
    xhttp.open("GET", "ajax_functions/getcategory.php?category="+str, true);
    xhttp.send();
}

//Fonction permettant de montrer les catégories de flèches dans la bdd (événements intermédiaires)
function showCategoryArrow() {
    var xhttp;
    document.getElementById("txtHint2").innerHTML = "";
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById("txtHint2").innerHTML = this.responseText;
        var validerBoutons = document.getElementsByClassName('validerTable');
        for (const validerBouton of validerBoutons) {
            validerBouton.addEventListener('click', function() {
                var row = this.parentNode.parentNode;
                var cells = row.getElementsByTagName('td');
                var id = cells[0].innerHTML;
                var nom = cells[1].innerHTML;
                //var description = cells[2].innerHTML;
                selectedObject.id = id;
                selectedObject.nom = nom;
                //selectedObject.description = description;
                showInfoMenu(selectedObject);
            });
        }
      }
    };
    xhttp.open("GET", "ajax_functions/getcategory.php?category=evenements_intermediaires", true);
    xhttp.send();
}   


//Export du diagramme en JSON dans la bdd
function exportDiagram() {
    var xhttp;
    var data = [];
    data[0] = squares;
    data[1] = arrows;
    data[2] = paths;
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
        }
    };
    xhttp.open("POST", "ajax_functions/export.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("data=" + JSON.stringify(data[0]) + "&data2=" + JSON.stringify(data[1]) + "&data3=" + JSON.stringify(data[2]));
}

//Import du diagramme en JSON dans la bdd
function importDiagram(id) {
    var xhttp;
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(this.responseText);
            var dataSquare = data.squares;
            var dataArrow = data.arrows;
            var dataPath = data.paths;
            squares = [];
            arrows = [];
            paths = [];
            //On créé les carrés et les flèches car le JSON leur fait perdre le constructeur Arrow et Square et donc les fonctions qui votn avec
            dataSquare.forEach(element => {
                var square = new Square(element.id, element.x, element.y, element.size, element.color, element.maxInput, element.maxOutput);
                square.nom = element.nom;
                square.description = element.description;
                square.vraisemblance = element.vraisemblance;
                squares.push(square);
            });
            dataArrow.forEach(element => {
                var arrow = new Arrow(element.startX, element.startY);
                arrow.id = element.id;
                arrow.nom = element.nom;
                arrow.description = element.description;
                arrow.vraisemblance = element.vraisemblance;
                squares.forEach(square => {
                    if (square.id == element.startSquare.id) {
                        arrow.startSquare = square;
                    }

                    if (square.id == element.endSquare.id) {
                        arrow.endSquare = square;
                    }
                });
                arrows.push(arrow);
            });
            dataPath.forEach(array => {
                array.forEach(element => {
                    arrows.forEach(arrow => {
                        if (element.startSquare !== undefined && element.endSquare !== undefined && arrow.startSquare.id == element.startSquare.id && arrow.endSquare.id == element.endSquare.id ) {
                            element = arrow;
                        }
                    });
                    squares.forEach(square => {
                        if (square.x == element.x && square.y == element.y) {
                            element = square;
                        }
                    });
                    pathTemp.push(element);
                });
                paths.push(pathTemp);
                pathTemp = [];
            });
            drawCanvas();
            console.log(paths);
        }
    };
    xhttp.open("GET", "ajax_functions/import.php?id="+id, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send();
};

//Récupération des chemins depuis la base de données
function showPaths() {
    document.getElementById("importMenu").style.display = "block";
    document.getElementById("mainMenu").style.display = "none";
    var xhttp;
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById("importMenu").innerHTML = this.responseText;
        var validerBoutons = document.getElementsByClassName('validerPath');
        for (const validerBouton of validerBoutons) {
            validerBouton.addEventListener('click', function() {
                var row = this.parentNode.parentNode;
                var cells = row.getElementsByTagName('td');
                var id = cells[0].innerHTML;
                document.getElementById("importMenu").style.display = "none";
                importDiagram(id);                
            });
        }
      }
    };
    xhttp.open("GET", "ajax_functions/getpaths.php?", true);
    xhttp.send();
}

drawCanvas();