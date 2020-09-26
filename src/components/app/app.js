// eslint-disable-next-line import/extensions
import Route from '../../managers/router/router.js';

export default class App {
    constructor(parent = document.body) {
        this.props = {
            parent,
        };

        this.routes = new Route(this.props.parent);
    }

    start() {
        this.routes.routing();
    }
}
