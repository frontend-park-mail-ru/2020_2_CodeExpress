import { regTemplates } from 'store/reg-templates';
import { Component } from 'managers/component/component';
import { View } from 'managers/base-view/base-view';
import { IProps } from 'store/interfaces';

interface IFindArgs {
    matchPath: boolean,
    arg: string
}
/**
 * Функция поиска параметров в url
 * @param path
 * @param key
 * @returns {boolean}
 */
const findArgs = (path: string, key: string): IFindArgs => {
    const reg = new RegExp(`^${key.replace(regTemplates.searchValue, regTemplates.replaceValue)}?$`);
    const match = path.match(reg);
    const arg = match ? match[1] : null;

    return { matchPath: !match, arg };
};

interface IRouterState {
    arg: string,
    currentView: View
}
/**
 * Компонент маршрутизатор проекта
 */
class Router extends Component<IProps, IRouterState> {
    history: History;

    private routes: Map<string, any>;

    state: IRouterState = { arg: null, currentView: null };

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
        this.setState({ currentView: null });
        if (window.location.pathname !== path) {
            window.history.pushState(null, '', path);
        }
        this.routes.forEach((view, key) => {
            const { matchPath, arg } = findArgs(path, key);

            if (matchPath) {
                return;
            }
            this.setState({ currentView: view, arg });
        });

        if (!this.state.currentView) {
            this.props.parent.innerHTML = '404';
        } else {
            this.state.currentView.show(this.state.arg);
        }
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

        const port = process.env.DEBUG === 'true' ? `:${process.env.PORT}` : '';
        const replaceUrl = `http://${window.location.hostname}${port}`;

        if ((<HTMLElement>target).tagName === 'A') {
            event.preventDefault();
            this.go((<HTMLLinkElement>target).href.replace(replaceUrl, ''));
        } else {
            const parent: HTMLAnchorElement = (<HTMLElement>target).closest('a');
            if (parent !== null) {
                event.preventDefault();
                this.go(parent.href.replace(replaceUrl, ''));
            }
        }
    }

    setup() {
        this.go(window.location.pathname);
    }
}

export const router = new Router({ parent: document.getElementById('app') as HTMLElement });
