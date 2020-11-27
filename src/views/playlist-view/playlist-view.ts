import { View } from 'managers/base-view/base-view';
import { IProps, IState } from 'store/interfaces';
import { Page } from 'components/page/page';
import { router } from 'managers/router/router';
import { ModelPlayList } from 'models/playlist';
import { TrackList } from 'components/track-list/track-list';
import { player } from 'components/player/player';
import { RouterStore } from 'store/routes';

import PlayListTemplate from './playlist-view.hbs';
import './playlist-view.scss';

import emptyPlaylist from '../../assets/default/emptyPlaylist.svg';
import defaultPlaylist from '../../assets/default/playlist.png';

export class PlaylistView extends View<IProps, IState> {
    private page: Page;

    private isLoaded: boolean;

    constructor(props: IProps, storage: any) {
        super(props, storage);

        this.page = new Page(this.props, this.storage);
        this.isLoaded = false;
    }

    didMount() {
        ModelPlayList.fetchGetCurrentPlaylist(this.props.arg).then((playlist: ModelPlayList) => {
            if (!playlist.isLoaded) {
                router.go(RouterStore.website.playlists);
            }
            this.isLoaded = true;
            this.setState({ playlist: playlist.attrs });
        });
    }

    playButton = () => {
        const items: NodeList = this.props.parent.querySelectorAll('.track-item');
        let current = 1;

        player.changeSong(items[0] as HTMLElement);
        player.audio.addEventListener('ended', () => {
            if (current !== items.length) {
                player.changeSong(items[current] as HTMLElement);
                current++;
            }
        });
    };

    changePoster = (event: Event) => {
        event.preventDefault();
        const { target } = event;
        const file: File = (<HTMLInputElement>target).files[0];

        const payload = new FormData();
        const poster: HTMLImageElement = document.querySelector('.playlist-page__poster');
        payload.append('poster', file);

        ModelPlayList.fetchPutPlaylist(this.props.arg, payload).then((playlist: ModelPlayList) => {
            poster.src = playlist.attrs.poster;
        });
    };

    deletePlaylist = (event: Event) => {
        event.preventDefault();
        ModelPlayList.fetchDeletePlaylist(this.props.arg).then(() => {
            router.go(RouterStore.website.playlists);
        });
    };

    render() {
        const user = this.storage.get('user');

        if (!user.isLoaded && this.storage.get('updateState')) {
            this.storage.set({ pageState: false });
            router.go(RouterStore.website.index);
            return;
        }

        const playlist = this.isLoaded ? this.state.playlist : { title: 'Test text', poster: defaultPlaylist };
        const tracks = this.isLoaded ? new TrackList({ tracksList: playlist.tracks }, this.storage).render() : null;
        const isEmpty = !tracks;

        this.page.show();
        this.props.parent = document.querySelector('.page__content');
        this.props.parent.insertAdjacentHTML('afterbegin', PlayListTemplate({
            playlist,
            tracks,
            isEmpty,
            placeholder: emptyPlaylist,
        }));

        this.props.parent.querySelector('.form-upload-poster').addEventListener('change', this.changePoster);
        this.props.parent.querySelector('.fa-trash').addEventListener('click', this.deletePlaylist);

        if (!isEmpty) {
            this.page.setEventToTracks();
            this.props.parent.querySelector('.playlist-page__play').addEventListener('click', this.playButton);
        } else {
            this.props.parent.querySelector('.playlist-page__play').setAttribute('disabled', 'true');
            this.props.parent.querySelector('.fa-share').setAttribute('disabled', 'true');
        }
    }
}
