var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var offsetX = 0;
var offsetY = 0;
var mouseX;
var mouseY;
document.getElementById('chemins').onclick = dessinerChemin;
document.getElementById('dessin').onclick = dessinerFleche;
document.getElementById('suppression').onclick = supprimerObjet;
document.getElementById('valider').onclick = dessinerCarre;
document.getElementById('findPath').onclick = renderPaths;
document.getElementById('submit').onclick = showChemin;
document.getElementById('selectCarre').addEventListener('change', (event) => showCategoryCarre(event.target.value));
document.getElementById('fermer2').addEventListener('click', () => exitMenu());
let creerCarre = document.getElementById('creerCarre');
let fermer = document.getElementById('fermer');
document.getElementById('export').addEventListener('click', () => exportDiagram());
document.getElementById('import').addEventListener('click', () => importDiagram());

creerCarre.addEventListener('click', function() {
    document.getElementById('contextMenu').style.display = 'block';
});

fermer.addEventListener('click', function() {
    document.getElementById('contextMenu').style.display = 'none';
});

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

var squares = [
    new Square(0, 100, 100, 50, 'red', -1, -1),
    new Square(1, 300, 100, 50, 'green', -1, -1),
    new Square(2, 100, 300, 50, 'blue', -1, -1),
    new Square(3, 300, 300, 50, 'yellow', -1, -1)
];

var arrows = [];
var currentArrow;
var selectedSquare;
var points = 0;

function Square(id, x, y, size, color, maxInput, maxOutput) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.input = 0;
    this.output = 0;
    this.maxInput = maxInput;
    this.maxOutput = maxOutput;
    this.connections = [];
    this.nom = null;
    this.description = null;
    this.vraisemblance = null;
}

// Define the draw method for the Square class
Square.prototype.draw = function() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.size, this.size);
}

// Define the containsPoint method for the Square class
Square.prototype.containsPoint = function(x, y) {
    return x >= this.x && x <= this.x + this.size && y >= this.y  && y <= this.y + this.size;
}

// Define the Arrow class
function Arrow(startX, startY) {
    this.startX = startX;
    this.startY = startY;
    this.endX = startX;
    this.endY = startY;
    this.drawing = true;
    this.startSquare = null;
    this.endSquare = null;
    this.color = 'black';
    this.nom = null;
    this.description = null;
    this.vraisemblance = null;
}

// Define the updateEnd method for the Arrow class
Arrow.prototype.updateEnd = function(x, y) {
    this.endX = x;
    this.endY = y;
}

Arrow.prototype.updateStart = function(x, y) {
    this.startX = x;
    this.startY = y;
}

// Define the finishDrawing method for the Arrow class
Arrow.prototype.finishDrawing = function() {
    this.draw();
    this.drawing = false;
}

// Define the draw method for the Arrow class
Arrow.prototype.draw = function() {
    var ctx = document.getElementById('canvas').getContext('2d');
    ctx.strokeStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(this.startX, this.startY);
    ctx.lineTo(this.endX, this.endY);
    ctx.stroke();

    // Draw the arrow head using a triangle oriented to the end of the arrow
    var angle = Math.atan2(this.endY - this.startY, this.endX - this.startX);
    ctx.fillStyle = this.color;
    ctx.save();
    ctx.translate(this.endX, this.endY);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-10, -10);
    ctx.lineTo(-10, 10);
    ctx.closePath();
    ctx.restore();
    ctx.fill();
}

Arrow.prototype.containsPoint = function(x, y) {
    var dx = this.endX - this.startX;
    var dy = this.endY - this.startY;
    var length = Math.sqrt(dx * dx + dy * dy);
    var dot = ((x - this.startX) * dx + (y - this.startY) * dy) / length;
    var closestX = this.startX + dot * dx / length;
    var closestY = this.startY + dot * dy / length;
    var onSegment = dot > 0 && dot < length;
    if (!onSegment) return false;
    dx = x - closestX;
    dy = y - closestY;
    var distance = Math.sqrt(dx * dx + dy * dy);
    return distance < 10;
}

function drawCanvas() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
		// Draw the squares
		squares.forEach(function(square) {
			square.draw();
		});
		
		// Draw the current arrow if there is one
		if (currentArrow) {
			currentArrow.draw();
		}

        arrows.forEach(function(arrow) {
            arrow.draw();
        });
}

function dessinerFleche() {
    document.body.style.cursor = 'crosshair';
    drawingTool = true;

}

function supprimerObjet() {
    document.body.style.cursor = 'crosshair';
    removingTool = true;
}

function dessinerCarre() {
    document.body.style.cursor = 'crosshair';
    document.getElementById('contextMenu').style.display = 'none';
    drawingSquare = true;
    squareChoice = document.getElementById('selectCarre').value;
    switch (squareChoice) {
        case 'partie_prenantes':
            maxInputChoice = 0;
            maxOutputChoice = -1;
            break;

        case 'evements_intermediaires':
            maxInputChoice = -1;
            maxOutputChoice = -1;
            break;

        case 'evements_redoutes':
            maxInputChoice = -1;
            maxOutputChoice = 0;
            break;

        default:
            break;
    }
}


