const time = document.querySelector('.time');
const dateShow = document.querySelector('.date');
const greeting = document.querySelector('.greeting');
const greetingContainer = document.querySelector('.greeting-container');
const name = document.querySelector('.name');
const body = document.body;
let randomNum = getRandomNum(1, 20);
const slideNext = document.querySelector('.slide-next');
const slidePrev = document.querySelector('.slide-prev');
const weather = document.querySelector('.weather');
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherWind = document.querySelector('.wind');
const weatherHumidity = document.querySelector('.humidity');
const weatherDescription = document.querySelector('.weather-description');
const city = document.querySelector('.city');
const quotesContainer = document.querySelector('.quotesContainer');
const changeQuote = document.querySelector('.change-quote');
const quote = document.querySelector('.quote');
const author = document.querySelector('.author');
const player = document.querySelector('.player');
const playPrevBtn = document.querySelector('.play-prev');
const playNextBtn = document.querySelector('.play-next');
const play = document.querySelector('.play');
let isPlay = false;
let playNum = 0;
let tracks = document.querySelector('.play-list');
let numQuote = 0;
const durationTime = document.querySelector('.durationTime');
const currentTime = document.querySelector('.currentTime');
const timeline = document.querySelector(".timeline");
const progressBar = document.querySelector(".progress-bar");
const greetingTranslation = {
  "en": ['morning', 'afternoon', 'evening', 'night'],
  "ru": ['утро', 'день', 'вечер', 'ночи']
}
let lang = 'en-US';


//
// SHOW TIME
function showTime() {
  const date = new Date();
  const currentTime = date.toLocaleTimeString();
  time.textContent = currentTime;
  showDate(lang);
  getTimeOfDay();
  setTimeout(showTime, 1000);
}
showTime();

//SHOW DATE
function showDate(lang) {
  const date = new Date();
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  let currentDate = date.toLocaleDateString(lang, options);
  dateShow.textContent = currentDate[0].toUpperCase() + currentDate.slice(1);
}

function getTimeOfDay() {
  const hours = new Date().getHours();

  if (hours >= 6 && hours < 12 && lang === 'en-US') {
    return greetingTranslation.en[0];
  } else if (hours >= 12 && hours < 18 && lang === 'en-US') {
    return greetingTranslation.en[1];
  } else if (hours >= 18 && hours < 24 && lang === 'en-US') {
    return greetingTranslation.en[2];
  } else if (hours >= 0 && hours < 6 && lang === 'en-US') {
    return greetingTranslation.en[3];
  }

  if (hours >= 6 && hours < 12 && lang === 'ru') {
    return greetingTranslation.ru[0];
  } else if (hours >= 12 && hours < 18 && lang === 'ru') {
    return greetingTranslation.ru[1];
  } else if (hours >= 18 && hours < 24 && lang === 'ru') {
    return greetingTranslation.ru[2];
  } else if (hours >= 0 && hours < 6 && lang === 'ru') {
    return greetingTranslation.ru[3];
  }
}
greeting.textContent = `Good ${getTimeOfDay()}`;

function setLocalStorage() {
  localStorage.setItem('name', name.value);
  localStorage.setItem('city', city.value);
}
window.addEventListener('beforeunload', setLocalStorage);

function getLocalStorage() {
  if (localStorage.getItem('name')) {
    name.value = localStorage.getItem('name');
  }
  if (localStorage.getItem('city')) {
    city.value = localStorage.getItem('city');
  } else {
    city.value = 'Minsk';
  }
  getWeather(lang);
}
window.addEventListener('load', getLocalStorage);

//RANDOM NUMBER
function getRandomNum(min, max) {
  return Math.round(Math.random() * (max - min) + min).toString().padStart(2, '0');
}

//SET BG 
function setBg() {
  let timeOfDay = getTimeOfDay();
  const img = new Image();
  img.src = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeOfDay}/${randomNum}.jpg`;
  img.onload = () => {
    body.style.backgroundImage = `url(${img.src})`;
  };
}
// setBg();

async function getLinkToImage() {
  let timeOfDay = getTimeOfDay();
  const url = `https://api.unsplash.com/photos/random?query=${timeOfDay}&client_id=m8DvB88et46wDdoT-BqpT1NZBGHq9rMkd61aLvTY2nk`;
  const res = await fetch(url);
  const data = await res.json();

  let img = new Image();
  img.src = `${data.urls.regular}`;
  img.onload = () => {
    body.style.backgroundImage = `url(${img.src})`;
  }
}

