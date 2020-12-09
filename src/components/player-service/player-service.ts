import { Component } from 'managers/component/component';
import { IProps } from 'store/interfaces';
import { statuses } from 'store/consts';
import { player } from 'components/app/app';
import { ModelTrack, ITrack } from 'models/track';
import { TrackList } from 'components/track-list/track-list';
import { app } from '../../index';

import PlayerServiceTemplate from './player-service.hbs';
import './player-service.scss';

enum StorageKeys {
    order = 'order',
    volume = 'volume',
    lastAudio = 'lastAudio',
    index = 'index',
    repeat = 'repeat',
}

interface IStorageEvent {
    event: StorageEvent,
    repeatButton: HTMLElement,
    playButton: HTMLElement[],
    progressBar: HTMLElement[],
}

export interface IPlayerState {
    track: ModelTrack
}

export class PlayerService extends Component<IProps, IPlayerState> {
    state: IPlayerState;

    private order: ModelTrack[];

    private index: number;

    private timer: NodeJS.Timeout;

    private percent: number;

    private audio: HTMLMediaElement;

    private closeToggle: HTMLElement;

    private orderWrapper: HTMLElement;

    constructor() {
        super({});

        this.timer = null;
        this.percent = 0;
        this.audio = new Audio() as HTMLMediaElement;

        const tempVolume = JSON.parse(localStorage.getItem('volume'));
        const tempRepeat = JSON.parse(localStorage.getItem('repeat'));

        this.audio.volume = tempVolume || 0.5;
        this.audio.loop = tempRepeat || false;

        const orderStorage: ModelTrack[] | null = JSON.parse(localStorage.getItem('order')) || null;
        this.order = orderStorage ? orderStorage.map((item: ModelTrack) => new ModelTrack(item.attrs, true, false)) : [];
        this.getOrder();
    }

    getOrder() {
        if (this.order.length) {
            const storageTrack: ModelTrack = JSON.parse(localStorage.getItem('lastAudio'));
            this.setState({ track: new ModelTrack(storageTrack.attrs, true, false) });
            this.index = JSON.parse(localStorage.getItem('index')) || 0;
            return;
        }

        ModelTrack.fetchIndexTrackList(10, 5).then((tracks) => {
            tracks.forEach((item: ModelTrack) => this.order.push(item));
        }).then(() => {
            this.setState({ track: this.order[0] });
            this.setLastTrack(this.order[0]);
            this.index = 0;

            localStorage.setItem('order', JSON.stringify(this.order));
            localStorage.setItem('index', JSON.stringify(this.index));
            localStorage.setItem('lastAudio', JSON.stringify(this.order[0]));
            player.getLastTrack();
        });
    }

    getOrderInfo() {
        return { length: this.order.length, index: this.index };
    }

    clearTimer() {
        clearTimeout(this.timer);
    }

    getLastTrack(): ITrack {
        if (!this.state) {
            return null;
        }

        const { track } = this.state;

        if (!track) {
            return null;
        }

        this.audio.src = track.attrs.audio;
        return track.attrs;
    }

    setLastTrack(item: ModelTrack) {
        item.attrs.date = new Date();

        localStorage.setItem('lastAudio', JSON.stringify(item));
    }

    setVolume(value: number) {
        this.audio.volume = value;
    }

    getVolume(): number {
        return this.audio.volume;
    }

    play() {
        return this.audio.play();
    }

    iconPlay(...buttons: HTMLElement[]) {
        buttons.forEach((item) => {
            item.classList.remove(statuses.iconPlay);
            item.classList.add(statuses.iconPause);
            item.dataset.status = statuses.statusOn;
        });
    }

    iconPause(...buttons: HTMLElement[]) {
        buttons.forEach((item) => {
            item.dataset.status = statuses.statusOff;
            item.classList.remove(statuses.iconPause);
            item.classList.add(statuses.iconPlay);
        });
    }

    togglePlay = (...playButton: HTMLElement[]) => {
        if (playButton[0].dataset.status === statuses.statusOff) {
            localStorage.setItem('play', JSON.stringify(new Date()));
            this.play().then(() => this.iconPlay(...playButton));
        } else {
            this.pause();
            this.iconPause(...playButton);

            clearTimeout(this.timer);
        }
    };

    changeTrack(src: string) {
        this.audio.src = src;
    }

    rewind(offsetX: number, timeline: HTMLElement): string {
        const audioPercent = offsetX / timeline.offsetWidth;
        this.audio.currentTime = audioPercent * this.audio.duration;
        clearTimeout(this.timer);
        return `${audioPercent * 100}%`;
    }

    pause() {
        this.audio.pause();
    }

    startTimer(duration: number, progressBar: HTMLElement[]) {
        if (this.percent < 100) {
            this.timer = setTimeout(() => this.advance(duration, progressBar), 10);
        }
    }

    advance(duration: number, progressBar: HTMLElement[]) {
        const increment = 10 / duration;
        this.percent = Math.min(increment * this.audio.currentTime * 10, 100);
        progressBar.forEach((item: HTMLElement) => {
            item.style.width = `${this.percent}%`;
        });
        this.startTimer(duration, progressBar);
    }

    loop = (event: Event) => {
        const loopFlag = !this.audio.loop;

        this.audio.loop = loopFlag;

        localStorage.setItem('repeat', JSON.stringify(loopFlag));
        this.checkIsLoop(event.target as HTMLElement, loopFlag);
    };

