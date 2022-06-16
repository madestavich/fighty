"use strict";

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

//*----------------------------------------------------------------

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let isDrawing = false;
let x = 0;
let y = 0;

function lineStart(e) {
  e.preventDefault();
  x = e.offsetX || e.touches[0].clientX;
  y = e.offsetY || e.touches[0].clientY;
  isDrawing = true;
}

function lineMove(e) {
  // e.preventDefault();
  if (isDrawing === true) {
    drawLine(
      context,
      x,
      y,
      e.offsetX || e.touches[0].clientX,
      e.offsetY || e.touches[0].clientY
    );
    x = e.offsetX || e.touches[0].clientX;
    y = e.offsetY || e.touches[0].clientY;
  }
}

function lineEnd(e) {
  e.preventDefault();
  if (isDrawing === true) {
    drawLine(
      context,
      x,
      y,
      e.offsetX || e.changedTouches[0].clientX,
      e.offsetY || e.changedTouches[0].clientY
    );
    isDrawing = false;
  }
}

function drawLine(context, x1, y1, x2, y2) {
  context.beginPath();
  context.strokeStyle = "white";
  context.lineWidth = 3;
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();
  context.closePath();
}

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
  lineStart(e);
});
canvas.addEventListener("mousemove", (e) => {
  lineMove(e);
});
canvas.addEventListener("mouseup", (e) => {
  lineEnd(e);
});
