(function() {
  let container = document.getElementById('container');
  let canvas = document.createElement('canvas');
  let ctx = canvas.getContext('2d');

  let maxWin = Math.max(window.innerHeight, window.innerWidth);
  let boardDimension = 60;

  const theremin = new Theremin(SimpleReverb);
  const hex = hexagonPrototypeGenerator(maxWin / boardDimension)
  const hexCollect = [];

  container.style.width = window.innerWidth + 'px';
  container.style.height = window.innerHeight + 'px';
  canvas.width = window.innerWidth + hex.rectangleWidth;
  canvas.height = window.innerHeight + hex.rectangleHeight;
  container.appendChild(canvas);

  canvas.addEventListener("mousemove", e => {
    theremin.waveFormCrossfade(e.offsetX / window.innerWidth);
    theremin.reverbCrossfade(e.offsetY / window.innerHeight);
    drawBoard(ctx, e.offsetX, e.offsetY);
  });

  window.addEventListener("keyup", e => {
    if (e.key === "a") {
      theremin.toggleAudio();
    }
  });

  function drawBoard(canvasContext, mouseX, mouseY) {
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    hexCollect.forEach(hexagon => { hexagon.draw(canvasContext, mouseX, mouseY, theremin) });
  }

  for (let i = 0, index = 0, x, y; i < boardDimension; i++) {
    for (let j = 0; j < boardDimension; j++) {
      x = Math.floor(i * hex.rectangleWidth + ((j % 2) * hex.radius));
      y = Math.floor(j * (hex.sideLength + hex.height));

      hexCollect.push(Hexagon(x, y, index++, 1000 + index, hex));
    }
  }

  drawBoard(ctx, hex.radius * 14, window.innerHeight - hex.radius * 4);
})();
