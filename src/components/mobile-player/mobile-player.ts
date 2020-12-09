import { Component } from 'managers/component/component';
import { IProps, IState } from 'store/interfaces';
import { playerService } from 'components/app/app';
import { ModelTrack, ITrack } from 'models/track';

import MobilePlayerTemplate from './mobile-player.hbs';
import './mobile-player.scss';

export class MobilePlayer extends Component<IProps, IState> {
    private playerTitle: HTMLElement[];

    private playerAlbum: HTMLImageElement[];

    private playerGroup: HTMLElement[];

    private repeatButton: HTMLElement;

    private progressBar: HTMLElement[];

    private timeLine: HTMLElement;

    private playButton: HTMLElement[];

    private prevButton: HTMLElement;

    private nextButton: HTMLElement;

    private toggleOrder: HTMLElement;

    constructor(props: IProps = {}) {
        super(props);
    }

    changeOrderTrack(track: ModelTrack) {
        this.progressBar.forEach((item: HTMLElement) => {
            item.style.width = '0%';
        });

        playerService.clearTimer();

        this.updateTrackView(track.attrs);

        playerService.changeTrack(track.attrs.audio);
        playerService.play().then(() => playerService.iconPlay(...this.playButton));
        playerService.setLastTrack(track);
    }

    updateTrackView(track: ITrack) {
        if (!track) {
            return;
        }

        this.playerTitle.forEach((item) => {
            item.innerText = track.title;
        });

        this.playerGroup.forEach((item) => {
            item.innerText = track.artist;
        });

        this.playerAlbum.forEach((item: HTMLImageElement) => {
            item.src = track.album_poster;
        });
    }

    getLastTrack() {
        this.updateTrackView(playerService.getLastTrack());
    }

    didMount(): void {
        this.playButton = Array.from(document.querySelectorAll('.play-js'));
        this.progressBar = Array.from(document.querySelectorAll('.mobile-player__progress-bar'));
        this.repeatButton = document.getElementById('repeat-button-js');
        this.playerTitle = Array.from(document.querySelectorAll('.mobile-player__title'));
        this.playerAlbum = Array.from(document.querySelectorAll('.mobile-player__poster'));
        this.playerGroup = Array.from(document.querySelectorAll('.mobile-player__artist'));
        this.timeLine = document.querySelector('.mobile-player__time-line_large');
        this.prevButton = document.getElementById('backward');
        this.nextButton = document.getElementById('forward');
        this.toggleOrder = document.querySelector('.mobile-player__toggle-order');
    }

    changeCurrentTrack(track: HTMLElement) {
        this.progressBar.forEach((item: HTMLElement) => {
            item.style.width = '0%';
        });

        const currentSong = document.querySelector('.track-item_active');

        playerService.clearTimer();

        if (currentSong) {
            currentSong.classList.remove('track-item_active');
        }

        track.classList.add('track-item_active');
        const newTrack: ITrack = playerService.getTrackData(track);
        this.updateTrackView(newTrack);

        playerService.changeTrack(newTrack.audio);
        playerService.play().then(() => playerService.iconPlay(...this.playButton));
        playerService.setLastTrack(new ModelTrack(newTrack, true, false));
    }

    checkControlButtons(index: number, length: number) {
        if (index === 0) {
            this.prevButton.classList.add('controls-disabled');
        } else if (index + 1 >= length) {
            this.nextButton.classList.add('controls-disabled');
        } else if (index + 1 < length && index !== 0) {
            this.nextButton.classList.remove('controls-disabled');
            this.prevButton.classList.remove('controls-disabled');
        }
    }

    rewind = (event: MouseEvent) => {
        const width = playerService.rewind(event.offsetX, this.timeLine);
        this.progressBar.forEach((item: HTMLElement) => {
            item.style.width = width;
        });
        playerService.play().then(() => playerService.iconPlay(...this.playButton));
    };

    showPlayer = (event: Event) => {
        const mobilePlayer: HTMLElement = document.querySelector('.mobile-player');
        const app: HTMLElement = document.querySelector('#app');
        const mobilePlayerWrapper: HTMLElement = document.querySelector('.mobile-player__wrapper_column');

        if ((<HTMLElement>event.target).classList.contains('mobile-player__play')) {
            return;
        }

        mobilePlayer.style.bottom = 'initial';
        mobilePlayer.style.top = '-61px';
        (<HTMLElement>document.querySelector('.header-mobile')).style.bottom = '-80px';
        app.style.overflow = 'hidden';
        mobilePlayerWrapper.style.display = 'flex';
    };

    hidePlayer = () => {
        const mobilePlayer: HTMLElement = document.querySelector('.mobile-player');
        const app: HTMLElement = document.querySelector('#app');
        const mobilePlayerWrapper: HTMLElement = document.querySelector('.mobile-player__wrapper_column');

        mobilePlayer.style.bottom = '80px';
        mobilePlayer.style.top = 'calc(100% - 141px)';
        (<HTMLElement>document.querySelector('.header-mobile')).style.bottom = '0px';
        app.style.overflow = 'initial';
        setTimeout(() => { mobilePlayerWrapper.style.display = 'none'; }, 500);
    };

    setup(): void {
        this.didMount();
        this.getLastTrack();

        this.playButton.forEach((item: HTMLElement) => {
            item.addEventListener('click', () => playerService.togglePlay(...this.playButton));
        });
        this.prevButton.addEventListener('click', playerService.prevTrack);
        this.nextButton.addEventListener('click', playerService.nextTrack);

        this.timeLine.addEventListener('click', this.rewind);

        document.querySelector('.mobile-player__toggle').addEventListener('click', this.showPlayer);
        document.getElementById('close-toggle').addEventListener('click', this.hidePlayer);

        playerService.render();
        playerService.events(this.playButton, this.repeatButton, ...this.progressBar);
        this.toggleOrder.addEventListener('click', playerService.showOrder);
    }

    render() {
        return MobilePlayerTemplate();
    }
}
