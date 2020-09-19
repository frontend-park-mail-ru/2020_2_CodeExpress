export default class Route {
    constructor(root) {
        this.history = window.history;
        this.routers = {};
        this.root = root;
    }

    register(path, View) {
        this.routers[path] = {
            View,
            view: null,
        };
        return this;
    }

    redirect(path) {
        if (path === undefined) {
            return;
        }

        let route;
        let argvalue;

        Object.keys(this.routers).forEach((key) => {
            const view = this.routers[key];
            const match = key.match(/([^:]+):?(.+)?/)[2];

            const regKey = match ? key.replace(`:${match}`, '(.+)') : key;

            if (!path.match(regKey)) {
                return;
            }

            argvalue = path.match(regKey);
            route = view;
        });

        if (!route) {
            this.redirect('/');
            return;
        }

        const currentView = this.routers[window.location.pathname];

        if (window.location.pathname !== path) {
            window.history.pushState(null, '', path);
        }

        const { View } = route;
        let { view } = route;

        if (!view) {
            view = new View(this.root, argvalue[1]);
        }

        if (!view.active) {
            if (currentView.view && currentView.view.active) {
                currentView.view.hide();
            }
        }

        view.show();
        this.routers[path] = { View, view };
    }

    back() {
        this.history.back();
    }

    next() {
        this.history.forward();
    }

    start() {
        this.redirect(window.location.pathname);

        this.root.addEventListener('click', (event) => {
            if (event.target.tagName === 'DIV' && event.target.className === 'link-btn') {
                event.preventDefault();
                this.redirect(event.target.dataset.url);
            }
        });
        window.addEventListener('popstate', () => {
            this.redirect(window.location.pathname);
        });
    }
}
