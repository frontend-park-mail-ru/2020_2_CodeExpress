import { Page } from 'components/page/page';
import { View } from 'managers/base-view/base-view';
import { TrackList } from 'components/track-list/track-list';
import { IProps, IState, IStorage } from 'store/interfaces';
import { debounce } from 'managers/utils/utils';
import { ModelSearch } from 'models/search';

import SearchTemplate from './search.hbs';
import AlbumsTemplate from './albums.hbs';
import ArtistsTemplate from './artists.hbs';
import TracksTemplate from './tracks.hbs';
import UsersTemplate from './users.hbs';
import NotFoundTemplate from './placeholder.hbs';
import './search.scss';
import 'components/track-list/track.scss';
import './list-item.scss';
import NotFound from '../../assets/default/notFound.svg';
import Start from '../../assets/default/search.svg';

/**
 * View отображающая страницу поиска
 */
export class SearchView extends View {
    private page: Page;

    private isEmpty: boolean;

    /**
     * Конструктор SearchView
     * @param {object} props - объект, в котором лежат переданные параметры
     * @param {object} storage - объект, который в котором лежат фукнции для работы с User
     */
    constructor(props: IProps, storage: IStorage<IState>) {
        super(props, storage);
        this.page = new Page(this.props, this.storage);

        this.isEmpty = true;
    }

    search = (event: Event): void => {
        event.preventDefault();
        const { target } = event;

        const query: HTMLInputElement = <HTMLInputElement>target;

        if (query.value) {
            ModelSearch.fetchGet(query.value, 0, 20).then((res) => { // TODO: magic number
                this.isEmpty = false;

                document.querySelector('.search-page-section__wrapper_tracks').innerHTML = '';
                document.querySelector('.search-page-section__wrapper_albums').innerHTML = '';
                document.querySelector('.search-page-section__wrapper_artists').innerHTML = '';
                document.querySelector('.search-page-section__wrapper_users').innerHTML = '';
                document.querySelector('.search-page-section__wrapper_placeholder').innerHTML = '';

                if (res.attrs.tracks) {
                    document.querySelector('.search-page-section__wrapper_tracks').insertAdjacentHTML(
                        'afterbegin',
                        TracksTemplate() + new TrackList({ tracksList: res.attrs.tracks }, this.storage).render(),
                    );
                    this.page.setEventToTracks();
                }
                if (res.attrs.albums) {
                    document.querySelector('.search-page-section__wrapper_albums').insertAdjacentHTML(
                        'afterbegin',
                        AlbumsTemplate({ albums: res.attrs.albums }),
                    );
                }
                if (res.attrs.artists) {
                    document.querySelector('.search-page-section__wrapper_artists').insertAdjacentHTML(
                        'afterbegin',
                        ArtistsTemplate({ artists: res.attrs.artists }),
                    );
                }
                if (res.attrs.users) {
                    document.querySelector('.search-page-section__wrapper_users').insertAdjacentHTML(
                        'afterbegin',
                        UsersTemplate({ users: res.attrs.users }),
                    );
                }
                if (!res.attrs.artists && !res.attrs.albums && !res.attrs.tracks && !res.attrs.users) {
                    document.querySelector('.search-page-section__wrapper_placeholder').insertAdjacentHTML(
                        'afterbegin',
                        NotFoundTemplate({ placeholder: NotFound, isEmpty: this.isEmpty }),
                    );
                }
            });
        } else if (query.value === '') {
            this.isEmpty = true;
            document.querySelector('.search-page-section__wrapper_tracks').innerHTML = '';
            document.querySelector('.search-page-section__wrapper_albums').innerHTML = '';
            document.querySelector('.search-page-section__wrapper_artists').innerHTML = '';
            document.querySelector('.search-page-section__wrapper_users').innerHTML = '';
            document.querySelector('.search-page-section__wrapper_placeholder').innerHTML = '';
            document.querySelector('.search-page-section__wrapper_placeholder').insertAdjacentHTML(
                'afterbegin',
                NotFoundTemplate({ placeholder: Start, isEmpty: this.isEmpty }),
            );
        }
    };

    /**
     * Функция отрисовки View
     */
    render(): void {
        this.page.show();
        this.props.parent = document.querySelector('.page__content');

        this.props.parent = document.querySelector('.page__content');
        this.props.parent.insertAdjacentHTML('afterbegin', SearchTemplate());
        document.querySelector('.search-page-section__wrapper_placeholder').insertAdjacentHTML(
            'afterbegin',
            NotFoundTemplate({ placeholder: Start, isEmpty: this.isEmpty }),
        );

        const { parent } = this.props;
        const search = debounce(this.search, 400);

        parent.querySelector('.header__search-input').addEventListener('input', search);
        parent.querySelector('.header__search').addEventListener('submit', this.search);
    }
}
