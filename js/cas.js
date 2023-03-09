/*const canvas = document.querySelector('.myCanvas');
const ctx = canvas.getContext('2d');

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
      ctx.fillStyle = 'white';
      ctx.fillRect(this.x + this.size + 5, this.y, 10, 10);
      
      // Set the cursor to the pointer on hover
      canvas.style.cursor = 'pointer';
    }
  }
}

export { Square };*/