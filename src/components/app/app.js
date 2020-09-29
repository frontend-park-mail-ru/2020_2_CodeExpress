// eslint-disable-next-line import/extensions
import Route from '../../managers/router/router.js';
// eslint-disable-next-line import/extensions
import { RouterStore } from '../../store/routes.js';
// eslint-disable-next-line import/extensions
import IndexView from '../../views/index-view/index-view.js';
// eslint-disable-next-line import/extensions
import LoginView from '../../views/login-view/login-view.js';
// eslint-disable-next-line import/extensions
import Component from '../../managers/component/component.js';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.routes = new Route(this.props);
        this.routes
            .register(RouterStore.website.index, IndexView)
            .register(RouterStore.website.login, LoginView);
    }

    start() {
        this.routes.setup();
    }
}
