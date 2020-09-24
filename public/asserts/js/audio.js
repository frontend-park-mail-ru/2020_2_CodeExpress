'use strict';

import * as status from './statuses.js';

const audio = document.getElementById('music-js');
const lastAudio = JSON.parse(localStorage.getItem('lastAudio'));
const playButton = document.getElementById('play');
const timeLine = document.getElementById('time-line-js');
const progressBar = document.getElementById('progress-bar-js');
const repeatButton = document.getElementById('repeat-button-js');
const volumeButton = document.getElementById('volume-button-js');
const volumeInput = document.getElementById('volume-input-js');
const playerTitle = document.getElementById('player-title-js');
const playerAlbum = document.getElementById('player-album-js');
const playerGroup = document.getElementById('player-group-js');
const songs = document.querySelectorAll('.track-item');

let timer;
let percent = 0;

playButton.dataset.status = status.statusOff;

const defaultSong = {
    'title': 'Fade in',
    'group': 'Apocalyptica',
    'album': 'asserts/backgrounds/apocalyptica-metalica-cover-album.jpg',
    'audio': 'asserts/mp3/apocalyptica-fade.mp3'
};

/**
 * Функция, которая устанавливает на проигрывание либо defaultSong или песню из localStorage
 * @param song
 */
const setLastTrack = (song) => {
    playerTitle.innerText = song.title;
    playerGroup.innerText = song.group;
    playerAlbum.src = song.album;
    audio.src = song.audio;
};

setLastTrack( lastAudio ? lastAudio : defaultSong);

/**
 * Функция, которая запускает проигрыавание песни
 */
const audioPlay = () => {
    audio.play();
    playButton.src = status.iconPause;
    playButton.dataset.status = status.statusOn;
};

/**
 * Функция смены текущей песни
 * @param item
 */
const changeSong = (item) => {
    const currentSong = document.querySelector('.track-item_active');
    if (currentSong) {
        currentSong.classList.remove('track-item_active');
    }
    item.classList.add('track-item_active');

    const title = item.querySelector('.track-item__title');
    const group = item.querySelector('.track-item__group');
    const album = item.querySelector('.track-item__img');
    const newAudio = item.querySelector('.track-item__album');

    playerTitle.innerText = title.textContent;
    playerGroup.innerText = group.textContent;
    playerAlbum.src = album .src;
    audio.src = newAudio.dataset.audio;
    audioPlay();

    const newLastAudio = {
        'title': playerTitle.innerText,
        'group': playerGroup.innerText,
        'album': playerAlbum.src,
        'audio': audio.src
    };

    localStorage.setItem('lastAudio', JSON.stringify(newLastAudio));
};

/**
 * Функция которая изменят ширину progressBar у песни
 * @param duration - длина пенси
 * @param element - html объект <audio>
 */
const advance = (duration, element) => {
    const increment = 10 / duration;
    percent = Math.min(increment * element.currentTime * 10, 100);
    progressBar.style.width = `${percent}%`;
    startTimer(duration, element);
};

/**
 * Функция перемотки трека
 * @param {MouseEvent} event
 */
const seek = (event) => {
    const audioPercent = event.offsetX / timeLine.offsetWidth;
    audio.currentTime = audioPercent * audio.duration;
    progressBar.width = `${audioPercent}%`;
    audioPlay();
};

/**
 * Функция, которая устанавлвает таймаут для вызова функции изменения progressBar
 * @param duration
 * @param element
 */
const startTimer = (duration, element) => {
    if (percent < 100) {
        timer = setTimeout(() => advance(duration, element), 10);
    }
};

/**
 * Функция обработки клика на иконку Play
 * @param target
 */
const tooglePlay = (target) => {
    if (target.dataset.status === status.statusOff) {
        audioPlay();
        return;
    } else {
        audio.pause();
        target.dataset.status = status.statusOff;
        target.src = status.iconPlay;
    }
};

timeLine.addEventListener('click', seek);

songs.forEach((item) => {
    item.childNodes[1].addEventListener('click', () => {
        changeSong(item);
    });
});

audio.addEventListener('ended', (event) => {
    playButton.src = status.iconPlay;
    playButton.dataset.status = status.statusOff;
    progressBar.style.width = '0%';
    percent = 0;
    clearTimeout(timer);
});

audio.addEventListener('playing', (event) => {
    advance(event.target.duration, audio);
});

audio.addEventListener("pause", function(_event) {
    clearTimeout(timer);
});

playButton.addEventListener('click', (event) => {
   tooglePlay(event.target);
});

repeatButton.addEventListener('click', (event) => {
    const target = event.target;
    const loopFlag = !audio.loop;

    audio.loop = loopFlag;
    target.style.filter = loopFlag ? status.invertHidden : status.invertVisible;
});

volumeButton.addEventListener('click', (event) => {
    const viewFlag = volumeInput.dataset.hidden === 'false';

    volumeInput.dataset.hidden = viewFlag;
    volumeInput.style.display = viewFlag ? status.displayNone : status.displayBlock;
});

volumeInput.oninput = (event) => {
    audio.volume = parseFloat(event.target.value / 100);
};
