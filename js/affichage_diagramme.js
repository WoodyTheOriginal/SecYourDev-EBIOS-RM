	// Define the Square class
	function Square(x, y, size, color) {
		this.x = x;
		this.y = y;
		this.size = size;
		this.color = color;
		this.hovering = false;
		this.dragging = false;
	}

	// Define the draw method for the Square class
	Square.prototype.draw = function() {
		var ctx = document.getElementById('canvas').getContext('2d');
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);

		// Draw the button if the square is being hovered over
		if (this.hovering) {
			ctx.fillStyle = 'white';
			ctx.fillRect(this.x + this.size / 2 + 5, this.y - 10, 20, 20);
			ctx.strokeStyle = 'black';
			ctx.strokeRect(this.x + this.size / 2 + 5, this.y - 10, 20, 20);
		}
	}

	// Define the containsPoint method for the Square class
	Square.prototype.containsPoint = function(x, y) {
		return x >= this.x - this.size / 2 && x <= this.x + this.size / 2 && y >= this.y - this.size / 2 && y <= this.y + this.size / 2;
	}

	// Define the Arrow class
	function Arrow(startX, startY) {
	this.startX = startX;
	this.startY = startY;
	this.endX = startX;
	this.endY = startY;
	this.drawing = true;
	}

	// Define the updateEnd method for the Arrow class
	Arrow.prototype.updateEnd = function(x, y) {
		this.endX = x;
		this.endY = y;
	}

	// Define the finishDrawing method for the Arrow class
	Arrow.prototype.finishDrawing = function() {
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
	}

	// Initialize the canvas and variables
	var canvas = document.getElementById('canvas');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	var squares = [
		new Square(100, 100, 50, 'red'),
		new Square(300, 100, 50, 'green'),
		new Square(100, 300, 50, 'blue'),
		new Square(300, 300, 50, 'yellow')
	];
	var currentArrow = null;
	var selectedSquare = null;
	var offsetX = 0;
	var offsetY = 0;

	// Define the drawCanvas function to draw the squares and arrows
	function drawCanvas() {
	var ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, canvas.width, canvas.height);
		// Draw the squares
		squares.forEach(function(square) {
			square.draw();
		});
		
		// Draw the current arrow if there is one
		if (currentArrow) {
			currentArrow.draw();
		}
	}

// Define the getMousePos function to get the current mouse position relative to the canvas
function getMousePos(event) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: event.clientX - rect.left,
		y: event.clientY - rect.top
	};
}

// Define the handleMouseMoveAndDown function to handle both the mousemove and mousedown events
function handleMouseMoveAndDown(event) {
	var mousePos = getMousePos(event);
	
	// If an arrow is being drawn, update its end position
	if (currentArrow) {
		currentArrow.updateEnd(mousePos.x, mousePos.y);
		drawCanvas();
	}
	
	// If a square is selected and not being dragged, check if the mouse is dragging it
	if (selectedSquare && !selectedSquare.dragging && !currentArrow) {
		var dx = mousePos.x - (selectedSquare.x - offsetX);
		var dy = mousePos.y - (selectedSquare.y - offsetY);
	if (dx * dx + dy * dy > selectedSquare.size * selectedSquare.size / 4) {
		selectedSquare.dragging = true;
	}
	}
	
	// If a square is being dragged, update its position
	if (selectedSquare && selectedSquare.dragging && !currentArrow) {
		selectedSquare.x = mousePos.x + offsetX;
		selectedSquare.y = mousePos.y + offsetY;
		drawCanvas();
	}
}

// Define the handleMouseUp function to stop dragging a square or finish drawing an arrow
function handleMouseUp(event) {
	if (selectedSquare) {
		selectedSquare.dragging = false;
		selectedSquare = null;
	}
	
	// If an arrow is being drawn, finish it and create a new arrow from the selected square to the end position
	if (currentArrow) {
	var endSquare = squares.find(function(square) {
		return square.containsPoint(currentArrow.endX, currentArrow.endY);
	});
	if (endSquare) {
		// Create a new arrow from the start square to the end square
		var startX = selectedSquare.x;
		var startY = selectedSquare.y;
		var endX = endSquare.x;
		var endY = endSquare.y;
		var newArrow = new Arrow(startX, startY);
		newArrow.updateEnd(endX, endY);
		currentArrow = null;
		
		// TODO: Store the new arrow somewhere or do something else with it
		// For now, just redraw the canvas to clear the current arrow
		drawCanvas();
	} else {
		currentArrow = null;
	}
	}
	
	drawCanvas();
}

