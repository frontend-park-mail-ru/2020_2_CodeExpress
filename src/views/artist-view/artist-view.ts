import { Page } from 'components/page/page';
import { View } from 'managers/base-view/base-view';
import { IProps, IState } from 'store/interfaces';
import { TrackList } from 'components/track-list/track-list';
import { ModelArtist } from 'models/artist';
import { router } from 'managers/router/router';
import { ModelTrack } from 'models/track';
import { ModelAlbum } from 'models/album';

import ArtistTemplate from './artist-view.hbs';
import './artist-view.scss';

export class ArtistView extends View<IProps, IState> {
    private page: Page;

    private isLoaded: boolean;

    private tracks: TrackList;

    constructor(props: IProps, storage: any) {
        super(props, storage);

        this.page = new Page(this.props, this.storage);
        this.isLoaded = false;
    }

    changeContent(targetElem: string, prevElem: string, button: HTMLElement): void {
        const prevContent = this.props.parent.querySelector(prevElem);
        prevContent.classList.add('artist-page__hidden');

        const currentContent = this.props.parent.querySelector(targetElem);
        currentContent.classList.remove('artist-page__hidden');

        const prevButton = this.props.parent.querySelector('.artist-page-preview__link_active');
        prevButton.classList.remove('artist-page-preview__link_active');
        button.classList.add('artist-page-preview__link_active');
    }

    didMount() {
        const artistInfo = ModelArtist.fetchCurrentArtist(this.props.arg).then((artist: ModelArtist) => {
            if (!artist.isLoaded) {
                router.go('/');
            }

            this.setState({ artist: artist.attrs });
        });

        const trackList = ModelTrack.fetchArtistTracks(this.props.arg).then((tracks) => {
            this.tracks = new TrackList({ tracksList: tracks });
        });

        const artistAlbums = ModelAlbum.fetchGetArtistArray(this.props.arg).then((albums) => {
            this.setState({ albums });
        });

        Promise.all([artistInfo, trackList, artistAlbums]).then(() => {
            this.isLoaded = true;
            this.hide();
            this.render();
        });
    }

    render() {
        this.page.show();

        const artist = this.isLoaded ? this.state.artist : null;
        const tracks = this.isLoaded ? this.tracks.render() : null;
        const albums = this.isLoaded ? this.state.albums : null;

        this.props.parent = document.querySelector('.page__content');
        this.props.parent.insertAdjacentHTML('afterbegin', ArtistTemplate({
            artist,
            tracks,
            albums,
        }));

        this.page.setEventToTracks();

        const reviewButton: HTMLElement = this.props.parent.querySelector('.review-button');
        const textButton: HTMLElement = this.props.parent.querySelector('.text-button');

        reviewButton.addEventListener('click', () => this.changeContent('.artist-page__review', '.artist-page__text', reviewButton));
        textButton.addEventListener('click', () => this.changeContent('.artist-page__text', '.artist-page__review', textButton));
    }
}
