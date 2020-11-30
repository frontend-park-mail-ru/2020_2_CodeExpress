import { Component } from 'managers/component/component';
import { IProps } from 'store/interfaces';
import { IPlayerState, ITrack } from 'components/player/player';
import { statuses } from 'store/consts';

import MobilePlayerTemplate from './mobile_player.hbs';
import './mobile_player.scss';

export class MobilePlayer extends Component<IProps, IPlayerState> {
    state: IPlayerState;

    private timer: NodeJS.Timeout;

    private percent: number;

    public audio: HTMLMediaElement;

    private lastAudio: ITrack;

    private playButtons: NodeListOf<Element>;

    private timeLine: HTMLElement;

    private progressBar: NodeListOf<Element>;

    private repeatButton: HTMLElement;

    private playerTitle: NodeListOf<Element>;

    private playerAlbum: NodeListOf<Element>;

    private playerGroup: NodeListOf<Element>;

    constructor(props: IProps = {}) {
        super(props);

        this.timer = null;
        this.percent = 0;

        const defaultTrack: ITrack = {
            title: 'Bad Liar',
            album: 'https://musicexpress.sarafa2n.ru:8080/album_posters/726420f0b9599ef1cb70cb66032a47f6',
            group: 'Imagine Dragons',
            audio: 'https://musicexpress.sarafa2n.ru:8080/track_audio/18e1d0c72345f84353be39a3fa7f5029',
        };

        this.setState({ track: defaultTrack });
    }

    setLastTrack(song: ITrack): void {
        this.playerTitle.forEach((item: HTMLElement) => {
            item.innerText = song.title;
        });
        this.playerGroup.forEach((item: HTMLElement) => {
            item.innerText = song.group;
        });
        this.playerAlbum.forEach((item: HTMLImageElement) => {
            item.src = song.album;
        });
        this.audio.src = song.audio;
    }

    didMount() {
        this.audio = new Audio() as HTMLMediaElement;
        this.lastAudio = JSON.parse(localStorage.getItem('lastAudio'));
        this.playButtons = document.querySelectorAll('.play-js');
        this.progressBar = document.querySelectorAll('.mobile-player__progress-bar');
        this.repeatButton = document.getElementById('repeat-button-js');
        this.playerTitle = document.querySelectorAll('.mobile-player__title');
        this.playerAlbum = document.querySelectorAll('.mobile-player__poster');
        this.playerGroup = document.querySelectorAll('.mobile-player__artist');
        this.timeLine = document.querySelector('.mobile-player__time-line_large');

        this.setLastTrack(this.lastAudio as ITrack || this.state.track);
    }

    tooglePlay(target: EventTarget) {
        if ((<HTMLElement>target).dataset.status === statuses.statusOff) {
            this.audioPlay();
            return;
        }

        this.audio.pause();
        this.playButtons.forEach((item: HTMLElement) => {
            item.dataset.status = statuses.statusOff;
            item.classList.remove(statuses.iconPause);
            item.classList.add(statuses.iconPlay);
        });
        clearTimeout(this.timer);
    }

    startTimer(duration: number, element: HTMLMediaElement) {
        if (this.percent < 100) {
            this.timer = setTimeout(() => this.advance(duration, element), 10);
        }
    }

    advance(duration: number, element: HTMLMediaElement) {
        const increment = 10 / duration;
        this.percent = Math.min(increment * element.currentTime * 10, 100);
        this.progressBar.forEach((item: HTMLElement) => {
            item.style.width = `${this.percent}%`;
        });
        this.startTimer(duration, element);
    }

