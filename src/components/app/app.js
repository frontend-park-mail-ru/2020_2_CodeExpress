import { router } from 'managers/router/router';
import { RouterStore } from 'store/routes';
import { IndexView } from 'views/index-view/index-view';
import { ProfileView } from 'views/profile-view/profile-view';
import { LoginView } from 'views/login-view/login-view';
import { SignupView } from 'views/signup-view/signup-view';
import { Component } from 'managers/component/component';
import { ModelUser } from 'models/user';

import './base.css';
/**
 * Класс инициализатор.
 */
export class App extends Component {
    /**
     *  Конструктор компонента App
     * @param {object} props - объект, в котором лежат переданные параметры
     */
    constructor(props) {
        super(props);

        const user = new ModelUser();

        this.state = {
            user,
        };

        this.storage = {
            get: (key) => (key ? this.state[key] || null : this.state),
            set: (key, value) => { this.setState(key, value); },
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
        console.log(router);
        ModelUser.getCurrentUser().then((user) => {
            this.setState({ user });
        });
        router.setup();
    }
}
