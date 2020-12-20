import { Page } from 'components/page/page';
import { View } from 'managers/base-view/base-view';
import { IProps, IState } from 'store/interfaces';

import { ModelAlbum } from 'models/album';
import { TrackList } from 'components/track-list/track-list';
import { router } from 'managers/router/router';
import { playerService } from 'components/app/app';

import AlbumTemplate from './album.hbs';
import './album.scss';

export class AlbumView extends View<IProps, IState> {
    private page: Page;

    private isLoaded: boolean;

    constructor(props: IProps, storage: any) {
        super(props, storage);

        this.page = new Page(this.props, this.storage);
        this.isLoaded = false;

        this.playButton = this.playButton.bind(this);
    }

    didMount(): void {
        ModelAlbum.fetchGetCurrentAlbum(Number(this.props.arg)).then((album: ModelAlbum) => {
            if (!album.isLoaded) {
                router.go('/');
            }

            this.isLoaded = album.isLoaded;
            this.setState({ album: album.attrs });
        }).then(() => {
            this.hide();
            this.render();
        });
    }

    playButton() {
        const tracks = [].slice.call(this.props.parent.querySelectorAll('.track-item'));
        playerService.albumOrder(tracks);
    }

    render() {
        const album = this.isLoaded ? this.state.album : null;
        const tracks = this.isLoaded ? new TrackList({ tracksList: album.tracks }, this.storage).render() : null;
        this.page.show();

        this.props.parent = document.querySelector('.page__content');
        this.props.parent.insertAdjacentHTML('afterbegin', AlbumTemplate({
            album,
            tracks,
        }));

        this.page.setEventToTracks();

        const button = this.props.parent.querySelector('.button-play-album');
        button.addEventListener('click', this.playButton);
    }
}