    changeSong(newTrack: HTMLElement) {
        const currentSong = document.querySelector('.track-item_active');
        clearTimeout(this.timer);

        if (currentSong) {
            currentSong.classList.remove('track-item_active');
        }

        newTrack.classList.add('track-item_active');
        const title: HTMLElement = newTrack.querySelector('.track-item__title');
        const group: HTMLElement = newTrack.querySelector('.track-item__group');
        const album: HTMLImageElement = newTrack.querySelector('.track-item__album') as HTMLImageElement;

        this.playerTitle.forEach((item: HTMLElement) => {
            item.innerText = title.textContent;
        });

        this.playerGroup.forEach((item: HTMLElement) => {
            item.innerText = group.textContent;
        });

        this.playerAlbum.forEach((item: HTMLImageElement) => {
            item.src = album.src;
        });

        this.audio.src = newTrack.dataset.audio;
        this.audioPlay();

        const newLastAudio = {
            title: title.textContent,
            group: group.textContent,
            album: album.src,
            audio: this.audio.src,
        };

        localStorage.setItem('lastAudio', JSON.stringify(newLastAudio));
    }

    audioPlay() {
        this.audio.play().then(() => {
            this.playButtons.forEach((item:HTMLElement) => {
                item.classList.remove(statuses.iconPlay);
                item.classList.add(statuses.iconPause);
                item.dataset.status = statuses.statusOn;
            });
        });
    }

    seek(event: MouseEvent) {
        const audioPercent = event.offsetX / this.timeLine.offsetWidth;
        this.audio.currentTime = audioPercent * this.audio.duration;
        this.progressBar.forEach((item: HTMLElement) => {
            item.style.width = `${audioPercent}%`;
        });
        clearTimeout(this.timer);
        this.audioPlay();
    }

    stop() {
        this.audio.src = '';
    }

    setEventListeners() {
        this.didMount();

        const mobilePlayer: HTMLElement = document.querySelector('.mobile-player');
        const app: HTMLElement = document.querySelector('#app');
        const mobilePlayerWrapper: HTMLElement = document.querySelector('.mobile-player__wrapper_column');

        document.querySelector('.mobile-player__toggle').addEventListener('click', (e) => {
            if (!(<HTMLElement>e.target).classList.contains('mobile-player__play')) {
                mobilePlayer.style.bottom = 'initial';
                mobilePlayer.style.top = '-61px';
                (<HTMLElement>document.querySelector('.header-mobile')).style.bottom = '-80px';
                app.style.overflow = 'hidden';
                mobilePlayerWrapper.style.display = 'flex';
            }
        });

        document.getElementById('close-toggle').addEventListener('click', () => {
            mobilePlayer.style.bottom = '80px';
            mobilePlayer.style.top = 'calc(100% - 141px)';
            (<HTMLElement>document.querySelector('.header-mobile')).style.bottom = '0px';
            app.style.overflow = 'initial';
            setTimeout(() => { mobilePlayerWrapper.style.display = 'none'; }, 500);
        });

        this.playButtons.forEach((item: HTMLElement) => {
            item.addEventListener('click', (event) => {
                this.tooglePlay(event.target);
            });
        });

        this.timeLine.addEventListener('click', (event) => {
            this.seek(<MouseEvent>event);
        });

        this.audio.addEventListener('playing', (event) => {
            const { target } = event;
            this.advance((<HTMLMediaElement>target).duration, this.audio);
        });

        this.audio.addEventListener('ended', () => {
            this.playButtons.forEach((item: HTMLElement) => {
                item.classList.remove(statuses.iconPause);
                item.classList.add(statuses.iconPlay);
                item.dataset.status = statuses.statusOff;
            });
            this.progressBar.forEach((item: HTMLElement) => {
                item.style.width = '0%';
            });

            this.percent = 0;
            clearTimeout(this.timer);
        });

        this.repeatButton.addEventListener('click', (event) => {
            const { target } = event;
            const loopFlag = !this.audio.loop;

            this.audio.loop = loopFlag;
            (<HTMLElement>target).style.color = loopFlag ? '#ff0052' : 'rgba(207, 234, 242, 0.141559)';
        });
    }

    render(): HTMLCollection {
        return MobilePlayerTemplate();
    }
}
