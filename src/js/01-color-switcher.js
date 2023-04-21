import getRandomHexColor from './hexColorGenerator';

const refsBody = document.body;
let timerId = null;
let isActive = false;

refsBody.addEventListener('click', clickCheck);

function clickCheck(e) {
  if (e.target.hasAttribute('data-start') && !isActive) startBtn(e);
  if (e.target.hasAttribute('data-stop') && isActive) stopBtn(e);
}

function startBtn(e) {
  isActive = true;
  e.target.setAttribute('disabled', 'true');
  e.target.nextElementSibling.removeAttribute('disabled');
  timerId = setInterval(() => {
    refsBody.style.backgroundColor = getRandomHexColor();
  }, 1000);
}

function stopBtn(e) {
  isActive = false;
  e.target.setAttribute('disabled', 'true');
  e.target.previousElementSibling.removeAttribute('disabled');
  clearInterval(timerId);
}
