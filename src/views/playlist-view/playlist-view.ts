import { View } from 'managers/base-view/base-view';
import { IProps, IState } from 'store/interfaces';
import { Page } from 'components/page/page';
import { router } from 'managers/router/router';
import { ModelPlayList } from 'models/playlist';
import { TrackList } from 'components/track-list/track-list';
import { playerService } from 'components/app/app';
import { RouterStore } from 'store/routes';
import { ModelUser } from 'models/user';

import PlayListTemplate from './playlist-view.hbs';
import './playlist-view.scss';

import emptyPlaylist from '../../assets/default/emptyPlaylist.svg';

export class PlaylistView extends View<IProps, IState> {
    private page: Page;

    private isLoaded: boolean;

    private metaAdded: boolean;

    constructor(props: IProps, storage: any) {
        super(props, storage);

        this.page = new Page(this.props, this.storage);
        this.isLoaded = false;
        this.metaAdded = false;
    }

    unMount(): void {
        if (this.metaAdded) {
            document.getElementById('meta-title').remove();
            document.getElementById('meta-poster').remove();
            document.getElementById('meta-type').remove();
            document.getElementById('meta-url').remove();

            this.metaAdded = false;
        }
    }

    addOpenGraphMeta(playlist: ModelPlayList, author: ModelUser) {
        if (this.metaAdded) {
            return;
        }

        this.metaAdded = true;

        const metaTitle = document.createElement('meta');
        const metaImg = document.createElement('meta');
        const metaType = document.createElement('meta');
        const metaUrl = document.createElement('meta');

        metaTitle.id = 'meta-title';
        metaImg.id = 'meta-poster';
        metaType.id = 'meta-type';
        metaUrl.id = 'meta-url';

        metaTitle.setAttribute('property', 'og:title');
        metaImg.setAttribute('property', 'og:image');
        metaType.setAttribute('property', 'music:creator');
        metaUrl.setAttribute('property', 'og:url');

        metaTitle.content = `Плейлист ${playlist.attrs.title}`;
        metaImg.content = playlist.attrs.poster;
        metaType.content = author.attrs.username;
        metaUrl.content = window.location.href;

        document.getElementsByTagName('head')[0].appendChild(metaTitle);
        document.getElementsByTagName('head')[0].appendChild(metaImg);
        document.getElementsByTagName('head')[0].appendChild(metaType);
        document.getElementsByTagName('head')[0].appendChild(metaUrl);
    }

    didMount() {
        ModelPlayList.fetchGetCurrentPlaylist(this.props.arg).then((res: any) => {
            const { playlist, user } = res;

            if (!playlist.isLoaded) {
                router.go(RouterStore.website.index);
            }

            this.isLoaded = true;
            this.setState({ playlist: playlist.attrs, author: user.attrs });
            this.addOpenGraphMeta(playlist, user);
        }).then(() => {
            this.props.parent.innerHTML = '';
            this.render();
        });
    }

    playButton = () => {
        const tracks = [].slice.call(this.props.parent.querySelectorAll('.track-item'));
        playerService.albumOrder(tracks);
    };

    changePoster = (event: Event) => {
        event.preventDefault();
        const { target } = event;
        const file: File = (<HTMLInputElement>target).files[0];

        const payload = new FormData();
        const playlists = this.storage.get('playlists');
        const poster: HTMLImageElement = document.querySelector('.playlist-page__poster');
        payload.append('poster', file);

        ModelPlayList.fetchChangePosterPlaylist(this.props.arg, payload).then((playlist: ModelPlayList) => {
            poster.src = playlist.attrs.poster;

            playlists.forEach((item: ModelPlayList) => {
                if (item.attrs.id === Number(this.props.arg)) {
                    item.attrs.poster = poster.src;
                }
            });

            this.storage.set({ playlists });
        });
    };

    deletePlaylist = (event: Event) => {
        event.preventDefault();

        ModelPlayList.fetchDeletePlaylist(this.props.arg).then(() => {
            router.go(RouterStore.website.playlists);
        });
    };

    changePrivate = (event: Event) => {
        const target: HTMLInputElement = event.target as HTMLInputElement;
        const { playlist } = this.state;
        const label = this.props.parent.querySelector('.switch-button__label');

        ModelPlayList.fetchChangePrivate(playlist.id, target.checked).then(() => {
            label.innerHTML = target.checked ? 'Публичный плейлист' : 'Частный плейлист';
        });
    };

    render() {
        const user = this.storage.get('user');

        const playlist = this.isLoaded ? this.state.playlist : null;
        const author = this.isLoaded ? this.state.author : null;
        const tracks = this.isLoaded ? new TrackList({ tracksList: playlist.tracks, playlistsHidden: true }, this.storage).render() : null;
        const isEmpty = !tracks;
        let isAuthor = false;
        let isPublic = false;

        if (this.isLoaded) {
            if (!user.isLoaded && !playlist.is_public && playlist.user_id !== user.attrs.id) {
                router.go(RouterStore.website.index);
            }

            if (user.isLoaded) {
                isAuthor = user.attrs.id === playlist.user_id;
            }

            isPublic = playlist.is_public;
        }

        this.page.show();
        this.props.parent = document.querySelector('.page__content');
        this.props.parent.insertAdjacentHTML('afterbegin', PlayListTemplate({
            playlist,
            author,
            tracks,
            isEmpty,
            placeholder: emptyPlaylist,
            isAuthor,
            isPublic,
            isLoaded: this.isLoaded,
            url: document.location,
        }));

        if (isAuthor) {
            this.props.parent.querySelector('.form-upload-poster').addEventListener('change', this.changePoster);
            this.props.parent.querySelector('.fa-trash').addEventListener('click', this.deletePlaylist);
            this.props.parent.querySelector('.switch-button__input').addEventListener('change', this.changePrivate);
        }

        if (!isEmpty) {
            this.page.setEventToTracks();
            this.props.parent.querySelector('.playlist-page__play').addEventListener('click', this.playButton);
        } else {
            this.props.parent.querySelector('.playlist-page__play').setAttribute('disabled', 'true');
            this.props.parent.querySelector('.playlist-page__play').classList.add('button-disabled');
        }
    }
}
