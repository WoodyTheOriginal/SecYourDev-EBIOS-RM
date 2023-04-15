// Define the Arrow class
export function Arrow(startX, startY) {
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
Arrow.prototype.finishDrawing = function(ctx) {
    this.draw(ctx);
    this.drawing = false;
}

// Define the draw method for the Arrow class
Arrow.prototype.draw = function(ctx) {
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

    // If nom is not null, draw the nom outside the arrow around the middle
    if (this.nom !== null) {
        ctx.fillStyle = "black";
        ctx.font = "10px Arial";
        ctx.fillText(this.nom, (this.startX + this.endX) / 2, (this.startY + this.endY) / 2);
    }
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