// Define the handleMouseOver function to handle when the mouse enters a square
function handleMouseOver(event) {
	var mousePos = getMousePos(event);
	
	// Find the square that the mouse is over
	var newHoveringSquare = squares.find(function(square) {
		return square.containsPoint(mousePos.x, mousePos.y);
	});
	
	// Update the squares' hovering properties
	squares.forEach(function(square) {
	if (square === newHoveringSquare) {
		square.hovering = true;
	} else {
		square.hovering = false;
	}
	});
	
	drawCanvas();
}

// Define the handleMouseOut function to handle when the mouse leaves a
function handleMouseOut(event) {
	// Reset the squares' hovering properties
	squares.forEach(function(square) {
		square.hovering = false;
	});
	drawCanvas();
}

// Define the handleClick function to handle when a square is clicked
function handleClick(event) {
	var mousePos = getMousePos(event);
	
	// Find the square that was clicked
	var clickedSquare = squares.find(function(square) {
		return square.containsPoint(mousePos.x, mousePos.y);
	});
	
	// If the clicked square is already selected, deselect it
	if (clickedSquare === selectedSquare) {
		selectedSquare = null;
		drawCanvas();
		return;
	}
	
	// If no square is currently selected, select the clicked square
	if (!selectedSquare) {
		selectedSquare = clickedSquare;
		drawCanvas();
		return;
	}
	
	// Otherwise, start drawing a new arrow from the selected square to the clicked square
	var startX = selectedSquare.x;
	var startY = selectedSquare.y;
	var newArrow = new Arrow(startX, startY);
	newArrow.updateEnd(mousePos.x, mousePos.y);
	currentArrow = newArrow;
	drawCanvas();
}

// Add event listeners to the canvas
canvas.addEventListener('mousemove', handleMouseMoveAndDown);
canvas.addEventListener('mousedown', handleMouseMoveAndDown);
canvas.addEventListener('mouseup', handleMouseUp);
canvas.addEventListener('mouseover', handleMouseOver);
canvas.addEventListener('mouseout', handleMouseOut);
canvas.addEventListener('click', handleClick);
  
  // Draw the initial canvas
  drawCanvas();

// Define the handleDragStart function to handle when a square is dragged
function handleDragStart(event) {
	var mousePos = getMousePos(event);
	  // Find the square that was clicked
	  var clickedSquare = squares.find(function(square) {
		return square.containsPoint(mousePos.x, mousePos.y);
	  });
  // If the clicked square is not already selected, select it
  if (clickedSquare !== selectedSquare) {
    selectedSquare = clickedSquare;
    drawCanvas();
  }
  
  // Set the dragging flag to true
  selectedSquare.dragging = true;
  
  // Save the mouse position at the start of the drag
  selectedSquare.dragStartX = mousePos.x;
  selectedSquare.dragStartY = mousePos.y;
}
// Define the handleDragEnd function to handle when a square is done being dragged
function handleDragEnd(event) {
	var mousePos = getMousePos(event);
	
	// Find the square that was dragged
	var draggedSquare = squares.find(function(square) {
	  return square.containsPoint(mousePos.x, mousePos.y);
	});
	
	// If the dragged square is not already selected, select it
	if (draggedSquare !== selectedSquare) {
	  selectedSquare = draggedSquare;
	  drawCanvas();
	}
	
	// Set the dragging flag to false
	selectedSquare.dragging = false;
  }
  
  // Define the handleDrag function to handle when a square is being dragged
  function handleDrag(event) {
	var mousePos = getMousePos(event);
	
	// Calculate the distance that the mouse has moved since the drag started
	var deltaX = mousePos.x - selectedSquare.dragStartX;
	var deltaY = mousePos.y - selectedSquare.dragStartY;
	
	// Update the position of the selected square
	selectedSquare.x += deltaX;
	selectedSquare.y += deltaY;
	selectedSquare.dragStartX = mousePos.x;
	selectedSquare.dragStartY = mousePos.y;
	
	// Redraw the canvas
	drawCanvas();
  }



