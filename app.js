const DEFAULT_COLOR = 'black'
const DEFAULT_SIZE = 16

let currentColor = DEFAULT_COLOR
let currentSize = DEFAULT_SIZE
let mouseDown = false;

document.body.onmousedown = () => (mouseDown = true);
document.body.onmouseup = () => (mouseDown = false);

function setCurrentColor(newColor) {
  currentColor = newColor
}

function setCurrentSize(newSize) {
  currentSize = newSize
}

const colorSwatch = document.querySelector('.color-picker');
const blocks = document.querySelectorAll('.box');
const container = document.querySelector('.container');
const clearButton = document.querySelector('.clear');
const rangeLabel = document.querySelector('.custom-range-slider');

const rangeInput = rangeLabel.children[0];
const thumbWidth = 15;

clearButton.onclick = e => resetGrid(currentSize);
colorSwatch.oninput = e => setCurrentColor(e.target.value);

function setUpGrid(size) {
  currentSize = size;
  container.style.gridTemplateColumns = `repeat(${size}, 1fr)`
  container.style.gridTemplateRows = `repeat(${size}, 1fr)`
  for(i = size * size; i > 0; i--) {
    const block = document.createElement('div')
    block.classList.add('block')
    block.addEventListener('mousedown', changeColor)
    block.addEventListener('mouseover', changeColor)
    container.appendChild(block);
  }
}

function changeColor(e) {
  if ((e.type === 'mouseover' && mouseDown) || (e.type === 'mousedown')) e.target.style.backgroundColor = currentColor;
}

function resetGrid(size) {
  clear();
  setUpGrid(size);
}

function clear() {
  container.innerHTML = ''
}

rangeLabel.insertAdjacentHTML(
  'beforeend', 
  `<span class="bubble" style="background-color:rgb(115, 185, 255);width:50px;margin:0;padding:5px;"></span>`
);

const rangeBubble = rangeLabel.children[1];

function positionBubble() {
  const {min, max, value} = rangeInput;
  const total = Number(max) - Number(min);
  const perc = (Number(value) - Number(min)) / total;
  const offset = (thumbWidth/2) - (thumbWidth * perc);
  
  rangeBubble.style.left = `calc(${perc * 100}% + ${offset}px)`;
  rangeBubble.textContent = `${value} x ${value}`;
}

positionBubble();

rangeInput.addEventListener('input', positionBubble)
rangeInput.addEventListener('input', e => resetGrid(e.target.value));



window.onload = () => {
  setUpGrid(DEFAULT_SIZE)
}
