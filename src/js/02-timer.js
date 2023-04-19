import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  inputCalendar: document.getElementById('datetime-picker'),
  startBtn: document.querySelector('button[data-start]'),
  resetBtn: document.querySelector('button[data-reset]'),
  dataDays: document.querySelector('span[data-days]'),
  dataHours: document.querySelector('span[data-hours]'),
  dataMinutes: document.querySelector('span[data-minutes]'),
  dataSeconds: document.querySelector('span[data-seconds]'),
};

let selectedDate = null;
let intervalId = null;

refs.startBtn.addEventListener('click', startTimer);
refs.resetBtn.addEventListener('click', resetTimer);

function resetTimer() {
  const now = new Date();
  flatpickrInstance.setDate(now, true);
  flatpickrInstance.setTime(now);

  clearInterval(intervalId);
  intervalId = null;
}

function startTimer() {
  refs.startBtn.setAttribute('disabled', 'true');
  refs.resetBtn.removeAttribute('disabled');

  intervalId = setInterval(() => {
    const currentDate = Date.now();
    drawingTimer(calculateTime(currentDate, selectedDate));
  }, 1000);
}

function drawingTimer({ days, hours, minutes, seconds }) {
  refs.dataDays.textContent = addLeadingZero(days);
  refs.dataHours.textContent = addLeadingZero(hours);
  refs.dataMinutes.textContent = addLeadingZero(minutes);
  refs.dataSeconds.textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function checkDate() {
  currentDate = Date.now();
  if (currentDate > selectedDate) {
    Notify.warning('Please choose a date in the future');
    refs.startBtn.setAttribute('disabled', 'true');
  } else {
    refs.startBtn.removeAttribute('disabled');
  }
}

function calculateTime(currentDate, selectedDate) {
  if (selectedDate - currentDate <= 0) {
    clearInterval(intervalId);
    Notify.success('\u{231b} \u{231b} \u{231b} \u{231b} \u{231b}');
    return;
  }
  return convertMs(selectedDate - currentDate);
}

const flatpickrInstance = flatpickr(refs.inputCalendar, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    selectedDate = selectedDates[0].getTime();
    checkDate();
  },
});

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
