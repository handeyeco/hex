// All of the constants shared between Hexagons
const hexagonPrototypeGenerator = function (sideLength) {
  const angle = 0.523598776;
  const height = Math.sin(angle) * sideLength;
  const radius = Math.cos(angle) * sideLength;
  const rectangleHeight = sideLength + 2 * height;
  const rectangleWidth = 2 * radius;

  const draw = function (canvasContext, mouseX, mouseY) {
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
      console.log(this);
      canvasContext.fill();
    } else {
      canvasContext.stroke();
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

// Variables specific to individual hexagons
const Hexagon = function (x, y, hex) {
  let color = "steelblue";

  const newHex = {
    x,
    y,
    color,
    vector1: [x + hex.radius, y],
    vector2: [x + hex.rectangleWidth, y + hex.height],
    vector3: [x + hex.rectangleWidth, y + hex.height + hex.sideLength],
    vector4: [x + hex.radius, y + hex.rectangleHeight],
    vector5: [x, y + hex.sideLength + hex.height],
    vector6: [x, y + hex.height]
  }

  return Object.setPrototypeOf(newHex, hex);
}
