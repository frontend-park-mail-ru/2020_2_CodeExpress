import { statuses } from 'store/consts';
import { Component } from 'managers/component/component';
import { IProps } from 'store/interfaces';

import PlayerTemplate from './player.hbs';
import './player.scss';

interface ITrack {
    title: string,
    group: string,
    album: string,
    audio: string,
}

interface IPlayerState {
    track: ITrack
}

/**
 * Плеер
 */
class Player extends Component<IProps, IPlayerState> {
    state: IPlayerState;

    private timer: NodeJS.Timeout;

    private percent: number;

    private audio: HTMLMediaElement;

    private lastAudio: ITrack;

    private playButton: HTMLElement;

    private timeLine: HTMLElement;

    private progressBar: HTMLObjectElement;

    private repeatButton: HTMLElement;

    private volumeButton: HTMLElement;

    private volumeInput: HTMLInputElement;

    private playerTitle: HTMLElement;

    private playerAlbum: HTMLImageElement;

    private playerGroup: HTMLImageElement;

    private volumeWrapper: HTMLElement;

    /**
     * Конструктор Player
     * @param {object} props - объект, в котором лежат переданные параметры
     */
    constructor(props: IProps = {}) {
        super(props);

        this.timer = null;
        this.percent = 0;

        const defaultTrack: ITrack = {
            title: 'Fade in',
            album: '../../assets/backgrounds/apocalyptica-metalica-cover-album.jpg',
            group: 'Apocalyptica',
            audio: '../../assets/mp3/apocalyptica-fade.mp3',
        };

        this.setState({ track: defaultTrack });
    }

    /**
     * Поиск элементов управления плеера
     */
    didMount(): void {
        this.audio = new Audio() as HTMLMediaElement;
        this.lastAudio = JSON.parse(localStorage.getItem('lastAudio'));
        this.playButton = document.getElementById('play');
        this.timeLine = document.getElementById('time-line-js');
        this.progressBar = document.getElementById('progress-bar-js') as HTMLObjectElement;
        this.repeatButton = document.getElementById('repeat-button-js');
        this.volumeButton = document.getElementById('volume-button-js');
        this.volumeWrapper = document.querySelector('.turntable-sub-controls__wrapper');
        this.volumeInput = document.getElementById('volume-input-js') as HTMLInputElement;
        this.playerTitle = document.getElementById('player-title-js');
        this.playerAlbum = document.getElementById('player-album-js') as HTMLImageElement;
        this.playerGroup = document.getElementById('player-group-js') as HTMLImageElement;

        this.setLastTrack(this.lastAudio as ITrack || this.state.track);
    }

    /**
     * Функция обработки клика на иконку Play.
     * @param {object} target - кнопка play/pause
     */
    tooglePlay(target: EventTarget): void {
        if ((<HTMLElement>target).dataset.status === statuses.statusOff) {
            this.audioPlay();
            return;
        }

        this.audio.pause();
        (<HTMLElement>target).dataset.status = statuses.statusOff;
        (<HTMLElement>target).classList.remove(statuses.iconPause);
        (<HTMLElement>target).classList.add(statuses.iconPlay);
        clearTimeout(this.timer);
    }

    stop() {
        this.audio.src = '';
    }

    /**
     * Функция, которая устанавливает на проигрывание либо defaultSong или песню из localStorage.
     * @param {object} song - объект с ифнормацией о треке
     */
    setLastTrack(song: ITrack): void {
        this.playerTitle.innerText = song.title;
        this.playerGroup.innerText = song.group;
        this.playerAlbum.src = song.album;
        this.audio.src = song.audio;
    }

    /**
     * Функция, которая устанавлвает таймаут для вызова функции изменения progressBar.
     * @param {number} duration - длина трека
     * @param {object} element - html объект <audio>
     */
    startTimer(duration: number, element: HTMLMediaElement): void {
        if (this.percent < 100) {
            this.timer = setTimeout(() => this.advance(duration, element), 10);
        }
    }

