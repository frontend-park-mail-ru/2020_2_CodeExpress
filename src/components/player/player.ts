import { isMobile, statuses } from 'store/consts';
import { Component } from 'managers/component/component';
import { IProps } from 'store/interfaces';
import { ModelTrack } from 'models/track';
import { MobilePlayer } from 'components/mobile_player/mobile_player';

import PlayerTemplate from './player.hbs';
import './player.scss';

export interface ITrack {
    title: string,
    group: string,
    album: string,
    audio: string,
}

export interface IPlayerState {
    track: ITrack
}

/**
 * Плеер
 */
class Player extends Component<IProps, IPlayerState> {
    state: IPlayerState;

    private timer: NodeJS.Timeout;

    private percent: number;

    public audio: HTMLMediaElement;

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

        // TODO: Переделать на запрос за рандомным треком к беку
        const defaultTrack: ITrack = {
            title: 'Bad Liar',
            album: 'https://musicexpress.sarafa2n.ru:8080/album_posters/726420f0b9599ef1cb70cb66032a47f6',
            group: 'Imagine Dragons',
            audio: 'https://musicexpress.sarafa2n.ru:8080/track_audio/18e1d0c72345f84353be39a3fa7f5029',
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
        this.volumeWrapper = document.querySelector('.player-sub-controls__wrapper');
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
        const album: HTMLImageElement = item.querySelector('.track-item__album') as HTMLImageElement;

        this.playerTitle.innerText = title.textContent;
        this.playerGroup.innerText = group.textContent;
        this.playerAlbum.src = album.src;
        this.audio.src = item.dataset.audio;
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

            if (loopFlag) {
                (<HTMLElement>target).classList.add('player-sub-controls__icon_active');
            } else {
                (<HTMLElement>target).classList.remove('player-sub-controls__icon_active');
            }
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
     * @param {object} tracks - контейнер со всеми треками на странице
     */
    setEventToTracks(tracks: NodeList): void {
        tracks.forEach((item: HTMLElement) => {
            item.addEventListener('click', (e) => {
                if ((<HTMLElement>e.target).classList.contains('track-item__icon')) {
                    ModelTrack.fetchFavoriteTrackAdd((<HTMLElement>e.target).dataset.id).then((res) => {
                        const { body } = res;
                        if (body.message === 'added') {
                            (<HTMLElement>e.target).classList.add('track-item__plus_active');
                        } else if (body.message === 'deleted') {
                            (<HTMLElement>e.target).classList.remove('track-item__plus_active');
                        }
                    });
                }
                if ((<HTMLElement>e.target).className !== 'track-item__group'
                    && !(<HTMLElement>e.target).classList.contains('track-item__icon')) {
                    this.changeSong(item);
                }
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

export const player: Player | MobilePlayer = isMobile ? new MobilePlayer() : new Player();