/*
const canvas = document.querySelector('.myCanvas');
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight-85;
const ctx = canvas.getContext('2d');
var carres = [];
var carreEnMouvement = null;
var mouseX;
var mouseY;
var squares = [];
var btnCarre = document.getElementById("creerCarre");
var arrows = [];

function dessinerCarre() {
	squares.push(new Square(50, 50, 50));
	squares.push(new Square(200, 100, 50));
	squares.push(new Square(150, 200, 50));

	draw();
}

btnCarre.onclick = function() { dessinerCarre() }; 

function draw() {
	// Clear the canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	// Loop through the squares array and draw the squares
	for (var i = 0; i < squares.length; i++) {
	  squares[i].draw();
	}

  // Loop through the arrows array and draw the arrows
  for (var i = 0; i < arrows.length; i++) {
    arrows[i].draw();
  }
	
  }

// Set up the canvas event listeners
canvas.addEventListener('mousedown', onMouseDown);
//canvas.addEventListener('mousemove', onMouseMove);
canvas.addEventListener('mouseup', onMouseUp);

// Function to handle the mousedown event
function onMouseDown(e) {
  // Loop through the squares array to check if any square is being clicked
  for (var i = 0; i < squares.length; i++) {
	if (squares[i].containsPoint(e.offsetX, e.offsetY)) {
	  // Set the clicked square as the source for the arrow drawing
	  var selectedSquare = squares[i];
	  
	  // Add a new arrow object to the arrows array
	  arrows.push(new Arrow(selectedSquare.x, selectedSquare.y));
	  
	  // Add an event listener for mousemove events to draw the arrow
	  canvas.addEventListener('mousemove', onMouseMoveArrow);
	  
	  break;
	}
  }
}

// Function to handle the mousemove event while drawing an arrow
function onMouseMoveArrow(e) {
  // Update the position of the arrow endpoint
  arrows[arrows.length - 1].x2 = e.offsetX;
  arrows[arrows.length - 1].y2 = e.offsetY;
  
  // Redraw the canvas
  draw();
}

// Function to handle the mouseup event
function onMouseUp(e) {
  // Loop through the squares array to check if any square is being clicked
  for (var i = 0; i < squares.length; i++) {
	if (squares[i].containsPoint(e.offsetX, e.offsetY)) {
	  // Set the clicked square as the destination for the arrow drawing
	  var selectedSquare2 = squares[i];
	  
	  // Update the endpoint of the arrow object
	  arrows[arrows.length - 1].x2 = selectedSquare2.x;
	  arrows[arrows.length - 1].y2 = selectedSquare2.y;
	  
	  // Remove the mousemove event listener for arrow drawing
	  canvas.removeEventListener('mousemove', onMouseMoveArrow);
	  
	  break;
	}
  }
}


/*
function dessinerCarre() {
	var x = Math.floor(Math.random() * (canvas.width - 50));
	var y = Math.floor(Math.random() * (canvas.height - 50));
	var couleur = "#6F8B96" ; 
	var valeur = "TestCarre"; // Génère une valeur aléatoire entre 0 et 99
	var hovered = false;
	var carre = {
		x: x,
		y: y,
		couleur: couleur,
		valeur: valeur
	};

	// Check if the given coordinates are within the square boundaries
	carre.containsPoint = function(x, y) {
	return (x > carre.x && x < carre.x + carre.size && y > carre.y && y < carre.y + carre.size);
	}
	

	if (this.hovered) {

		ctx.fillStyle = 'white';
        ctx.fillRect(this.x + this.size + 5, this.y, 10, 10);
    	canvas.style.cursor = 'pointer';		
	}
	carres.push(carre);
	dessinerTousLesCarres();
}

function dessinerTousLesCarres() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for (var i = 0; i < carres.length; i++) {
		var carre = carres[i];
		ctx.fillStyle = carre.couleur;
		ctx.fillRect(carre.x, carre.y, 50, 50);
		ctx.fillStyle = "#910101";
		ctx.fillText(carre.valeur, carre.x + 20, carre.y + 30);

	}
}
*//*

canvas.addEventListener('mousedown', function(event) {
	mouseX = event.pageX - canvas.offsetLeft;
	mouseY = event.pageY - canvas.offsetTop;
	for (var i = 0; i < squares.length; i++) {
		var square = squares[i];
		if (mouseX >= square.x && mouseX <= square.x + 50 && mouseY >= square.y && mouseY <= square.y + 50) {
			carreEnMouvement = square;
			break;
		}
	}
});

canvas.addEventListener('mousemove', function(event) {
	if (carreEnMouvement != null) {
		var newMouseX = event.pageX - canvas.offsetLeft;
		var newMouseY = event.pageY - canvas.offsetTop;
		carreEnMouvement.x += newMouseX - mouseX;
		carreEnMouvement.y += newMouseY - mouseY;
		mouseX = newMouseX;
		mouseY = newMouseY;
		draw();
	}
});

canvas.addEventListener('mouseup', function(event) {
	carreEnMouvement = null;
	var x = event.pageX - canvas.offsetLeft;
  	var y = event.pageY - canvas.offsetTop;
	
  	if (carreSelectionne != null && (x < carreSelectionne.x || x > carreSelectionne.x + 50 || y < carreSelectionne.y || y > carreSelectionne.y + 50)) {
    	carreSelectionne = null;
    	dessinerTousLesCarres();
  	}
});

canvas.addEventListener('mousemove', function(e) {
  // Loop through the squares array to check if any square is being hovered
  for (var i = 0; i < squares.length; i++) {
    if (squares[i].containsPoint(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop)) {
		squares[i].hovered = true;
    } else {
		squares[i].hovered = false;
    }
  }
  
  // Redraw the canvas
  draw();
});

function Square(x, y, size) {
	this.x = x;
	this.y = y;
	this.size = size;
	this.hovered = false;
	
	// Check if the given coordinates are within the square boundaries
	this.containsPoint = function(x, y) {
	  return (x > this.x && x < this.x + this.size && y > this.y && y < this.y + this.size);
	}
	
	// Draw the square on the canvas
	this.draw = function() {
	  ctx.fillStyle = 'blue';
	  ctx.fillRect(this.x, this.y, this.size, this.size);
	  
	  if (this.hovered) {
		// Draw the linking button on hover
		ctx.fillStyle = 'red';
		ctx.fillRect(this.x + this.size - 10, this.y + 10, 10, 10);
		
		// Set the cursor to the pointer on hover
		canvas.style.cursor = 'pointer';
	  }
	}
  }

// Create an Arrow class to hold the arrow properties and methods
function Arrow(x1, y1, x2, y2) {
	this.x1 = x1;
	this.y1 = y1;
	this.x2 = x2;
	this.y2 = y2;
	
	// Draw the arrow on the canvas
	this.draw = function() {
	  ctx.beginPath();
	  ctx.moveTo(this.x1, this.y1);
	  ctx.lineTo(this.x2, this.y2);
	  ctx.strokeStyle = 'red';
	  ctx.lineWidth = 2;
	  ctx.stroke();
	  
	  // Draw the arrowhead at the endpoint
	  var angle = Math.atan2(this.y2 - this.y1, this.x2 - this.x1);
	  ctx.beginPath();
	  ctx.moveTo(this.x2, this.y2);
	  ctx.lineTo(this.x2 - 10 * Math.cos(angle - Math.PI / 6), this.y2 - 10 * Math.sin(angle - Math.PI / 6));
	  ctx.lineTo(this.x2 - 10 * Math.cos(angle + Math.PI / 6), this.y2 - 10 * Math.sin(angle + Math.PI / 6));
	  ctx.closePath();
	  ctx.fillStyle = 'red';
	  ctx.fill();
	}
  }
  */
