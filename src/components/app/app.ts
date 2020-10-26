import { router } from 'managers/router/router';
import { RouterStore } from 'store/routes';
import { IndexView } from 'views/index-view/index-view';
import { ProfileView } from 'views/profile-view/profile-view';
import { LoginView } from 'views/login-view/login-view';
import { SignupView } from 'views/signup-view/signup-view';
import { Component } from 'managers/component/component';
import { ModelUser } from 'models/user';
import { IProps } from 'store/interfaces';

import './app.scss';

interface IAppState {
    user: ModelUser;
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
            .register(RouterStore.website.profile, new ProfileView(this.props, this.storage));
    }

    /**
     * Функция инициализатор
     */
    start() {
        ModelUser.getCurrentUser().then((user) => {
            this.setState({ user });
        }).then(() => { router.setup(); });
    }
}
