import { Component } from 'managers/component/component';
import { IProps, IState } from 'store/interfaces';
import { playerService } from 'components/app/app';
import { ITrack, ModelTrack } from 'models/track';

import PlayerTemplate from './player.hbs';
import './player.scss';

export class DesktopPlayer extends Component<IProps, IState> {
    private playerTitle: HTMLElement;

    private playerAlbum: HTMLImageElement;

    private playerGroup: HTMLImageElement;

    private volumeInput: HTMLInputElement;

    private volumeButton: HTMLElement;

    private repeatButton: HTMLElement;

    private progressBar: HTMLObjectElement;

    private timeLine: HTMLElement;

    private playButton: HTMLElement;

    private volumeWrapper: HTMLElement;

    private prevButton: HTMLElement;

    private nextButton: HTMLElement;

    private orderToggle: HTMLElement;

    constructor(props: IProps = {}) {
        super(props);
    }

    changeOrderTrack(track: ModelTrack) {
        this.progressBar.style.width = '0%';

        playerService.clearTimer();

        this.updateTrackView(track.attrs);

        playerService.changeTrack(track.attrs.audio);
        playerService.play().then(() => playerService.iconPlay(this.playButton));
        playerService.setLastTrack(track);
    }

    updateTrackView(track: ITrack) {
        if (!track) {
            return;
        }

        this.playerTitle.innerText = track.title;
        this.playerAlbum.src = track.album_poster;
        this.playerGroup.innerText = track.artist;
    }

    getLastTrack() {
        this.updateTrackView(playerService.getLastTrack());
    }

    didMount(): void {
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
        this.prevButton = document.getElementById('backward');
        this.nextButton = document.getElementById('forward');
        this.orderToggle = document.querySelector('.player__toggle-order');

        this.volumeInput.value = `${playerService.getVolume() * 100}`;
    }

    changeCurrentTrack(item: HTMLElement) {
        this.progressBar.style.width = '0%';
        const currentSong = document.querySelector('.track-item_active');

        playerService.clearTimer();

        if (currentSong) {
            currentSong.classList.remove('track-item_active');
        }

        item.classList.add('track-item_active');
        const track: ITrack = playerService.getTrackData(item);
        this.updateTrackView(track);

        playerService.changeTrack(track.audio);
        playerService.play().then(() => playerService.iconPlay(this.playButton));
        playerService.setLastTrack(new ModelTrack(track, true, false));
        playerService.addInOrder(item);
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
        this.progressBar.style.width = playerService.rewind(event.offsetX, this.timeLine);
        playerService.play().then(() => playerService.iconPlay(this.playButton));
    };

    showVolumeInput = () => {
        const viewFlag: boolean = this.volumeWrapper.dataset.hidden === 'false';

        this.volumeWrapper.dataset.hidden = String(viewFlag);
        this.volumeWrapper.style.display = viewFlag ? 'none' : 'block';
    };

    changeVolume = (event: Event): void => {
        const { target } = event;
        const volume = Number((<HTMLInputElement>target).value) / 100;

        playerService.setVolume(volume);
        localStorage.setItem('volume', JSON.stringify(volume));
    };

    volumeStorage = (event: StorageEvent): void => {
        if (event.key === 'volume') {
            const temp = JSON.parse(event.newValue);

            playerService.setVolume(temp.volume);
            this.volumeInput.value = String(temp.volume * 100);
        }
    };

    setup(): void {
        this.didMount();
        this.getLastTrack();
        const { length, index } = playerService.getOrderInfo();
        this.checkControlButtons(index, length);

        this.playButton.addEventListener('click', () => playerService.togglePlay(this.playButton));
        this.prevButton.addEventListener('click', playerService.prevTrack);
        this.nextButton.addEventListener('click', playerService.nextTrack);

        this.timeLine.addEventListener('click', this.rewind);
        this.volumeButton.addEventListener('click', this.showVolumeInput);
        this.volumeInput.oninput = (event) => this.changeVolume(event);

        playerService.render();
        playerService.events([this.playButton], this.repeatButton, this.progressBar);
        window.addEventListener('storage', this.volumeStorage);
        this.orderToggle.addEventListener('click', playerService.showOrder);
    }

    render() {
        return PlayerTemplate();
    }
}
