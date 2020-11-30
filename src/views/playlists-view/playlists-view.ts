import { View } from 'managers/base-view/base-view';
import { IProps, IState } from 'store/interfaces';
import { Page } from 'components/page/page';
import { ModelPlayList } from 'models/playlist';

import PlayListsTemplate from './playlists-view.hbs';
import PlaylistItemTemplate from './playlist.hbs';
import PlaylistItemsTemplate from './playlists.hbs';

import './playlists-view.scss';
import './playlist.scss';

import emptyPlaylist from '../../assets/default/emptyPlaylist.svg';

export class PlaylistsView extends View<IProps, IState> {
    private page: Page;

    private isLoaded: boolean;

    constructor(props: IProps, storage: any) {
        super(props, storage);

        this.page = new Page(this.props, this.storage);
        this.isLoaded = false;
    }

    didMount(): void {
        ModelPlayList.fetchGetPlaylists().then((playlists) => {
            this.storage.set({ playlists });
        }).then(() => {
            this.hide();
            this.render();
        });
    }

    checkValue(event: Event) {
        const { target } = event;

        if ((<HTMLInputElement>target).value) {
            document.querySelector('.playlist-add-form__icon').classList.add('playlist-add-form__icon_active');
        } else {
            document.querySelector('.playlist-add-form__icon').classList.remove('playlist-add-form__icon_active');
        }
    }

    createPlaylist = (event: Event) => {
        event.preventDefault();

        const { target } = event;
        let playlists: ModelPlayList[] = this.storage.get('playlists');
        const title: HTMLInputElement = (<HTMLElement>target).querySelector('[name="title"]');

        if (title.value.length === 0) {
            return;
        }

        ModelPlayList.fetchPostCreatePlaylist(title.value).then((playlist) => {
            title.value = '';
            document.querySelector('.playlist-add-form__icon').classList.remove('playlist-add-form__icon_active');

            playlists = [...playlists, playlist];
            this.storage.set({ playlists });

            const wrapper: HTMLElement = this.props.parent.querySelector('.playlists-page__playlists');
            const temp = PlaylistItemTemplate({ playlists });
            const isEmpty = playlists ? !playlists.length : true;
            const playlistTemp = PlaylistItemsTemplate({
                playlists: temp,
                isEmpty,
                placeholder: emptyPlaylist,
            });

            wrapper.innerHTML = '';
            wrapper.insertAdjacentHTML('afterbegin', playlistTemp);
        });
    };

    render() {
        const user = this.storage.get('user');

        if (!user.isLoaded && this.storage.get('updateState')) {
            this.storage.set({ pageState: false });
            return;
        }

        const playlists: ModelPlayList[] = this.storage.get('playlists');
        const temp = PlaylistItemTemplate({ playlists });
        const isEmpty = playlists ? !playlists.length : true;

        const playlistTemp = PlaylistItemsTemplate({
            playlists: temp,
            isEmpty,
            placeholder: emptyPlaylist,
        });

        this.page.show();
        this.props.parent = document.querySelector('.page__content');

        const { parent } = this.props;

        parent.insertAdjacentHTML('afterbegin', PlayListsTemplate({ playlistTemp }));

        parent.querySelector('.playlist-add-form__input').addEventListener('input', this.checkValue);
        parent.querySelector('.playlist-add-form').addEventListener('submit', this.createPlaylist);
    }
}
