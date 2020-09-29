// eslint-disable-next-line import/extensions
import { regTemplates } from '../../store/reg-templates.js';
// eslint-disable-next-line import/extensions
import Component from '../component/component.js';

export default class Router extends Component {
    constructor(props) {
        super(props);
        this.history = window.history;
        this.routes = new Map();
        this.state = {
            args: null,
            currentView: null,
        };

        this.handlerMouseClick = this.handlerMouseClick.bind(this);
        this.props.parent.addEventListener('click', this.handlerMouseClick);
        window.addEventListener('popstate', () => { this.go(window.location.pathname); });
    }

    register(path, View) {
        this.routes.set(path, new View(this.props));
        return this;
    }

    findArgs(path, key) { // TODO : Доделать маршрутизацию по динамическим урлам.
        const match = key.match(regTemplates.url);
        const args = match[2];
        if (args) {
            // eslint-disable-next-line no-param-reassign
            key = key.replace(`:${args}`, '(.+)');
            this.setState(args);
        }

        return !path.match(key);
    }

    go(path) {
        if (path === undefined) {
            return;
        }

        if (this.state.currentView) {
            this.state.currentView.hide();
        }

        if (window.location.pathname !== path) {
            window.history.pushState(null, '', path);
        }

        this.routes.forEach((view, key) => {
            const matchPath = this.findArgs(path, key);

            if (matchPath) {
                return;
            }

            this.setState({ currentView: view });
        });

        this.state.currentView.show();
    }

    back() {
        this.history.back();
    }

    forward() {
        this.history.forward();
    }

    handlerMouseClick(event) {
        if (event.target.tagName === 'DIV' && event.target.classList.contains('link-btn')) {
            event.preventDefault();
            this.go(event.target.dataset.url);
        }
    }

    setup() {
        this.go(window.location.pathname);
    }
}
