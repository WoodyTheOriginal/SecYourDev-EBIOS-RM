export function Square(id, x, y, size, color, maxInput, maxOutput) {
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
Square.prototype.draw = function(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.size, this.size);
    // If nom is not null, draw the nom outside the square
    if (this.nom !== null) {
        ctx.fillStyle = "black";
        ctx.font = "10px Arial";
        ctx.fillText(this.nom, this.x + this.size + 5, this.y + 10);
    }
}

// Define the containsPoint method for the Square class
Square.prototype.containsPoint = function(x, y) {
    return x >= this.x && x <= this.x + this.size && y >= this.y  && y <= this.y + this.size;
}