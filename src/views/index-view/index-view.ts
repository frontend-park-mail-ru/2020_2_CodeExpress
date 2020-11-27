import { Page } from 'components/page/page';
import { View } from 'managers/base-view/base-view';
import { TrackList } from 'components/track-list/track-list';
import { IProps, IState, IStorage } from 'store/interfaces';
import { ModelTrack } from 'models/track';
import { ModelAlbum } from 'models/album';

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

    private isLoaded: boolean;

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

        const newTracks = ModelTrack.fetchIndexTrackList(5, 5).then((tracks) => {
            this.setState({ newList: tracks });
        });

        const popularAlbums = ModelAlbum.fetchGetIndexAlbumArray(6, 0).then((albums) => {
            this.setState({ popularAlbums: albums });
        });

        Promise.all([popularTracks, newTracks, popularAlbums]).then(() => {
            this.isLoaded = true;
            this.hide();
            this.render();
        });
    }

    /**
     * Функция отрисовки View
     */
    render(): void {
        this.page.show();

        const popularTrackList = this.isLoaded ? this.trackList.render() : null;
        const albumArray = this.isLoaded ? this.state.popularAlbums : null;

        const genreArray: Array<string> = ['Альтернативный Рок',
            'Иностранный Рок', 'Русский Рок', 'Поп', 'Хипхоп', 'Саундтреки',
            'Електронная', 'Джаз', 'Блюз', 'Кантри', 'Метал', 'Классическая'];
        this.props.parent = document.querySelector('.page__content');
        this.props.parent.insertAdjacentHTML('afterbegin', IndexTemplate({
            albums: albumArray,
            genres: genreArray,
            tracklist: popularTrackList,
            basicArticlePoster,
            basicArticleAlbum,
        }));

        this.page.setEventToTracks();
    }
}
