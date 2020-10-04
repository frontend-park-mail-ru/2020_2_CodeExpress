import { Router } from '../../managers/router/router.js';
import { RouterStore } from '../../store/routes.js';
import { IndexView } from '../../views/index-view/index-view.js';
import { LoginView } from '../../views/login-view/login-view.js';
import { SignupView } from '../../views/signup-view/signup-view.js';
import { Component } from '../../managers/component/component.js';
import { ModelUser } from '../../models/user.js';

/**
 * Класс инициализатор.
 */
export class App extends Component {
    constructor(props) {
        super(props);

        const router = new Router(this.props);
        const user = new ModelUser();

        this.state = {
            user,
            router,
        };

        this.storage = {
            get: (key) => (key ? this.state[key] || null : this.state),
            set: (key, value) => { this.setState(key, value); },
        };

        this.state.router
            .register(RouterStore.website.index, new IndexView(this.props, this.storage))
            .register(RouterStore.website.login, new LoginView(this.props, this.storage))
            .register(RouterStore.website.signup, new SignupView(this.props, this.storage));
    }

    start() {
        const { router } = this.state;
        //
        // ModelUser.getCurrentUser().then((user) => {
        //     this.setState({ user, loading: false });
        //     router.go(window.location.pathname);
        // });

        router.setup();
    }
}
