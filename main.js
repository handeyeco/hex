(function() {
  let container = document.getElementById('container');
  let control = document.getElementById('control');
  let canvas = document.createElement('canvas');
  let ctx = canvas.getContext('2d');

  let maxWin = Math.max(window.innerHeight, window.innerWidth);
  let boardDimension = 60;

  const frequencies = [116.54,130.8125,138.5925,155.5625,174.615,233.08,261.625,277.185,311.125,349.23,466.16,523.25,554.37,622.25,698.46,932.32,1046.5,1108.74,1244.5,1396.92,1661.2,1864.64,2093,2217.48,2489,2793.84];
  const characters = ['z', 'x', 'c', 'v', 'b', 'n', 'm', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
  let activeFreqs = [];

  const bells = new BellChorus(SimpleReverb, frequencies.length);
  const hex = hexagonPrototypeGenerator(maxWin / boardDimension)
  const hexCollect = [];

  container.style.width = window.innerWidth + 'px';
  container.style.height = window.innerHeight + 'px';
  canvas.width = window.innerWidth + hex.rectangleWidth;
  canvas.height = window.innerHeight + hex.rectangleHeight;
  container.appendChild(canvas);

  control.addEventListener("click", e => {
    control.innerHTML = bells.toggleVolume() ? '<i class="fa fa-volume-off" aria-hidden="true"></i>' : '<i class="fa fa-volume-up" aria-hidden="true"></i>';
  });

  canvas.addEventListener("mousemove", e => {
    drawForMouseAndClick(ctx, e.offsetX, e.offsetY);
  });

  canvas.addEventListener("click", e => {
    drawForMouseAndClick(ctx, e.offsetX, e.offsetY, bells);
  });

  window.addEventListener("keydown", e => {
    let freq = frequencies[characters.indexOf(e.key)]
    if (activeFreqs.indexOf(freq) === -1) {
      activeFreqs.push(freq);
      drawForKeyPress(ctx, activeFreqs, freq);
    }
  });

  window.addEventListener("keyup", e => {
    let freq = frequencies[characters.indexOf(e.key)]
    activeFreqs.splice(activeFreqs.indexOf(freq), 1);
    drawForKeyPress(ctx, activeFreqs);
  });

  function drawForMouseAndClick(canvasContext, mouseX, mouseY, bells) {
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    hexCollect.forEach(hexagon => { hexagon.drawMouse(canvasContext, mouseX, mouseY, bells) });
  }

  function drawForKeyPress(canvasContext, activeFreqs, newFreq) {
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    hexCollect.forEach(hexagon => { hexagon.drawKey(canvasContext, activeFreqs) });
    if (newFreq) {
      bells.ringBell(newFreq);
    }
  }

  for (let i = 0, index = 0, x, y; i < boardDimension; i++) {
    for (let j = 0; j < boardDimension; j++) {
      x = Math.floor(i * hex.rectangleWidth + ((j % 2) * hex.radius));
      y = Math.floor(j * (hex.sideLength + hex.height));

      hexCollect.push(Hexagon(x, y, index++, frequencies[Math.floor(Math.random() * frequencies.length)], hex));
    }
  }

  drawForMouseAndClick(ctx, hex.radius * 14, window.innerHeight - hex.radius * 4);
})();
