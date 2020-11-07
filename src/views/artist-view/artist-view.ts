import { Page } from 'components/page/page';
import { View } from 'managers/base-view/base-view';
import { IProps, IState } from 'store/interfaces';
import { TrackList } from 'components/track-list/track-list';
import { ModelArtist } from 'models/artist';
import { albumArray, tracksList } from 'store/consts';

import ArtistTemplate from './artist-view.hbs';
import './artist-view.scss';

export class ArtistView extends View<IProps, IState> {
    private page: Page;

    constructor(props: IProps, storage: any) {
        super(props, storage);

        this.page = new Page(this.props, this.storage);
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
        ModelArtist.fetchCurrentArtist(this.props.arg).then((artist: ModelArtist) => {
            this.setState({ artist: artist.attrs, isLoaded: artist.isLoaded });
        }).then(() => this.render());
    }

    render() {
        this.page.show();

        const tracks: TrackList = new TrackList({ tracksList });

        this.props.parent = document.querySelector('.page__content');
        this.props.parent.insertAdjacentHTML('afterbegin', ArtistTemplate({
            tracks: tracks.render(),
            albums: albumArray,
        }));

        this.page.setEventToTracks();

        const reviewButton: HTMLElement = this.props.parent.querySelector('.review-button');
        const textButton: HTMLElement = this.props.parent.querySelector('.text-button');

        reviewButton.addEventListener('click', () => this.changeContent('.artist-page__review', '.artist-page__text', reviewButton));
        textButton.addEventListener('click', () => this.changeContent('.artist-page__text', '.artist-page__review', textButton));
    }
}