canvas.addEventListener('mousedown', function(e){

    mouseX = e.pageX - canvas.offsetLeft;
    mouseY = e.pageY - canvas.offsetTop;

    for (let i = 0; i < squares.length; i++) {
        if (squares[i].containsPoint(mouseX, mouseY) === true){
            if (!drawingTool && !drawingSquare && !removingTool){
                selectedSquare = squares[i];
                selectedObject = squares[i];
                //console.log(selectedSquare + " " + selectedObject);
                //console.log(squares);
            }

            if (drawingArrow && points === 1){
                if (squares[i].input + 1 <= squares[i].maxInput || squares[i].maxInput < 0){
                    points = 2;
                    squares[i].input += 1;
                    //console.log("nombre input : " + squares[i].input);
                    currentArrow.updateEnd(squares[i].x, squares[i].y + squares[i].size / 2);
                    currentArrow.endSquare = squares[i];
                    currentArrow.startSquare.connections.push(squares[i]);
                } else {
                    alert("Pas plus d'entrées");
                    exitTool();
                }
            }

            if (drawingTool && points === 0){

                if (squares[i].output + 1 <= squares[i].maxOutput || squares[i].maxOutput < 0){
                    drawingArrow = true;
                    points = 1;
                    var newArrow = new Arrow(squares[i].x + squares[i].size, squares[i].y + squares[i].size / 2);
                    newArrow.startSquare = squares[i];
                    currentArrow = newArrow;
                    squares[i].output += 1;
                    //console.log("nombre output : " + squares[i].output);
                } else {
                    alert("Pas plus de sorties");
                    exitTool();
                }
            }

            if (removingTool){
                if (squares[i].input === 0 && squares[i].output === 0){
                    squares.splice(i, 1);
                    //console.log("suppression");
                    reassignIds();
                    drawCanvas();
                    exitTool();
                } else {
                    alert('Impossible de supprimer une case avec des connexions');
                    exitTool();
                }
            }
        }
    }

    for (let i = 0; i < arrows.length; i++) {
        if (arrows[i].containsPoint(mouseX, mouseY)) {
            selectedArrow = arrows[i];
            console.log(arrows[i]);
            if (removingTool){
                arrows[i].startSquare.output -= 1;
                arrows[i].endSquare.input -= 1;
                arrows.splice(i, 1);
                drawCanvas();
                exitTool();
            }

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
        currentArrow.finishDrawing();
        showCategoryArrow();
        arrows.push(currentArrow);
        showInfoMenu(currentArrow);
        currentArrow = null;
        exitTool();
    }

    if (!drawingTool && !drawingSquare && !removingTool && !drawingArrow && !drawingPath && !selectedArrow && !selectedSquare){
        console.log("exit menu");
        exitMenu();
    }

    if (drawingSquare){
        var newSquare = new Square(squares.length , mouseX, mouseY, 50, 'black', maxInputChoice, maxOutputChoice);
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

document.addEventListener('keydown', evt => {
    if (evt.key === 'Escape') {
        exitTool();
    }
});

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

// Reaffecter les id des carrés
function reassignIds() {
    for (let i = 0; i < squares.length; i++) {
        squares[i].id = i;
    }
}

function dessinerChemin() {
    document.body.style.cursor = 'crosshair';
    drawingPath = true;
}

function mergePaths() {
    paths[paths.length] = pathTemp;
    pathTemp = [];
    console.log(paths);
    arrows.forEach(arrow => {
        arrow.color = 'black';
    });
    drawCanvas();
}

function showChemin() {
    let value = document.getElementById("showChemin").value;
    arrows.forEach(arrow => {
        arrow.color = 'black';
    }); 
    if (paths.length >= (value)){
        paths[value - 1].forEach(arrow => {
            if (arrow instanceof Arrow){
                arrow.color = 'green';
            }
        });
    }
    drawCanvas();
}

function showInfoMenu(object) {
    let infoMenu = document.getElementById("infoMenu");
    let infoMenuList = document.getElementById("infoMenuList");
    let infoMenuData = infoMenuList.getElementsByTagName("td");
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
            console.log(selectedSquare);
            //modifiedData = button.parentNode.indexOf(button.parentNode.parentNode);

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
        inputInfoData.style.display = "none";
        modifierData.style.display = "none";

        switch (modifiedData) {
            case "id":
                selectedObject.id = inputInfoData.value;
                break;

            case "nom":
                selectedObject.nom = inputInfoData.value;
                break;

            case "description":
                selectedObject.description = inputInfoData.value;
                break;

            case "vraisemblance":
                selectedObject.vraisemblance = inputInfoData.value;
                break;
        
            default:
                break;
        }
        showInfoMenu(selectedObject);
    });
}

function exitMenu() {
    let infoMenu = document.getElementById("infoMenu");
    infoMenu.style.display = "none";
    selectedObject = null;
    selectedArrow = null;
}

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
                //Get full information of the selected row
                var row = this.parentNode.parentNode;
                var cells = row.getElementsByTagName('td');
                var id = cells[0].innerHTML;
                var nom = cells[1].innerHTML;
                var description = cells[2].innerHTML;
                console.log('id : ' + id + ', nom : ' + nom + ', description : ' + description);
                dessinerCarre();
            });
        }
      }
    };
    xhttp.open("GET", "getcategory.php?category="+str, true);
    xhttp.send();
}

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
                //Get full information of the selected row
                var row = this.parentNode.parentNode;
                var cells = row.getElementsByTagName('td');
                var id = cells[0].innerHTML;
                var nom = cells[1].innerHTML;
                var description = cells[2].innerHTML;
                selectedObject.id = id;
                selectedObject.nom = nom;
                selectedObject.description = description;
                showInfoMenu(selectedObject);
            });
        }
      }
    };
    xhttp.open("GET", "getcategory.php?category=evements_intermediaires", true);
    xhttp.send();
}   

