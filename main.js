(function () {
  const installation = new URLSearchParams(window.location.search).get('installation') !== null;
  let control = document.getElementById('control');
  if (installation) {
    control.style.display = 'none'
  }

  let maxWin = Math.max(window.innerHeight, window.innerWidth);
  let boardDimension = 60;

  const frequencies = [116.54, 130.8125, 138.5925, 155.5625, 174.615, 233.08, 261.625, 277.185, 311.125, 349.23, 466.16, 523.25, 554.37, 622.25, 698.46, 932.32, 1046.5, 1108.74, 1244.5, 1396.92, 1661.2, 1864.64, 2093, 2217.48, 2489, 2793.84];
  const characters = ['z', 'x', 'c', 'v', 'b', 'n', 'm', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
  const numChars = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']
  const allowedChars = [...characters, ...numChars]
  let activeFreqs = {};

  let bells;
  const hex = hexagonPrototypeGenerator(maxWin / boardDimension)
  const hexCollect = [];

  const { ctx, canvas } = initCanvas(hex.rectangleWidth, hex.rectangleHeight)

  const iconUp = '<i class="fa fa-volume-up" aria-hidden="true"></i>'
  const iconDown = '<i class="fa fa-volume-off" aria-hidden="true"></i>'
  control.addEventListener("click", e => {
    initAudio()
    control.innerHTML = bells.toggleVolume() ? iconUp : iconDown;
  });

  canvas.addEventListener("mousemove", e => {
    drawForMouseAndClick(ctx, e.offsetX, e.offsetY);
  });

  canvas.addEventListener("click", e => {
    initAudio()
    drawForMouseAndClick(ctx, e.offsetX, e.offsetY, bells);
  });

  window.addEventListener("keydown", e => {
    if (!allowedChars.includes(e.key) || activeFreqs[e.key]) return

    initAudio()
    let charIndex = characters.indexOf(e.key)

    let freq, notInPlay;

    if (charIndex < 0) {
      do {
        freq = frequencies[randomInRange(frequencies.length)]
      } while (Object.values(activeFreqs).includes(freq))
      notInPlay = true
    } else {
      freq = frequencies[characters.indexOf(e.key)]
      notInPlay = !Object.values(activeFreqs).includes(freq)
    }

    if (notInPlay) {
      activeFreqs[e.key] = freq;
      drawForKeyPress(ctx, Object.values(activeFreqs), freq);
    }
  });

  window.addEventListener("keyup", e => {
    if (!allowedChars.includes(e.key)) return

    delete activeFreqs[e.key]
    if (Object.values(activeFreqs).length) {
      drawForKeyPress(ctx, Object.values(activeFreqs));
    } else {
      const {x, y} = randomPointOnPage()
      drawForMouseAndClick(ctx, x, y)
    }
    console.log(activeFreqs)
  });

  function initAudio() {
    if (!bells) {
      console.log('initializing audio')
      bells = new BellChorus(SimpleReverb, frequencies.length);
    }
  }

  function initCanvas(hexWidth, hexHeight) {
    let container = document.getElementById('container');
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');

    const targetWidth = window.innerWidth + hexWidth
    const targetHeight = window.innerHeight + hexHeight

    canvas.width = targetWidth * window.devicePixelRatio;
    canvas.height = targetHeight * window.devicePixelRatio;

    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    canvas.style.width = targetWidth + 'px';
    canvas.style.height = targetHeight + 'px';
    container.appendChild(canvas);

    return { ctx, canvas }
  }

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

  function randomInRange(max, min = 0) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  function randomPointOnPage() {
    const x = randomInRange(window.innerWidth)
    const y = randomInRange(window.innerHeight)
    return {x, y}
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
