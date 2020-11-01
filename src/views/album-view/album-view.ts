import { Page } from 'components/page/page';
import { View } from 'managers/base-view/base-view';
import { IProps, IState } from 'store/interfaces';

import { ITrack, TrackList } from 'components/track-list/track-list';
import { albumArray, tracksList } from 'store/consts';

import AlbumTemplate from './album.hbs';
import './album.scss';

interface IAlbum {
    title: string,
    group: string,
    albumPicture: string,
    tracksList: ITrack[],
}

export class AlbumView extends View<IProps, IState> {
    private page: Page;

    constructor(props: IProps, storage: any) {
        super(props, storage);

        this.page = new Page(this.props, this.storage);
    }

    getAlbum(albumUrl: string | number) : IAlbum { // TODO Доделать взаимодействие с беком после появление документации.
        const [album] = albumArray;
        const { title, group, img: albumPicture } = album;

        return {
            title,
            group,
            albumPicture,
            tracksList,
        };
    }

    render() {
        const album: IAlbum = this.getAlbum(this.props.arg);
        const {
            title,
            group,
            albumPicture,
            tracksList: trackL,
        } = album;

        const tracks: TrackList = new TrackList({ tracksList: trackL });

        this.page.show();
        this.storage.set({ pageState: true });

        this.props.parent = document.querySelector('.page__content');
        this.props.parent.insertAdjacentHTML('afterbegin', AlbumTemplate({
            title,
            group,
            albumPicture,
            albums: albumArray,
            tracks: tracks.render(),
        }));

        this.page.setEventToTracks();
    }
}
