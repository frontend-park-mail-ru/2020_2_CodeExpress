import { Component } from '../../managers/component/component.js';

/**
 * Header на страницах sing up и login
 */
export class HeaderFiller extends Component {
    constructor(props) {
        super(props);

        this.template = Handlebars.templates['header-filler.hbs'];
    }

    /**
     * Отрисовка компонента
     * @returns {*|string}
     */
    render() {
        return this.template();
    }
}
