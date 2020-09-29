// eslint-disable-next-line import/extensions
import { statuses } from '../../store/consts.js';
// eslint-disable-next-line import/extensions
import Component from '../../managers/component/component.js';

export default class Player extends Component {
    constructor(props) {
        super(props);

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

    getControlElements() {
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

        this.setState({
            audio, lastAudio, playButton, timeLine, progressBar, repeatButton, volumeButton, volumeInput, playerTitle, playerAlbum, playerGroup,
        });

        this.setLastTrack(lastAudio || this.state.defaultSong);
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

        this.state.audio.pause();
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
        const {
            playerTitle, playerGroup, playerAlbum, audio,
        } = this.state;

        playerTitle.innerText = song.title;
        playerGroup.innerText = song.group;
        playerAlbum.src = song.album;
        audio.src = song.audio;
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
        const { progressBar } = this.state;
        const increment = 10 / duration;
        this.percent = Math.min(increment * element.currentTime * 10, 100);
        progressBar.style.width = `${this.percent}%`;
        this.startTimer(duration, element);
    }

    /**
     * Функция, которая запускает проигрыавание песни.
     */
    audioPlay() {
        const { audio, playButton } = this.state;
        audio.play();
        playButton.src = statuses.iconPause;
        playButton.dataset.status = statuses.statusOn;
    }

    /**
     * Функция перемотки трека.
     * @param {MouseEvent} event
     */
    seek(event) {
        const { audio, timeLine, progressBar } = this.state;
        const audioPercent = event.offsetX / timeLine.offsetWidth;
        audio.currentTime = audioPercent * audio.duration;
        progressBar.width = `${audioPercent}%`;
        clearTimeout(this.timer);
        this.audioPlay();
    }

    /**
     * Функция смены текущей песни.
     * @param item
     */
    changeSong(item) {
        const {
            audio, playerTitle, playerGroup, playerAlbum,
        } = this.state;

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

        playerTitle.innerText = title.textContent;
        playerGroup.innerText = group.textContent;
        playerAlbum.src = album.src;
        audio.src = newAudio.dataset.audio;
        this.audioPlay();

        const newLastAudio = {
            title: playerTitle.innerText,
            group: playerGroup.innerText,
            album: playerAlbum.src,
            audio: audio.src,
        };

        localStorage.setItem('lastAudio', JSON.stringify(newLastAudio));
    }

    /**
     * Функция, которая навешивает обработчики событий на элементы управления плейера.
     */
    setEventListeners() {
        const {
            audio, playButton, repeatButton, volumeButton, volumeInput, progressBar, timeLine,
        } = this.state;

        playButton.addEventListener('click', (event) => {
            this.tooglePlay(event.target);
        });

        timeLine.addEventListener('click', (event) => {
            this.seek(event);
        });

        audio.addEventListener('ended', () => {
            playButton.src = statuses.iconPlay;
            playButton.dataset.status = statuses.statusOff;
            progressBar.style.width = '0%';
            this.percent = 0;
            clearTimeout(this.timer);
        });

        audio.addEventListener('playing', (event) => {
            this.advance(event.target.duration, audio);
        });

        audio.addEventListener('pause', () => {
            clearTimeout(this.timer);
        });

        repeatButton.addEventListener('click', (event) => {
            const { target } = event;
            const loopFlag = !audio.loop;

            audio.loop = loopFlag;
            target.style.filter = loopFlag ? 'invert(0)' : 'invert(0.8)';
        });

        volumeButton.addEventListener('click', () => {
            const viewFlag = volumeInput.dataset.hidden === 'false';

            volumeInput.dataset.hidden = viewFlag;
            volumeInput.style.display = viewFlag ? 'none' : 'block';
        });

        volumeInput.oninput = (event) => {
            audio.volume = parseFloat(event.target.value / 100);
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

    init() {
        const template = Handlebars.templates['player.hbs'];
        this.props.parent.insertAdjacentHTML('beforeend', template());
        this.getControlElements();
        this.setEventListeners();
    }
}