    /**
     * Функция которая изменят ширину progressBar у песни.
     * @param {number} duration - длина пенси
     * @param {object} element - html объект <audio>
     */
    advance(duration: number, element: HTMLMediaElement): void {
        const increment = 10 / duration;
        this.percent = Math.min(increment * element.currentTime * 10, 100);
        this.progressBar.style.width = `${this.percent}%`;
        this.startTimer(duration, element);
    }

    /**
     * Функция, которая запускает проигрыавание песни.
     */
    audioPlay(): void {
        this.audio.play().then(() => {
            this.playButton.classList.remove(statuses.iconPlay);
            this.playButton.classList.add(statuses.iconPause);
            this.playButton.dataset.status = statuses.statusOn;
        });
    }

    /**
     * Функция перемотки трека.
     * @param {MouseEvent} event
     */
    seek(event: MouseEvent): void {
        const audioPercent = event.offsetX / this.timeLine.offsetWidth;
        this.audio.currentTime = audioPercent * this.audio.duration;
        this.progressBar.width = `${audioPercent}%`;
        clearTimeout(this.timer);
        this.audioPlay();
    }

    /**
     * Функция смены текущей песни.
     * @param {object} item - трек
     */
    changeSong(item: HTMLElement): void {
        const currentSong = document.querySelector('.track-item_active');
        clearTimeout(this.timer);

        if (currentSong) {
            currentSong.classList.remove('track-item_active');
        }
        item.classList.add('track-item_active');
        const title: HTMLElement = item.querySelector('.track-item__title');
        const group: HTMLElement = item.querySelector('.track-item__group');
        const album: HTMLImageElement = item.querySelector('.track-item__img') as HTMLImageElement;
        const newAudio: HTMLElement = item.querySelector('.track-item__album');

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
    setEventListeners(): void {
        this.didMount();

        this.playButton.addEventListener('click', (event) => {
            this.tooglePlay(event.target);
        });

        this.timeLine.addEventListener('click', (event) => {
            this.seek(event);
        });

        this.audio.addEventListener('ended', () => {
            this.playButton.classList.remove(statuses.iconPause);
            this.playButton.classList.add(statuses.iconPlay);
            this.playButton.dataset.status = statuses.statusOff;
            this.progressBar.style.width = '0%';
            this.percent = 0;
            clearTimeout(this.timer);
        });

        this.audio.addEventListener('playing', (event) => {
            const { target } = event;
            this.advance((<HTMLMediaElement>target).duration, this.audio);
        });

        this.audio.addEventListener('pause', () => {
            clearTimeout(this.timer);
        });

        this.repeatButton.addEventListener('click', (event) => {
            const { target } = event;
            const loopFlag = !this.audio.loop;

            this.audio.loop = loopFlag;
            (<HTMLElement>target).style.filter = loopFlag ? 'invert(0)' : 'invert(0.8)';
        });

        this.volumeButton.addEventListener('click', () => {
            const viewFlag: boolean = this.volumeWrapper.dataset.hidden === 'false';

            this.volumeWrapper.dataset.hidden = String(viewFlag);
            this.volumeWrapper.style.display = viewFlag ? 'none' : 'block';
        });

        this.volumeInput.oninput = (event) => {
            const { target } = event;
            this.audio.volume = parseFloat(String(Number((<HTMLInputElement>target).value) / 100));
        };
    }

    /**
     * Функция, которая добавляет обработчик клика на треки во view.
     * @param {object} tracksWrap - контейнер со всеми треками на странице
     */
    setEventToTracks(tracksWrap: HTMLElement): void {
        const tracks = tracksWrap.querySelectorAll('.track-item');

        tracks.forEach((item: HTMLElement) => {
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
    render(): HTMLCollection {
        return PlayerTemplate();
    }
}

export const player: Player = new Player();
