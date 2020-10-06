import { Component } from '../../managers/component/component.js';

/**
 * Header на основных страницах
 */
export class HeaderPaper extends Component {
    constructor(props, storage) {
        super(props, storage);

        this.template = Handlebars.templates['header-paper.hbs'];
    }

    /**
     * Отрисовка компонента
     * @returns {*|string}
     */
    render() {
        const user = this.storage.get('user');
        return this.template({ load: user.isLoaded, username: user.get('username') });
    }
}
