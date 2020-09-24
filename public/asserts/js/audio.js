'use strict';
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

playButton.dataset.status = "off";

const defualtSong = {
    'title': 'Fade in',
    'group': 'Apocalyptica',
    'album': 'asserts/backgrounds/fadein.jpg',
    'audio': 'asserts/mp3/fade.mp3'
};

const setLastTrack = song => {
    playerTitle.innerText = song.title;
    playerGroup.innerText = song.group;
    playerAlbum.src = song.album;
    audio.src = song.audio;
};

setLastTrack( lastAudio ? lastAudio : defualtSong);

const audioPlay = () => {
    audio.play();
    playButton.src = 'asserts/icons/pause-solid.svg';
    playButton.dataset.status = 'on';
};

const changeSong = (item) => {
    const currentSong = document.querySelector('.track-item_active');
    if (currentSong) {
        currentSong.classList.remove('track-item_active');
    }
    item.classList.add('track-item_active');

    playerTitle.innerText = item.childNodes[3].childNodes[1].textContent;
    playerGroup.innerText = item.childNodes[3].childNodes[3].textContent;
    playerAlbum.src = item.childNodes[1].childNodes[3].src;
    audio.src = item.childNodes[1].dataset.audio;
    audioPlay();

    const newlastAudio = {
        'title': playerTitle.innerText,
        'group': playerGroup.innerText,
        'album': playerAlbum.src,
        'audio': audio.src
    };

    localStorage.setItem('lastAudio', JSON.stringify(newlastAudio));
};

const advance = (duration, element) => {
    const increment = 10/duration;
    percent = Math.min(increment * element.currentTime * 10, 100);
    progressBar.style.width = percent+'%';
    startTimer(duration, element);
};

const seek = (event) => {
    const audio_percent = event.offsetX / timeLine.offsetWidth;
    audio.currentTime = audio_percent * audio.duration;
    progressBar.width = audio_percent+'%';
    audioPlay();
};

const startTimer = (duration, element) => {
    if(percent < 100) {
        timer = setTimeout(() => advance(duration, element), 10);
    }
};

const tooglePlay = (target) => {
    if(target.dataset.status === 'off') {
        audioPlay()
    } else {
        audio.pause();
        target.dataset.status = 'off';
        target.src = 'asserts/icons/play-solid.svg';
    }
};

timeLine.addEventListener('click', seek);

songs.forEach((item) => {
    item.childNodes[1].addEventListener('click', () => {
        changeSong(item);
    });
});

audio.addEventListener('ended', (event) => {
    playButton.src = 'asserts/icons/play-solid.svg';
    playButton.dataset.status = 'off';
    progressBar.style.width = '0%';
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
    target.style.filter = loopFlag ? 'invert(0)' : 'invert(.8)';
});

volumeButton.addEventListener('click', (event) => {
    const viewFlag = volumeInput.dataset.hidden === 'false';

    volumeInput.dataset.hidden = viewFlag;
    volumeInput.style.display = viewFlag ? 'none' : 'block';
});

volumeInput.oninput = (event) => {
    audio.volume = parseFloat(event.target.value / 100);
};
