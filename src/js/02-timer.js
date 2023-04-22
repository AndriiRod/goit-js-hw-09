import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import { Notify } from 'notiflix/build/notiflix-notify-aio';

import convertMs from './convertMsToTime.js';

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

function startTimer() {
  refs.inputCalendar.disabled = true;
  refs.startBtn.disabled = true;
  intervalId = setInterval(() => {
    const currentDate = Date.now();
    drawingTimer(calculateTime(currentDate));
  }, 1000);
}

function resetTimer() {
  refs.inputCalendar.disabled = false;
  const now = new Date();
  flatpickrInstance.setDate(now);
  clearInterval(intervalId);
  drawingTimer({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  Notify.info('Date and time updated,timer reset');
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
  const currentDate = Date.now();
  if (currentDate > selectedDate) {
    Notify.warning('Please choose a date in the future');
  } else {
    refs.startBtn.disabled = false;
  }
}

function calculateTime(currentDate) {
  if (selectedDate - currentDate <= 0) {
    refs.inputCalendar.disabled = false;
    clearInterval(intervalId);
    Notify.success('\u{231b} \u{231b} \u{231b} \u{231b} \u{231b}');
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
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
