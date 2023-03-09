var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var offsetX = 0;
var offsetY = 0;
var mouseX;
var mouseY;
document.getElementById('dessin').onclick = dessinerFleche;
document.getElementById('suppression').onclick = supprimerObjet;
document.getElementById('valider').onclick = dessinerCarre;
document.getElementById('findPath').onclick = renderPaths;
var drawingTool = false;
var drawingArrow = false;
var removingTool = false;
var drawingSquare = false;
var squareChoice = null;
var maxInputChoice = null;
var maxOutputChoice = null;
var paths = [];
var adjList = [];

var squares = [
    new Square(1, 100, 100, 50, 'red', -1, -1),
    new Square(2, 300, 100, 50, 'green', -1, -1),
    new Square(3, 100, 300, 50, 'blue', -1, -1),
    new Square(4, 300, 300, 50, 'yellow', -1, -1)
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
    ctx.strokeStyle = 'black';
    ctx.beginPath();
    ctx.moveTo(this.startX, this.startY);
    ctx.lineTo(this.endX, this.endY);
    ctx.stroke();

    // Draw the arrow head using a triangle oriented to the end of the arrow
    var angle = Math.atan2(this.endY - this.startY, this.endX - this.startX);
    ctx.fillStyle = 'black';
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
    drawingSquare = true;
    squareChoice = document.getElementById('selectCarre').value;
    switch (squareChoice) {
        case 'cat1':
            maxInputChoice = 0;
            maxOutputChoice = -1;
            break;

        case 'cat2':
            maxInputChoice = -1;
            maxOutputChoice = -1;
            break;

        case 'cat3':
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

        if (squares[i].containsPoint(mouseX, mouseY)){
            if (!drawingTool && !drawingSquare && !removingTool){
                selectedSquare = squares[i];
                //console.log(selectedSquare);
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
            console.log(arrows[i]);
            if (removingTool){
                arrows[i].startSquare.output -= 1;
                arrows[i].endSquare.input -= 1;
                arrows.splice(i, 1);
                drawCanvas();
                exitTool();
            }
        }        
    }

    if (drawingArrow && points === 2) {
        currentArrow.finishDrawing();
        arrows.push(currentArrow);
        currentArrow = null;
        exitTool();
    }

    if (drawingSquare){
        var newSquare = new Square(squares.length + 1 , mouseX, mouseY, 50, 'black', maxInputChoice, maxOutputChoice);
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

    if (selectedSquare) {
        selectedSquare = null;
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

function initAdjList() {
    for (let i = 0; i < squares.length; i++) {
        adjList[i] = [];
    }
    //console.log("adjList : ", adjList);
}

function addEdge(start, end) {
    adjList[start].push(end);
}

function renderPaths() {
    initAdjList();
    for (let i = 0; i < squares.length; i++) {
        for (let j = 0; j < squares[i].output; j++) {
            addEdge(squares[i].id - 1, squares[i].connections[j].id - 1);
        }
    }

    printAllPaths(squares[0].id - 1, squares[squares.length - 1].id - 1);
}

function reassignIds() {
    for (let i = 0; i < squares.length; i++) {
        squares[i].id = i + 1;
    }
}

drawCanvas();