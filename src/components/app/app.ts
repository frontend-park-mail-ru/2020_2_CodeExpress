import { router } from 'managers/router/router';
import { RouterStore } from 'store/routes';
import { IndexView } from 'views/index-view/index-view';
import { ProfileView } from 'views/profile-view/profile-view';
import { LoginView } from 'views/login-view/login-view';
import { SignupView } from 'views/signup-view/signup-view';
import { AlbumView } from 'views/album-view/album-view';
import { ArtistView } from 'views/artist-view/artist-view';
import { FavoriteTrackView } from 'views/favoriteTrack-view/favoriteTrack-view';
import { PlaylistsView } from 'views/playlists-view/playlists-view';
import { Component } from 'managers/component/component';
import { ModelUser } from 'models/user';
import { ModelPlayList } from 'models/playlist';
import { IProps } from 'store/interfaces';
import { PlaylistView } from 'views/playlist-view/playlist-view';

import './app.scss';
import './button.scss';

interface IAppState {
    user: ModelUser;
    playlists?: ModelPlayList[]
    updateState?: boolean
}

type stateKeys = keyof IAppState;
/**
 * Класс инициализатор.
 */
export class App extends Component<IProps, IAppState> {
    state: IAppState = { user: new ModelUser() };

    /**
     *  Конструктор компонента App
     * @param {object} props - объект, в котором лежат переданные параметры
     */
    constructor(props: IProps) {
        super(props);

        this.storage = {
            get: (key: stateKeys) => (key ? this.state[key] || null : this.state),
            set: (value: any) => { this.setState(value); },
        };
        router
            .register(RouterStore.website.index, new IndexView(this.props, this.storage))
            .register(RouterStore.website.login, new LoginView(this.props, this.storage))
            .register(RouterStore.website.signup, new SignupView(this.props, this.storage))
            .register(RouterStore.website.profile, new ProfileView(this.props, this.storage))
            .register(RouterStore.website.album, new AlbumView(this.props, this.storage))
            .register(RouterStore.website.artist, new ArtistView(this.props, this.storage))
            .register(RouterStore.website.favorite, new FavoriteTrackView(this.props, this.storage))
            .register(RouterStore.website.playlists, new PlaylistsView(this.props, this.storage))
            .register(RouterStore.website.playlist, new PlaylistView(this.props, this.storage));
    }

    /**
     * Функция инициализатор
     */
    start() {
        const url: string = window.location.pathname;
        ModelUser.getCurrentUser().then((user) => {
            ModelPlayList.fetchGetPlaylists().then((playlists) => {
                this.setState({ playlists, user, updateState: true });
                router.go(url);
            });
        });

        router.setup();
    }
}
