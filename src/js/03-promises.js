import { Notify } from 'notiflix/build/notiflix-notify-aio';

const formRef = document.querySelector('.form');

let amount = null;
let step = null;
let firstDelay = null;

formRef.addEventListener('submit', submitForm);

function submitForm(e) {
  e.preventDefault();
  gedDataForm();
  for (let i = 1; i <= amount; i += 1) {
    createPromise(i, firstDelay)
      .then(({ position, delay }) => {
        Notify.success(`✅ Fulfilled promise ${position} in ${delay}ms`);
      })
      .catch(({ position, delay }) => {
        Notify.failure(`❌ Rejected promise ${position} in ${delay}ms`);
      });
    firstDelay += step;
  }
}

function gedDataForm() {
  amount = Number(formRef.amount.value);
  step = Number(formRef.step.value);
  firstDelay = Number(formRef.delay.value);
}

function createPromise(position, delay) {
  const data = { position, delay };
  const shouldResolve = Math.random() > 0.3;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldResolve) {
        resolve(data);
      } else {
        reject(data);
      }
    }, delay);
  });
}