    trackEnd = (playButton: HTMLElement[], progressBar: HTMLElement[]) => {
        this.iconPause(...playButton);
        progressBar.forEach((item: HTMLElement) => {
            item.style.width = '0%';
        });

        this.percent = 0;
        clearTimeout(this.timer);
    };

    multiChangeTrack = (props: IStorageEvent) => {
        const {
            event,
            playButton,
            progressBar,
            repeatButton,
        } = props;

        if (event.key === StorageKeys.order || event.key === StorageKeys.volume || event.key === StorageKeys.index) {
            return;
        }

        if (event.key === StorageKeys.repeat) {
            const flag = JSON.parse(event.newValue);
            this.audio.loop = flag;

            if (flag) {
                repeatButton.classList.add('player-sub-controls__icon_active');
            } else {
                repeatButton.classList.remove('player-sub-controls__icon_active');
            }
            return;
        }
        const currentSong = document.querySelector('.track-item_active');

        if (currentSong) {
            currentSong.classList.remove('track-item_active');
        }

        this.audio.pause();
        this.trackEnd(playButton, progressBar);

        if (event.key === StorageKeys.lastAudio) {
            const temp = JSON.parse(event.newValue);
            const track = new ModelTrack(temp.attrs, true, false);
            player.updateTrackView(track.attrs);
        }
    };

    checkIsLoop(repeatButton: HTMLElement, isLoop: boolean) {
        if (isLoop) {
            repeatButton.classList.add('player-sub-controls__icon_active');
        } else {
            repeatButton.classList.remove('player-sub-controls__icon_active');
        }
    }

    getTrackData(item: HTMLElement): ITrack {
        const title: HTMLElement = item.querySelector('.track-item__title');
        const group: HTMLLinkElement = item.querySelector('.track-item__group');
        const album: HTMLImageElement = item.querySelector('.track-item__album') as HTMLImageElement;
        const index = item.querySelector('.track-item__index');
        const duration = item.querySelector('.track-item__duration');
        const { audio, id, add } = item.dataset;

        return {
            id: Number(id),
            index: index.textContent,
            title: title.textContent,
            artist: group.textContent,
            artist_id: Number(group.dataset.id),
            album_poster: album.src,
            album_id: Number(album.dataset.id),
            duration: duration.textContent,
            audio,
            is_favorite: !!add,
        };
    }

    albumOrder(items: HTMLElement[]) {
        this.order = items.map((item: HTMLElement) => new ModelTrack(this.getTrackData(item), true, false));
        this.index = 0;

        player.changeOrderTrack(this.order[this.index]);
        localStorage.setItem('index', JSON.stringify(this.index));
        localStorage.setItem('order', JSON.stringify(this.order));
    }

    addInOrder(item: HTMLElement) {
        const track: ITrack = this.getTrackData(item);
        const inOrder = this.order.find((temp) => temp.attrs.title === track.title);

        if (inOrder) {
            return;
        }

        this.order.push(new ModelTrack(track, true, false));
        localStorage.setItem('order', JSON.stringify(this.order));
    }

    nextTrack = () => {
        const nextIndex = this.index + 1;

        if (nextIndex >= this.order.length) {
            return;
        }

        const item = this.order[nextIndex];
        player.changeOrderTrack(item);

        this.index++;
        localStorage.setItem('index', JSON.stringify(this.index));
        player.checkControlButtons(this.index, this.order.length);
    };

    prevTrack = () => {
        const prevIndex = this.index - 1;

        if (prevIndex < 0) {
            return;
        }

        const item = this.order[prevIndex];
        player.changeOrderTrack(item);
        this.index--;
        localStorage.setItem('index', JSON.stringify(this.index));
        player.checkControlButtons(this.index, this.order.length);
    };

    showOrder = () => {
        (<HTMLElement>document.querySelector('#app')).style.overflow = 'hidden';
        this.orderWrapper.style.top = 'initial';
    };

    hideOrder = () => {
        (<HTMLElement>document.querySelector('#app')).style.overflow = 'initial';
        this.orderWrapper.style.top = '100%';
    };

    events(playButton: HTMLElement[], repeatButton: HTMLElement, ...progressBar: HTMLElement[]) {
        this.closeToggle = document.querySelector('.track-order__toggle');
        this.orderWrapper = document.querySelector('.track-order');

        this.checkIsLoop(repeatButton, this.audio.loop);

        this.audio.addEventListener('playing', (event) => {
            const { target } = event;
            this.advance((<HTMLMediaElement>target).duration, progressBar);
        });

        this.audio.addEventListener('pause', () => clearTimeout(this.timer));
        this.audio.addEventListener('ended', this.nextTrack);
        this.audio.addEventListener('ended', () => this.trackEnd(playButton, progressBar));
        this.closeToggle.addEventListener('click', this.hideOrder);

        repeatButton.addEventListener('click', this.loop);
        window.addEventListener('storage', (event) => this.multiChangeTrack({
            event,
            repeatButton,
            playButton,
            progressBar,
        }));
    }

    render() {
        const orderTracks = new TrackList({ tracksList: this.order }, app.getStorage());

        document.querySelector('#app').insertAdjacentHTML('beforeend', PlayerServiceTemplate({ order: orderTracks.render() }));
        const order = document.querySelector('.track-order');

        TrackList.setEventToTracks(order.querySelectorAll('.track-item'));
    }
}
