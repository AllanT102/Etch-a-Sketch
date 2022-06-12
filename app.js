/* Video Explanation: https://youtu.be/0T2NnnZDzkk */
const rangeLabel = document.querySelector('.custom-range-slider');
const rangeInput = rangeLabel.children[0];
const thumbWidth = 15;

rangeLabel.insertAdjacentHTML(
  'beforeend', 
  `<span class="bubble"></span>`
);

const rangeBubble = rangeLabel.children[1];

function positionBubble() {
  const {min, max, value, offsetWidth} = rangeInput;
  const total = Number(max) - Number(min);
  const perc = (Number(value) - Number(min)) / total;
  const offset = (thumbWidth/2) - (thumbWidth * perc);
  
  rangeBubble.style.left = `calc(${perc * 100}% + ${offset}px)`;
  rangeBubble.textContent = value;
}

positionBubble();

rangeInput.addEventListener('input', positionBubble)