import { regTemplates } from 'store/reg-templates';
import { Component } from 'managers/component/component';
import { View } from 'managers/base-view/base-view';
import { IProps } from 'store/interfaces';

/**
 * Функция поиска параметров в url
 * @param path
 * @param key
 * @returns {boolean}
 */
const findArgs = (path: string, key: string): boolean => { // TODO : Доделать маршрутизацию по динамическим урлам.
    const match = key.match(regTemplates.url);
    const args = match[2];
    if (args) {
        // eslint-disable-next-line no-param-reassign
        key = key.replace(`:${args}`, '(.+)');
    }

    return !path.match(key);
};

interface IRouterState {
    args: string,
    currentView: View
}
/**
 * Компонент маршрутизатор проекта
 */
class Router extends Component<IProps, IRouterState> {
    history: History;

    private routes: Map<string, any>;

    state: IRouterState = { args: null, currentView: null };

    /**
     * Конструктор роутера
     * @param {object} props - объект, в котором лежат переданные параметры
     */
    constructor(props: IProps) {
        super(props);
        this.history = window.history;
        this.routes = new Map();

        this.handleMouseClick = this.handleMouseClick.bind(this);
        this.props.parent.addEventListener('click', this.handleMouseClick);
        window.addEventListener('popstate', () => { this.go(window.location.pathname); });
    }

    /**
     * Функция добавления пары Path View в route
     * @param {string} path - pathname
     * @param {object} view - View, которая отображается по данному path
     * @returns {Router}
     */
    register(path: string, view: View): this {
        this.routes.set(path, view);
        return this;
    }

    /**
     * Функция перехода по сайту
     * @param {string} path - pathname куда нужно перейти
     */
    go(path: string): void {
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

    back(): void {
        this.history.back();
    }

    forward(): void {
        this.history.forward();
    }

    /**
     * Обработчик клика
     * @param {object} event
     */
    handleMouseClick(event: Event): void {
        const { target } = event;
        if ((<HTMLElement>target).classList.contains('link-btn')) {
            event.preventDefault();
            this.go((<HTMLElement>target).dataset.url);
        }
    }

    setup() {
        this.go(window.location.pathname);
    }
}

export const router = new Router({ parent: document.getElementById('app') as HTMLElement });
