import { Component } from '../../managers/component/component.js';

/**
 * Header на страницах sing up и login
 */
export class HeaderFiller extends Component {
    /**
     * Конструктор HeaderFiller
     * @param {object} props - объект, в котором лежат переданные параметры
     */
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
