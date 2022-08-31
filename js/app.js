import Floodfill from "./Floodfill.js";

const DEFAULT_COLOR = "black";
const DEFAULT_SIZE = 16;

let currentColor = DEFAULT_COLOR;
let currentSize = DEFAULT_SIZE;
let mouseDown = false;

document.body.onmousedown = () => (mouseDown = true);
document.body.onmouseup = () => (mouseDown = false);

function setCurrentColor(newColor) {
  currentColor = newColor;
}

function setFillCol(newColor) {
  fillCol = newColor;
}

function setCurrentSize(newSize) {
  currentSize = newSize;
}

const colorSwatch = document.querySelector(".color-picker-main");
const container = document.querySelector(".container");
const clearButton = document.querySelector(".clear");
const rangeLabel = document.querySelector(".custom-range-slider");
const fillBtn = document.querySelector(".fill-button");
const fillConfig = document.querySelector(".fill-config");
const boundary = document.querySelector(".boundary");
const fillColor = document.querySelector(".color-picker");
const startPoint = document.querySelector(".startpoint");

const rangeInput = rangeLabel.children[0];
const thumbWidth = 15;
let fillCol = DEFAULT_COLOR;
let fillClicked = false;
let startPressed = false;
let boundaryClicked = false;
let disableStartPointClick = false;

clearButton.onclick = (e) => {
  resetGrid(currentSize);
  disableStartPointClick = false;
};
colorSwatch.oninput = (e) => setCurrentColor(e.target.value);
fillColor.oninput = (e) => setFillCol(e.target.value);
fillBtn.onclick = () => {
  resetGrid(64);
  rangeInput.value = 64;
  positionBubble();
  fillConfig.classList.toggle("nofade");
  if (fillClicked) {
    rangeInput.disabled = false;
    fillClicked = false;
    startPressed = false;
    boundaryClicked = false;
    disableStartPointClick = false;
  } else {
    fillClicked = true;
    rangeInput.disabled = true;
  }
};
startPoint.onclick = () => {
  if (startPressed) startPressed = false;
  else {
    startPressed = true;
    boundaryClicked = false;
  }
};
boundary.onclick = () => {
  if (boundaryClicked) boundaryClicked = false;
  else {
    boundaryClicked = true;
    startPressed = false;
  }
};

function setUpGrid(size) {
  currentSize = size;
  container.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  container.style.gridTemplateRows = `repeat(${size}, 1fr)`;
  for (let i = size * size; i > 0; i--) {
    const block = document.createElement("div");
    block.classList.add("block");
    block.addEventListener("mousedown", changeColor);
    block.addEventListener("mouseover", changeColor);
    block.addEventListener("mousedown", setStart);
    container.appendChild(block);
  }
}

function startFill() {
  const floodFill = new Floodfill();
  const startCoord = getCoord();
  const blocks = document.querySelectorAll(".block");
  floodFill.fillBFS(startCoord, fillCol, blocks);
}

function getCoord() {
  let count = 0;
  const blocks = document.querySelectorAll(".block");
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].classList.contains("start")) break;
    else count++;
  }
}

function setStart(e) {
  if (e.type === "mousedown" && startPressed && !disableStartPointClick) {
    disableStartPointClick = true;
    e.target.style.backgroundColor = currentColor;
    e.target.classList.add("start");
    startFill();
  }
}

function changeColor(e) {
  if ((e.type === "mouseover" && mouseDown) || e.type === "mousedown") {
    if (!fillClicked || boundaryClicked)
      e.target.style.backgroundColor = currentColor;
    if (boundaryClicked) e.target.classList.add("edge");
  }
}

function resetGrid(size) {
  clear();
  setUpGrid(size);
}

function clear() {
  container.innerHTML = "";
}

rangeLabel.insertAdjacentHTML(
  "beforeend",
  `<span class="bubble" style="background-color:rgb(115, 185, 255);width:50px;margin:0;padding:5px;"></span>`
);

const rangeBubble = rangeLabel.children[1];

function positionBubble() {
  const { min, max, value } = rangeInput;
  const total = Number(max) - Number(min);
  const perc = (Number(value) - Number(min)) / total;
  const offset = thumbWidth / 2 - thumbWidth * perc;

  rangeBubble.style.left = `calc(${perc * 100}% + ${offset}px)`;
  rangeBubble.textContent = `${value} x ${value}`;
}

positionBubble();

rangeInput.addEventListener("input", positionBubble);
rangeInput.addEventListener("input", (e) => resetGrid(e.target.value));

window.onload = () => {
  setUpGrid(DEFAULT_SIZE);
};
