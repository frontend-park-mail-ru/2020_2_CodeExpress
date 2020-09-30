import { Router } from '../../managers/router/router.js';
import { RouterStore } from '../../store/routes.js';
import { IndexView } from '../../views/index-view/index-view.js';
import { LoginView } from '../../views/login-view/login-view.js';
import { Component } from '../../managers/component/component.js';

export class App extends Component {
    constructor(props) {
        super(props);
        this.router = new Router(this.props);
        this.router
            .register(RouterStore.website.index, new IndexView(props))
            .register(RouterStore.website.login, new LoginView(props));
    }

    start() {
        this.router.setup();
    }
}
