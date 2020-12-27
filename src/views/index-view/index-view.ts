import { Page } from 'components/page/page';
import { View } from 'managers/base-view/base-view';
import { TrackList } from 'components/track-list/track-list';
import { IProps, IState, IStorage } from 'store/interfaces';
import { ModelTrack } from 'models/track';
import { ModelAlbum } from 'models/album';
import { ModelArtist } from 'models/artist';
import { playerService } from 'components/app/app';
import { debounce } from 'managers/utils/utils';

import IndexTemplate from './index.hbs';
import './index.scss';
import 'components/track-list/track.scss';
import './album.scss';

import basicArticlePoster from '../../assets/backgrounds/imagine_dragons.jpg';
import basicArticleAlbum from '../../assets/backgrounds/natural-imagine-dragons.jpeg';

/**
 * View отображающая главную страницу
 */
export class IndexView extends View {
    private page: Page;

    private trackList: TrackList;

    private trackListNew: TrackList;

    private isLoaded: boolean;

    private group: any;

    private articles: any;

    /**
     * Конструктор IndexView
     * @param {object} props - объект, в котором лежат переданные параметры
     * @param {object} storage - объект, который в котором лежат фукнции для работы с User
     */
    constructor(props: IProps, storage: IStorage<IState>) {
        super(props, storage);
        this.page = new Page(this.props, this.storage);

        this.isLoaded = false;
    }

    didMount(): void {
        const popularTracks = ModelTrack.fetchIndexTrackList(5, 0).then((tracks) => {
            this.trackList = new TrackList({ tracksList: tracks }, this.storage);
        });

        const group = ModelArtist.fetchGetArtistDay().then((artist: ModelTrack) => {
            this.group = artist.attrs;
        });

        const articles = ModelAlbum.fetchGetTopAlbums(3, 0).then((albums) => {
            this.articles = albums;
        });

        const newTracks = ModelTrack.fetchIndexPopularTrackList(5, 0).then((tracks) => {
            this.trackListNew = new TrackList({ tracksList: tracks }, this.storage);
        });

        const popularAlbums = ModelAlbum.fetchGetIndexAlbumArray(6, 0).then((albums) => {
            this.setState({ popularAlbums: albums });
        });

        Promise.all([popularTracks, newTracks, popularAlbums, group, articles]).then(() => {
            this.isLoaded = true;
            this.hide();
            this.render();
        });
    }

    randomArtistTracks = (event: Event) => {
        const target = event.target as HTMLElement;

        ModelTrack.fetchRandomArtistTracks(target.dataset.id, 10, 0).then((tracks: ModelTrack[]) => {
            playerService.artistOrder(tracks);
        });
    };

    albumTracks = (event: Event) => {
        const target = event.target as HTMLElement;

        ModelAlbum.fetchGetCurrentAlbum(Number(target.dataset.id)).then((album: ModelAlbum) => {
            playerService.artistOrder(album.attrs.tracks);
        });
    };

    /**
     * Функция отрисовки View
     */
    render(): void {
        this.page.show();

        const popularTrackList = this.isLoaded ? this.trackList.render() : null;
        const newTrackList = this.isLoaded ? this.trackListNew.render() : null;
        const albumArray = this.isLoaded ? this.state.popularAlbums : null;
        const group = this.isLoaded ? this.group : null;
        const articles = this.isLoaded ? this.articles : null;

        const genreArray: Array<string> = ['Альтернативный Рок',
            'Иностранный Рок', 'Русский Рок', 'Поп', 'Хипхоп', 'Саундтреки',
            'Електронная', 'Джаз', 'Блюз', 'Кантри', 'Метал', 'Классическая'];
        this.props.parent = document.querySelector('.page__content');
        this.props.parent.insertAdjacentHTML('afterbegin', IndexTemplate({
            group,
            albums: albumArray,
            genres: genreArray,
            tracklist: popularTrackList,
            tracklistNew: newTrackList,
            basicArticlePoster,
            basicArticleAlbum,
            articles,
        }));

        this.page.setEventToTracks();

        const randomOrder = debounce(this.randomArtistTracks, 1000);

        const randomBtn = this.props.parent.querySelector('.random-index-track');
        randomBtn.addEventListener('click', randomOrder);

        const albumBtns = this.props.parent.querySelectorAll('.album-play');
        albumBtns.forEach((item) => {
            item.addEventListener('click', this.albumTracks);
        });
    }
}