function exportDiagram() {
    var xhttp;
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
        }
    };
}

function dessinerChemin() {
    document.body.style.cursor = 'crosshair';
    drawingPath = true;
}

function mergePaths() {
    paths[paths.length] = pathTemp;
    pathTemp = [];
    console.log(paths);
    arrows.forEach(arrow => {
        arrow.color = 'black';
    });
    drawCanvas();
}

function showChemin() {
    let value = document.getElementById("showChemin").value;
    arrows.forEach(arrow => {
        arrow.color = 'black';
    }); 
    if (paths.length >= (value)){
        paths[(value - 1)].forEach(arrow => {
            if (arrow instanceof Arrow){
                arrow.color = 'green';
            }
        });
    }
    drawCanvas();
}

function showInfoMenu(object) {
    let infoMenu = document.getElementById("infoMenu");
    let infoMenuList = document.getElementById("infoMenuList");
    let infoMenuData = infoMenuList.getElementsByTagName("td");
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
            console.log(selectedSquare);
            //modifiedData = button.parentNode.indexOf(button.parentNode.parentNode);

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
        inputInfoData.style.display = "none";
        modifierData.style.display = "none";

        switch (modifiedData) {
            case "id":
                selectedObject.id = inputInfoData.value;
                break;

            case "nom":
                selectedObject.nom = inputInfoData.value;
                break;

            case "description":
                selectedObject.description = inputInfoData.value;
                break;

            case "vraisemblance":
                selectedObject.vraisemblance = inputInfoData.value;
                break;
        
            default:
                break;
        }
        showInfoMenu(selectedObject);
    });
}

function exitMenu() {
    let infoMenu = document.getElementById("infoMenu");
    infoMenu.style.display = "none";
    selectedObject = null;
    selectedArrow = null;
}

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
                //Get full information of the selected row
                var row = this.parentNode.parentNode;
                var cells = row.getElementsByTagName('td');
                var id = cells[0].innerHTML;
                var nom = cells[1].innerHTML;
                var description = cells[2].innerHTML;
                console.log('id : ' + id + ', nom : ' + nom + ', description : ' + description);
                dessinerCarre();
            });
        }
      }
    };
    xhttp.open("GET", "getcategory.php?category="+str, true);
    xhttp.send();
}

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
                //Get full information of the selected row
                var row = this.parentNode.parentNode;
                var cells = row.getElementsByTagName('td');
                var id = cells[0].innerHTML;
                var nom = cells[1].innerHTML;
                var description = cells[2].innerHTML;
                selectedObject.id = id;
                selectedObject.nom = nom;
                selectedObject.description = description;
                showInfoMenu(selectedObject);
            });
        }
      }
    };
    xhttp.open("GET", "getcategory.php?category=evements_intermediaires", true);
    xhttp.send();
}   

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
    xhttp.open("POST", "export.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("data=" + JSON.stringify(data[0]) + "&data2=" + JSON.stringify(data[1]) + "&data3=" + JSON.stringify(data[2]));
    //console.log("data=" + JSON.stringify(squares) + "&data2=" + JSON.stringify(arrows) + "&data3=" + JSON.stringify(paths));
}

function importDiagram() {
    var xhttp;
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            //console.log(this.responseText);
            var data = JSON.parse(this.responseText);
            var dataSquare = data.squares;
            var dataArrow = data.arrows;
            var dataPath = data.paths;
            squares = [];
            arrows = [];
            paths = [];
            dataSquare.forEach(element => {
                squares.push(new Square(element.id, element.x, element.y, element.size, element.color, element.maxInput, element.maxOutput));
            });
            dataArrow.forEach(element => {
                var arrow = new Arrow(element.startX, element.startY);
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
    xhttp.open("GET", "import.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send();
};

drawCanvas();