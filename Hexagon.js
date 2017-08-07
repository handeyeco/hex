// All of the constants shared between Hexagons
const hexagonPrototypeGenerator = function (sideLength) {
  const angle = 0.523598776;
  const height = Math.sin(angle) * sideLength;
  const radius = Math.cos(angle) * sideLength;
  const rectangleHeight = sideLength + 2 * height;
  const rectangleWidth = 2 * radius;
  let frequencies = [];
  [415.3,466.16,523.25,554.37,622.25,698.46,783.99].forEach(elem => {
    frequencies.push(elem / 2, elem, elem * 2);
  });
  frequencies = frequencies.sort();

  let lastHexIndex = null;
  let count = 0;

  const draw = function (canvasContext, mouseX, mouseY, ac) {
    let safeHexRadius =  this.radius * 10; //Math.min(Math.max(count, 1), 20);
    let distance = Math.sqrt(Math.pow(this.centerX - mouseX, 2) + Math.pow(this.centerY - mouseY, 2));
    if (distance < safeHexRadius) {
      this.drawHexShape(canvasContext);

      if (mouseX && mouseY && canvasContext.isPointInPath(mouseX, mouseY)) {
        canvasContext.globalAlpha = 1.0;

        if (this.index !== lastHexIndex) {
          lastHexIndex = this.index;
          count++;
          // ac.updateFrequency(this.frequencies[count % this.frequencies.length]);
          ac.updateFrequency(this.frequency);
        }

      } else {
        let distanceOpacity = ((1 / safeHexRadius) * -1) * distance + 1;
        canvasContext.globalAlpha = Math.max(distanceOpacity - this.randomness, 0);
      }

      canvasContext.fillStyle = this.color;
      canvasContext.strokeStyle = this.color;
      canvasContext.fill();
      canvasContext.stroke();
    }
  }

  const drawHexShape = function (canvasContext) {
    canvasContext.beginPath();
    canvasContext.moveTo(this.vector1[0], this.vector1[1]);
    canvasContext.lineTo(this.vector2[0], this.vector2[1]);
    canvasContext.lineTo(this.vector3[0], this.vector3[1]);
    canvasContext.lineTo(this.vector4[0], this.vector4[1]);
    canvasContext.lineTo(this.vector5[0], this.vector5[1]);
    canvasContext.lineTo(this.vector6[0], this.vector6[1]);
    canvasContext.closePath();
  }

  return {
    sideLength,
    height,
    radius,
    rectangleHeight,
    rectangleWidth,
    draw,
    drawHexShape,
    frequencies
  }
}

// Variables specific to individual hexagons
const Hexagon = function (x, y, index, frequency, hex) {
  let color = "maroon";
  let randomness = Math.random();

  const newHex = {
    x,
    y,
    color,
    index,
    randomness,
    frequency,
    centerX: x + hex.rectangleWidth / 2,
    centerY: y + hex.sideLength,
    vector1: [x + hex.radius, y],
    vector2: [x + hex.rectangleWidth, y + hex.height],
    vector3: [x + hex.rectangleWidth, y + hex.height + hex.sideLength],
    vector4: [x + hex.radius, y + hex.rectangleHeight],
    vector5: [x, y + hex.sideLength + hex.height],
    vector6: [x, y + hex.height]
  }

  return Object.setPrototypeOf(newHex, hex);
}
