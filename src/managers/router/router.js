// eslint-disable-next-line import/extensions
import { regTemplates } from '../../store/reg-templates.js';
// eslint-disable-next-line import/extensions
import Component from '../component/component.js';

export default class Router extends Component {
    constructor(props) {
        super(props);
        this.history = window.history;
        this.routes = {};
    }

    register(path, Layout) {
        this.routes[path] = {
            Layout,
            view: null,
        };
        return this;
    }

    go(path) {
        if (path === undefined) {
            return;
        }

        let route;
        let argvalue;

        Object.keys(this.routes).forEach((key) => {
            const view = this.routes[key];
            const match = key.match(regTemplates.url)[2];

            const regKey = match ? key.replace(`:${match}`, '(.+)') : key;

            if (!path.match(regKey)) {
                return;
            }

            argvalue = path.match(regKey);
            route = view;
        });

        if (!route) {
            this.go('/');
            return;
        }

        const currentView = this.routes[window.location.pathname];

        if (window.location.pathname !== path) {
            window.history.pushState(null, '', path);
        }

        const { Layout } = route;
        let { view } = route;

        if (!view) {
            view = new Layout(this.props, argvalue[1]);
        }

        if (!view.active && currentView.view && currentView.view.active) {
            currentView.view.hide();
        }

        view.show();
        this.routes[path] = { Layout, view };
    }

    back() {
        this.history.back();
    }

    forward() {
        this.history.forward();
    }

    setup() {
        this.props.parent.addEventListener('click', (event) => {
            if (event.target.tagName === 'DIV' && event.target.classList.contains('link-btn')) {
                event.preventDefault();
                this.go(event.target.dataset.url);
            }
        });
        window.addEventListener('popstate', () => {
            this.go(window.location.pathname);
        });

        this.go(window.location.pathname);
    }
}
