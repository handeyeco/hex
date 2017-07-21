// All of the constants shared between Hexagons
const hexagonPrototypeGenerator = function (sideLength) {
  const angle = 0.523598776;
  const height = Math.sin(angle) * sideLength;
  const radius = Math.cos(angle) * sideLength;
  const rectangleHeight = sideLength + 2 * height;
  const rectangleWidth = 2 * radius;

  const draw = function (canvasContext, mouseX, mouseY) {
    let distance = Math.sqrt(Math.pow(this.centerX - mouseX, 2) + Math.pow(this.centerY - mouseY, 2));

    if (distance < this.radius * 10) {
      canvasContext.fillStyle = this.color;
      canvasContext.strokeStyle = this.color;

      canvasContext.beginPath();
      canvasContext.moveTo(this.vector1[0], this.vector1[1]);
      canvasContext.lineTo(this.vector2[0], this.vector2[1]);
      canvasContext.lineTo(this.vector3[0], this.vector3[1]);
      canvasContext.lineTo(this.vector4[0], this.vector4[1]);
      canvasContext.lineTo(this.vector5[0], this.vector5[1]);
      canvasContext.lineTo(this.vector6[0], this.vector6[1]);
      canvasContext.closePath();

      if (mouseX && mouseY && canvasContext.isPointInPath(mouseX, mouseY)) {
        canvasContext.globalAlpha = 0.1;
        drawWall(canvasContext, this.vectorC, this.vector2, this.vector1, this.vector6); // Top
        canvasContext.globalAlpha = 1.0;
        drawWall(canvasContext, this.vectorC, this.vector2, this.vector3, this.vector4); // Front right
        canvasContext.globalAlpha = 0.5;
        drawWall(canvasContext, this.vectorC, this.vector4, this.vector5, this.vector6); // Front left
        // drawWall(canvasContext, this.vectorC, this.vector3, this.vector4, this.vector5); // Bottom
        // canvasContext.globalAlpha = 0.4;
        // drawWall(canvasContext, this.vectorC, this.vector5, this.vector6, this.vector1); // Back left
        // drawWall(canvasContext, this.vectorC, this.vector1, this.vector2, this.vector3); // Back right
      } else {
        let distanceOpacity = ((1 / (10 * this.radius)) * -1) * distance + 1;
        canvasContext.globalAlpha = Math.max(distanceOpacity - this.randomness, 0);
        // canvasContext.fill();
        // canvasContext.stroke();
      }
    }
  }

  return {
    sideLength,
    height,
    radius,
    rectangleHeight,
    rectangleWidth,
    draw
  }
}

function drawWall(canvasContext, vector1, vector2, vector3, vector4) {
  canvasContext.beginPath();
  canvasContext.moveTo(vector1[0], vector1[1]);
  canvasContext.lineTo(vector2[0], vector2[1]);
  canvasContext.lineTo(vector3[0], vector3[1]);
  canvasContext.lineTo(vector4[0], vector4[1]);
  canvasContext.closePath();
  canvasContext.fill();
  canvasContext.stroke();
}

// Variables specific to individual hexagons
const Hexagon = function (x, y, hex) {
  let color = "maroon";

  const newHex = {
    x,
    y,
    color,
    randomness: Math.random(),
    centerX: x + hex.rectangleWidth / 2,
    centerY: y + hex.sideLength,
    vectorC: [x + hex.rectangleWidth / 2, y + hex.sideLength],
    vector1: [x + hex.radius, y], // Top
    vector2: [x + hex.rectangleWidth, y + hex.height], // Top right
    vector3: [x + hex.rectangleWidth, y + hex.height + hex.sideLength], // Bottom right
    vector4: [x + hex.radius, y + hex.rectangleHeight], // Bottom
    vector5: [x, y + hex.sideLength + hex.height], // Bottom left
    vector6: [x, y + hex.height] // Top left
  }

  return Object.setPrototypeOf(newHex, hex);
}
