import { regTemplates } from '../../store/reg-templates.js';
import { Component } from '../component/component.js';

/**
 * Функция поиска параметров в url
 * @param path
 * @param key
 * @returns {boolean}
 */
const findArgs = (path, key) => { // TODO : Доделать маршрутизацию по динамическим урлам.
    const match = key.match(regTemplates.url);
    const args = match[2];
    if (args) {
        // eslint-disable-next-line no-param-reassign
        key = key.replace(`:${args}`, '(.+)');
    }

    return !path.match(key);
};

/**
 * Компонент маршрутизатор проекта
 */
class Router extends Component {
    constructor(props) {
        super(props);
        this.history = window.history;
        this.routes = new Map();
        this.state = {
            args: null,
            currentView: null,
        };

        this.handleMouseClick = this.handleMouseClick.bind(this);
        this.props.addEventListener('click', this.handleMouseClick);
        window.addEventListener('popstate', () => { this.go(window.location.pathname); });
    }

    /**
     * Функция добавления пары Path View в route
     * @param path
     * @param View
     * @returns {Router}
     */
    register(path, View) {
        this.routes.set(path, View);
        return this;
    }

    /**
     * Функция перехода по сайту
     * @param path
     */
    go(path) {
        if (path === undefined) {
            return;
        }

        const { currentView } = this.state;
        if (currentView) {
            currentView.hide();
        }

        if (window.location.pathname !== path) {
            window.history.pushState(null, '', path);
        }

        this.routes.forEach((view, key) => {
            const matchPath = findArgs(path, key);

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

    /**
     * Обработчик клика
     * @param event
     */
    handleMouseClick(event) {
        if (event.target.classList.contains('link-btn')) {
            event.preventDefault();
            this.go(event.target.dataset.url);
        }
    }

    setup() {
        this.go(window.location.pathname);
    }
}

export const router = new Router(document.getElementById('app'));
