import { statuses } from '../../store/consts.js';
import { Component } from '../../managers/component/component.js';

/**
 * Плеер
 */
export class Player extends Component {
    constructor(props) {
        super(props);

        this.template = Handlebars.templates['player.hbs'];

        this.state = {
            defaultSong: {
                title: 'Fade in',
                group: 'Apocalyptica',
                album: '../../assets/backgrounds/apocalyptica-metalica-cover-album.jpg',
                audio: '../../assets/mp3/apocalyptica-fade.mp3',
            },
        };

        this.timer = null;
        this.percent = 0;
    }

    /**
     * Поиск элементов управления плеера
     */
    didMount() {
        this.audio = document.getElementById('music-js');
        this.lastAudio = JSON.parse(localStorage.getItem('lastAudio'));
        this.playButton = document.getElementById('play');
        this.timeLine = document.getElementById('time-line-js');
        this.progressBar = document.getElementById('progress-bar-js');
        this.repeatButton = document.getElementById('repeat-button-js');
        this.volumeButton = document.getElementById('volume-button-js');
        this.volumeInput = document.getElementById('volume-input-js');
        this.playerTitle = document.getElementById('player-title-js');
        this.playerAlbum = document.getElementById('player-album-js');
        this.playerGroup = document.getElementById('player-group-js');

        this.setLastTrack(this.lastAudio || this.state.defaultSong);
    }

    /**
     * Функция обработки клика на иконку Play.
     * @param target
     */
    tooglePlay(target) {
        if (target.dataset.status === statuses.statusOff) {
            this.audioPlay();
            return;
        }

        this.audio.pause();
        // eslint-disable-next-line no-param-reassign
        target.dataset.status = statuses.statusOff;
        // eslint-disable-next-line no-param-reassign
        target.src = statuses.iconPlay;
        clearTimeout(this.timer);
    }

    /**
     * Функция, которая устанавливает на проигрывание либо defaultSong или песню из localStorage.
     * @param song
     */
    setLastTrack(song) {
        this.playerTitle.innerText = song.title;
        this.playerGroup.innerText = song.group;
        this.playerAlbum.src = song.album;
        this.audio.src = song.audio;
    }

    /**
     * Функция, которая устанавлвает таймаут для вызова функции изменения progressBar.
     * @param duration
     * @param element
     */
    startTimer(duration, element) {
        if (this.percent < 100) {
            this.timer = setTimeout(() => this.advance(duration, element), 10);
        }
    }

    /**
     * Функция которая изменят ширину progressBar у песни.
     * @param duration - длина пенси
     * @param element - html объект <audio>
     */
    advance(duration, element) {
        const increment = 10 / duration;
        this.percent = Math.min(increment * element.currentTime * 10, 100);
        this.progressBar.style.width = `${this.percent}%`;
        this.startTimer(duration, element);
    }

    /**
     * Функция, которая запускает проигрыавание песни.
     */
    audioPlay() {
        this.audio.play();
        this.playButton.src = statuses.iconPause;
        this.playButton.dataset.status = statuses.statusOn;
    }

    /**
     * Функция перемотки трека.
     * @param {MouseEvent} event
     */
    seek(event) {
        const audioPercent = event.offsetX / this.timeLine.offsetWidth;
        this.audio.currentTime = audioPercent * this.audio.duration;
        this.progressBar.width = `${audioPercent}%`;
        clearTimeout(this.timer);
        this.audioPlay();
    }

    /**
     * Функция смены текущей песни.
     * @param item
     */
    changeSong(item) {
        const currentSong = document.querySelector('.track-item_active');
        clearTimeout(this.timer);

        if (currentSong) {
            currentSong.classList.remove('track-item_active');
        }
        item.classList.add('track-item_active');

        const title = item.querySelector('.track-item__title');
        const group = item.querySelector('.track-item__group');
        const album = item.querySelector('.track-item__img');
        const newAudio = item.querySelector('.track-item__album');

        this.playerTitle.innerText = title.textContent;
        this.playerGroup.innerText = group.textContent;
        this.playerAlbum.src = album.src;
        this.audio.src = newAudio.dataset.audio;
        this.audioPlay();

        const newLastAudio = {
            title: this.playerTitle.innerText,
            group: this.playerGroup.innerText,
            album: this.playerAlbum.src,
            audio: this.audio.src,
        };

        localStorage.setItem('lastAudio', JSON.stringify(newLastAudio));
    }

    /**
     * Функция, которая навешивает обработчики событий на элементы управления плейера.
     */
    setEventListeners() {
        this.didMount();

        this.playButton.addEventListener('click', (event) => {
            this.tooglePlay(event.target);
        });

        this.timeLine.addEventListener('click', (event) => {
            this.seek(event);
        });

        this.audio.addEventListener('ended', () => {
            this.playButton.src = statuses.iconPlay;
            this.playButton.dataset.status = statuses.statusOff;
            this.progressBar.style.width = '0%';
            this.percent = 0;
            clearTimeout(this.timer);
        });

        this.audio.addEventListener('playing', (event) => {
            this.advance(event.target.duration, this.audio);
        });

        this.audio.addEventListener('pause', () => {
            clearTimeout(this.timer);
        });

        this.repeatButton.addEventListener('click', (event) => {
            const { target } = event;
            const loopFlag = !this.audio.loop;

            this.audio.loop = loopFlag;
            target.style.filter = loopFlag ? 'invert(0)' : 'invert(0.8)';
        });

        this.volumeButton.addEventListener('click', () => {
            const viewFlag = this.volumeInput.dataset.hidden === 'false';

            this.volumeInput.dataset.hidden = viewFlag;
            this.volumeInput.style.display = viewFlag ? 'none' : 'block';
        });

        this.volumeInput.oninput = (event) => {
            this.audio.volume = parseFloat(event.target.value / 100);
        };
    }

    /**
     * Функция, которая добавляет обработчик клика на треки во view.
     * @param tracksWrap
     */
    setEventToTracks(tracksWrap) {
        const tracks = tracksWrap.querySelectorAll('.track-item');

        tracks.forEach((item) => {
            const trackPlay = item.querySelector('.track-item__album');
            trackPlay.addEventListener('click', () => {
                this.changeSong(item);
            });
        });
    }

    /**
     * Отрисовка компонента
     * @returns {*|string}
     */
    render() {
        return this.template();
    }
}
