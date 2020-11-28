import { Page } from 'components/page/page';
import { View } from 'managers/base-view/base-view';
import { IProps, IState } from 'store/interfaces';
import { ModelTrack } from 'models/track';
import { TrackList } from 'components/track-list/track-list';
import { router } from 'managers/router/router';
import { RouterStore } from 'store/routes';

import FavoriteTrackTemplate from './favoriteTrack-view.hbs';
import './favoriteTrack-view.scss';

import favoritePlaceholder from '../../assets/default/favoritePlaceholder.svg';

export class FavoriteTrackView extends View<IProps, IState> {
    private page: Page;

    private tracks: TrackList;

    private isLoaded: boolean;

    constructor(props: IProps, storage: any) {
        super(props, storage);
        this.page = new Page(this.props, this.storage);

        this.isLoaded = false;
    }

    didMount(): void {
        ModelTrack.fetchFavoriteTrackList().then((tracks) => {
            this.tracks = new TrackList({ tracksList: tracks }, this.storage);
            this.isLoaded = true;
        }).then(() => {
            this.hide();
            this.render();
        });
    }

    render() {
        const tracks = this.isLoaded ? this.tracks.render() : null;
        const user = this.storage.get('user');
        const isEmpty = !tracks;

        if (!user.isLoaded && this.storage.get('updateState')) {
            this.storage.set({ pageState: false });
            router.go(RouterStore.website.index);
            return;
        }

        this.page.show();
        this.props.parent = document.querySelector('.page__content');
        this.props.parent.insertAdjacentHTML('afterbegin', FavoriteTrackTemplate({
            tracks,
            isEmpty,
            placeholder: favoritePlaceholder,
        }));

        this.page.setEventToTracks();
    }
}
