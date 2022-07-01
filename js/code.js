"use strict";

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
// canvas line configuration
const drawLineWidth = document.getElementById("lineWidth");
const drawLineColor = document.getElementById("lineColor");
const eraser = document.getElementById("eraser");
// canvas size configuration
const canvasWidth = document.getElementById("canvasWidth");
const canvasHeight = document.getElementById("canvasHeight");
const canvasConfig = {
  maxWidth: 800,
  maxHeight: 800,
  minWidth: 300,
  minHeight: 300,
  defaultWidth: 500,
  defaultHeight: 700,
};

//?--------------------------------------

canvas.width = canvasConfig.defaultWidth;
canvas.height = canvasConfig.defaultHeight;

//*----------------------------------------------------------------

let isDrawing = false;
let x = 0;
let y = 0;
let lineWidth = 2;
let lineColor = "#000";
let eraserEnabled = false;
let isErasing = false;
let eraserSize = { x: 40, y: 20 };

//?--------------------------------------

function erase(e) {
  e.preventDefault();
  context.clearRect(e.offsetX, e.offsetY, eraserSize.x, eraserSize.y);
}

function lineStart(e) {
  e.preventDefault();
  x = e.offsetX || e.targetTouches[0].clientX - canvas.offsetLeft;
  y = e.offsetY || e.targetTouches[0].clientY - canvas.offsetTop;
  isDrawing = true;
}

function lineMove(e) {
  if (isDrawing === true) {
    drawLine(
      context,
      x,
      y,
      e.offsetX || e.targetTouches[0].clientX - canvas.offsetLeft,
      e.offsetY || e.targetTouches[0].clientY - canvas.offsetTop
    );
    x = e.offsetX || e.targetTouches[0].clientX - canvas.offsetLeft;
    y = e.offsetY || e.targetTouches[0].clientY - canvas.offsetTop;
  }
}

function lineEnd(e) {
  e.preventDefault();
  if (isDrawing === true) {
    drawLine(context, x, y, e.offsetX, e.offsetY);
    isDrawing = false;
  }
}

function drawLine(context, x1, y1, x2, y2) {
  context.beginPath();
  context.strokeStyle = lineColor;
  context.lineWidth = lineWidth;
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();
  context.closePath();
}

//*----------------------------------------------------------------

canvas.addEventListener("touchstart", (e) => {
  lineStart(e);
});

canvas.addEventListener("touchmove", (e) => {
  lineMove(e);
});

canvas.addEventListener("touchend", (e) => {
  lineEnd(e);
});

canvas.addEventListener("mousedown", (e) => {
  if (eraserEnabled) {
    isErasing = true;
    erase(e);
  } else {
    lineStart(e);
  }
});
canvas.addEventListener("mousemove", (e) => {
  if (isErasing) {
    erase(e);
  } else {
    lineMove(e);
  }
});
canvas.addEventListener("mouseup", (e) => {
  if (isErasing) {
    erase(e);
    isErasing = false;
  } else {
    lineEnd(e);
  }
});

drawLineWidth.addEventListener("change", (e) => {
  lineWidth = e.target.value;
});

canvasWidth.addEventListener("change", (e) => {
  canvas.width = e.target.value;
});

canvasHeight.addEventListener("change", (e) => {
  canvas.height = e.target.value;
});

drawLineColor.addEventListener("change", (e) => {
  lineColor = e.target.value;
});

document.addEventListener("mousemove", (e) => {
  if (
    e.clientX < canvas.offsetLeft ||
    e.clientX > canvas.offsetLeft + canvas.width ||
    e.clientY < canvas.offsetTop ||
    e.clientY > canvas.offsetTop + canvas.height
  ) {
    isDrawing = false;
  } else {
    return;
  }
});

eraser.addEventListener("change", () => {
  if (!eraserEnabled) {
    eraserEnabled = true;
    canvas.classList.add("eraser-enabled");
  } else {
    eraserEnabled = false;
    canvas.classList.remove("eraser-enabled");
  }
});

let btn = document.getElementById("save");

btn.onclick = () => {
  let img = canvas.toDataURL("image/png");
  fetch("http://127.0.0.1:3000/", {
    method: "post",
    mode: "no-cors",
    headers: {
      // "Content-Type": "application/json",
    },
    body: JSON.stringify(canvasConfig),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
    });
};
