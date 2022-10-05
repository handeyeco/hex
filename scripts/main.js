(function () {
  let bells;
  let activeFreqs = {};
  let { hex, hexCollect } = initHexagons();
  let { ctx, canvas } = initCanvas();
  const { volume, fullscreen } = initControls();

  drawForMouseAndClick(
    ctx,
    hex.radius * 14,
    window.innerHeight - hex.radius * 4
  );

  // ************
  // INITIALIZERS
  // ************
  function initControls() {
    const installation =
      new URLSearchParams(window.location.search).get("installation") !== null;
    let volume = document.getElementById("volume");
    let fullscreen = document.getElementById("fullscreen");

    if (installation) {
      volume.style.display = "none";
    } else {
      fullscreen.style.display = "none";
    }

    return { volume, fullscreen };
  }

  function initAudio() {
    if (!bells) {
      console.log("initializing audio");
      bells = new BellChorus(SimpleReverb, FREQUENCIES.length);
    }
  }

  function initHexagons() {
    let maxWin = Math.max(window.innerHeight, window.innerWidth);
    const hex = hexagonPrototypeGenerator(maxWin / BOARD_DIMENSION);
    const hexCollect = [];

    for (let i = 0, index = 0, x, y; i < BOARD_DIMENSION; i++) {
      for (let j = 0; j < BOARD_DIMENSION; j++) {
        x = Math.floor(i * hex.rectangleWidth + (j % 2) * hex.radius);
        y = Math.floor(j * (hex.sideLength + hex.height));

        hexCollect.push(
          Hexagon(
            x,
            y,
            index++,
            FREQUENCIES[Math.floor(Math.random() * FREQUENCIES.length)],
            hex
          )
        );
      }
    }

    console.log(hexCollect);

    return { hex, hexCollect };
  }

  function initCanvas() {
    let container = document.getElementById("container");
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");

    const overflow = 100;
    const targetWidth = window.innerWidth + overflow;
    const targetHeight = window.innerHeight + overflow;

    canvas.width = targetWidth * window.devicePixelRatio;
    canvas.height = targetHeight * window.devicePixelRatio;

    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    canvas.style.width = targetWidth + "px";
    canvas.style.height = targetHeight + "px";
    container.appendChild(canvas);

    return { ctx, canvas };
  }

  // ***************
  // EVENT LISTENERS
  // ***************
  const iconUp = '<i class="fa fa-volume-up" aria-hidden="true"></i>';
  const iconDown = '<i class="fa fa-volume-off" aria-hidden="true"></i>';
  volume.addEventListener("click", (e) => {
    initAudio();
    volume.innerHTML = bells.toggleVolume() ? iconUp : iconDown;
  });

  canvas.addEventListener("mousemove", (e) => {
    drawForMouseAndClick(ctx, e.offsetX, e.offsetY);
  });

  canvas.addEventListener("click", (e) => {
    initAudio();
    drawForMouseAndClick(ctx, e.offsetX, e.offsetY, bells);
  });

  window.addEventListener("resize", () => {
    ({ hex, hexCollect } = initHexagons());
    ({ ctx, canvas } = initCanvas(hex.rectangleWidth, hex.rectangleHeight));
    drawForMouseAndClick(
      ctx,
      hex.radius * 14,
      window.innerHeight - hex.radius * 4
    );
  });

  window.addEventListener("keydown", (e) => {
    console.log(e.key);
    if (!ALLOWED_CHARS.includes(e.key) || activeFreqs[e.key]) return;

    initAudio();
    let charIndex = ALPHA_CHARS.indexOf(e.key);

    let freq, notInPlay;

    if (charIndex < 0) {
      do {
        freq = FREQUENCIES[randomInRange(FREQUENCIES.length)];
      } while (Object.values(activeFreqs).includes(freq));
      notInPlay = true;
    } else {
      freq = FREQUENCIES[ALPHA_CHARS.indexOf(e.key)];
      notInPlay = !Object.values(activeFreqs).includes(freq);
    }

    if (notInPlay) {
      activeFreqs[e.key] = freq;
      drawForKeyPress(ctx, Object.values(activeFreqs), freq);
    }
  });

  window.addEventListener("keyup", (e) => {
    if (!ALLOWED_CHARS.includes(e.key)) return;

    delete activeFreqs[e.key];
    if (Object.values(activeFreqs).length) {
      drawForKeyPress(ctx, Object.values(activeFreqs));
    } else {
      const { x, y } = randomPointOnPage();
      drawForMouseAndClick(ctx, x, y);
    }
    console.log(activeFreqs);
  });

  fullscreen.addEventListener("click", () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      fullscreen.style.display = "none";
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  });

  // *******
  // DRAWERS
  // *******
  function drawForMouseAndClick(canvasContext, mouseX, mouseY, bells) {
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    hexCollect.forEach((hexagon) => {
      hexagon.drawMouse(canvasContext, mouseX, mouseY, bells);
    });
  }

  function drawForKeyPress(canvasContext, activeFreqs, newFreq) {
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    hexCollect.forEach((hexagon) => {
      hexagon.drawKey(canvasContext, activeFreqs);
    });
    if (newFreq) {
      bells.ringBell(newFreq);
    }
  }

  // *******
  // HELPERS
  // *******
  function randomInRange(max, min = 0) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  function randomPointOnPage() {
    const x = randomInRange(window.innerWidth);
    const y = randomInRange(window.innerHeight);
    return { x, y };
  }
})();
