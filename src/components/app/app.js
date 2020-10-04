import { router } from '../../managers/router/router.js';
import { RouterStore } from '../../store/routes.js';
import { IndexView } from '../../views/index-view/index-view.js';
import { ProfileView } from '../../views/profile-view/profile-view.js';
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

    start() {
        router.setup();
    }
}