getLinkToImage();

// SLIDER NEXT
function getSlideNext() {
  randomNum < 20 ? randomNum = (Number(randomNum) + 1).toString().padStart(2, '0') : randomNum == 20 ? randomNum = '01' : randomNum;
  setBg();
}

// SLIDER PREV
function getSlidePrev() {
  randomNum > 1 ? randomNum = (Number(randomNum) - 1).toString().padStart(2, '0') : randomNum == 1 ? randomNum = 20 : randomNum;
  setBg();
}

slideNext.addEventListener('click', () => {
  if(body.classList.contains('imgSrc')) {
    getSlideNext();
  } else {
    getLinkToImage();
  }
});

slidePrev.addEventListener('click', () => {
  if(body.classList.contains('imgSrc')) {
    getSlidePrev();
  } else {
    getLinkToImage();
  }
});

//SHOW WEATHER
async function getWeather(lang) {
try {

  let url;

  if (!city.value) {
    url = `https://api.openweathermap.org/data/2.5/weather?q=Minsk&lang=${lang}&appid=33e758605fc6ebd2f89742770c2637fa&units=metric`;
  } else {
    url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=${lang}&appid=33e758605fc6ebd2f89742770c2637fa&units=metric`;
  }

  const res = await fetch(url);
  const data = await res.json();

  weatherIcon.className = 'weather-icon owf';
  weatherIcon.classList.add(`owf-${data.weather[0].id}`);
  temperature.textContent = `${data.main.temp.toFixed(0)}°C`;
  weatherDescription.textContent = data.weather[0].description;
  weatherDescription.classList.remove('error-color');
  weatherWind.textContent = `Wind speed: ${Math.round(data.wind.speed)} m/s`;
  weatherHumidity.textContent = `Humidity: ${data.main.humidity}%`;

  if (lang === 'ru') {
    weatherWind.textContent = `Ветер: ${Math.round(data.wind.speed)} м/с`;
    weatherHumidity.textContent = `Влажность: ${data.main.humidity}%`;
  }

}catch(error) {
  weatherDescription.classList.add('error-color');
  weatherDescription.textContent = 'INCORRECT TOWN'
  temperature.textContent = ``;
  weatherWind.textContent = ``;
  weatherHumidity.textContent = ``;
}
}

document.addEventListener('DOMContentLoaded', getWeather);
city.addEventListener('change', () => {
  getWeather(city.value);
});

//GET QUOTES
async function getQuotes(lang) {

  const quotes = 'js/data.json';
  const res = await fetch(quotes);
  const data = await res.json();

  if(lang === 'ru') {
    numQuote < data.ru.length - 1 ? numQuote += 1 : numQuote = 0;
    quote.textContent = data.ru[numQuote].textRu;
    author.textContent = data.ru[numQuote].authorRu;
  } else {
    numQuote < data.enUS.length - 1 ? numQuote += 1 : numQuote = 0;
    quote.textContent = data.enUS[numQuote].textEn;
    author.textContent = data.enUS[numQuote].authorEn;
  }
}
getQuotes(lang);

changeQuote.addEventListener('click', () => {
  getQuotes(lang);
});


//AUDIOPLAYER
// import PLAYLIST
import playList from './playList.js';

// add elements PLAYLIST on html 
playList.forEach(el => {
  const li = document.createElement('li');
  li.classList.add('play-item');
  li.textContent = el.title;
  tracks.append(li);
})


const playListItems = document.querySelectorAll('.play-item');
function showActivePlayerListItem() {
  playListItems.forEach(playListItem => playListItem.classList.remove('item-active'));
  playListItems[playNum].classList.add('item-active');
}


//play sound track
play.addEventListener('click', playAudio);
const audio = new Audio();
audio.addEventListener('ended', function () {
  playNext();
});


function playAudio() {
  audio.src = playList[playNum].src;
  audio.currentTime = 0;

  if (!isPlay) {
    audio.play();
    document.querySelector('.sound-name').textContent = playList[playNum].title;
    isPlay = true;
    play.classList.toggle('pause');
    showActivePlayerListItem()
  } else {
    audio.pause();
    isPlay = false;
    play.classList.toggle('pause');
    showActivePlayerListItem()
  }
}

document.querySelector('.volume-button').addEventListener('click', () => {
  if(!audio.muted === true) {
    document.querySelector('.volume-button').classList.add('volume-button-mute');
    audio.muted = true;
  } else {
    document.querySelector('.volume-button').classList.remove('volume-button-mute');
    audio.muted = false;
  }
})

//next sound track play
function playNext() {
  playNum === playList.length - 1 ? playNum = 0 : playNum += 1;
  audio.src = playList[playNum].src;
  audio.currentTime = 0;
  if (!isPlay) {
    audio.play();
    document.querySelector('.sound-name').textContent = playList[playNum].title;
    isPlay = true;
    play.classList.add('pause');
    showActivePlayerListItem()
  } else {
    audio.play();
    document.querySelector('.sound-name').textContent = playList[playNum].title;
    isPlay = true;
    play.classList.add('pause');
    showActivePlayerListItem()
  }
}
playNextBtn.addEventListener('click', playNext);

// prev sound track play
function playPrev() {
  playNum === 0 ? playNum = playList.length - 1 : playNum -= 1;
  audio.src = playList[playNum].src;
  audio.currentTime = 0;
  if (!isPlay) {
    audio.play();
    document.querySelector('.sound-name').textContent = playList[playNum].title;
    isPlay = true;
    play.classList.add('pause');
    showActivePlayerListItem()
  } else {
    audio.play();
    document.querySelector('.sound-name').textContent = playList[playNum].title;
    isPlay = true;
    play.classList.add('pause');
    showActivePlayerListItem()
  }
}
playPrevBtn.addEventListener('click', playPrev);

//audio duration
audio.addEventListener("loadeddata", () => {
  durationTime.textContent = getTimeCodeFromNum(audio.duration);
},
  false
);

//click on timeline to skip around
timeline.addEventListener("click", e => {
  const timelineWidth = window.getComputedStyle(timeline).width;
  const timeToSeek = e.offsetX / parseInt(timelineWidth) * audio.duration;
  audio.currentTime = timeToSeek;
}, false);

//click volume slider to change volume
const volumeSlider = document.querySelector('.volume-slider');
volumeSlider.addEventListener('click', e => {
  const sliderWidth = window.getComputedStyle(volumeSlider).width;
  const newVolume = e.offsetX / parseInt(sliderWidth);
  audio.volume = newVolume;
  document.querySelector(".volume-percentage").style.width = newVolume * 100 + '%';
}, false);


//check audio percentage and update time accordingly
setInterval(() => {
  progressBar.style.width = audio.currentTime / audio.duration * 100 + "%";
  currentTime.textContent = getTimeCodeFromNum(audio.currentTime);
}, 500);

//turn 128 seconds into 2:08
function getTimeCodeFromNum(num) {
  let seconds = parseInt(num);
  let minutes = parseInt(seconds / 60);
  seconds -= minutes * 60;
  const hours = parseInt(minutes / 60);
  minutes -= hours * 60;

  if (hours === 0) return `${minutes}:${String(seconds % 60).padStart(2, 0)}`;
  return `${String(hours).padStart(2, 0)}:${minutes}:${String(
    seconds % 60
  ).padStart(2, 0)}`;
}


const settingsIcon = document.querySelector('.settingsIcon');
const settings = document.querySelector('.settings-container');


const state = {
  language: 'Ru / En',
  photoSource: 'Github / Unsplash',
  blocks: ['time', 'date','greeting', 'quote', 'weather', 'audio']
}


for (let value in state) {

  if(typeof state[value] === 'object') {
      state[value].forEach(e => {
        const label = document.createElement('label');
              label.classList.add('ios7-switch');
        const input = document.createElement('input');
              input.type = 'checkbox';
              input.checked = true;
        const span = document.createElement('span');
              span.id = `${e}`;
        const div = document.createElement('div');
              div.classList.add('switch-container');
        const p = document.createElement('p');
              p.classList.add('setting-text');
              p.id = e[0].toUpperCase() + e.slice(1);
              p.textContent = e[0].toUpperCase() + e.slice(1);
         
        settings.append(div);     
        div.append(p);
        
        label.append(input);
        label.append(span);
        div.append(label);
      });
  } else {
    const label = document.createElement('label');
          label.classList.add('ios7-switch');
    const input = document.createElement('input');
          input.type = 'checkbox';
          input.checked = true;
    const span = document.createElement('span');
          span.classList.add(`${value}`);
    const div = document.createElement('div');
          div.classList.add('switch-container');
    const p = document.createElement('p');
          p.classList.add('setting-text');
          p.id = value[0].toUpperCase() + value.slice(1);
          p.textContent = value[0].toUpperCase() + value.slice(1) + ' ' + state[value];

    settings.append(div);      
    div.append(p);
    label.append(input);
    label.append(span);
    div.append(label);
  }

}

const language = document.querySelector('.language');
const photoSource = document.querySelector('.photoSource');
const timeSettings = document.getElementById('Time');
const dateSettings = document.getElementById('Date');
const greetingSettings = document.getElementById('Greeting');
const quoteSettings = document.getElementById('Quote');
const weatherSettings = document.getElementById('Weather');
const audioSettings = document.getElementById('Audio');



settingsIcon.addEventListener('click', () => {
  settings.classList.toggle('opacity');
})

language.addEventListener('click', () => {
  lang = 'ru';

  if(!language.classList.contains('active')) {
    language.classList.add('active');
    greeting.textContent = `Добрый ${getTimeOfDay()}`;
    document.getElementById('placeholder').placeholder = 'Введите имя';
    document.getElementById('Language').textContent = 'Выберите язык Ру / Анг';
    document.getElementById('PhotoSource').textContent = 'Источник фото Github / Unsplash';
    timeSettings.textContent = 'Время';
    dateSettings.textContent = 'Дата';
    greetingSettings.textContent = 'Приветствие';
    quoteSettings.textContent = 'Цитата дня';
    weatherSettings.textContent = 'Погода';
    audioSettings.textContent = 'Аудиоплеер';
    getWeather(lang);
    showDate(lang);
    getQuotes(lang);
  } else {
    lang = 'en-Us';
    language.classList.remove('active');
    greeting.textContent = `Good ${getTimeOfDay()}`;
    document.getElementById('placeholder').placeholder = 'Enter name';
    document.getElementById('Language').textContent = 'Language Ru / En';
    document.getElementById('PhotoSource').textContent = 'PhotoSource Github / Unsplash';
    timeSettings.textContent = 'Time';
    dateSettings.textContent = 'Date';
    greetingSettings.textContent = 'Greeting';
    quoteSettings.textContent = 'Qoute';
    weatherSettings.textContent = 'Weather';
    audioSettings.textContent = 'Audio';
    getWeather(lang);
    showDate(lang);
    getQuotes(lang);
  }
})

photoSource.addEventListener('click', () => {
  if(!body.classList.contains('imgSrc')) {
    setBg();
    body.classList.add('imgSrc');
  } else {
    getLinkToImage();
    body.classList.remove('imgSrc');
  }
})

document.getElementById('time').addEventListener('click', () => {
  time.classList.toggle('opacity');
})

document.getElementById('date').addEventListener('click', () => {
  dateShow.classList.toggle('opacity');
})

document.getElementById('greeting').addEventListener('click', () => {
  greetingContainer.classList.toggle('opacity');
})

document.getElementById('quote').addEventListener('click', () => {
  quote.classList.toggle('opacity');
  author.classList.toggle('opacity');
  changeQuote.classList.toggle('opacity');
})

document.getElementById('weather').addEventListener('click', () => {
  weather.classList.toggle('opacity');
})

document.getElementById('audio').addEventListener('click', () => {
  player.classList.toggle('opacity');
})
