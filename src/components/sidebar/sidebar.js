import { Component } from '../../managers/component/component.js';

/**
 * Боковое меню
 */
export class SideBar extends Component {
    constructor(props) {
        super(props);

        this.template = Handlebars.templates['sidebar.hbs'];
    }

    /**
     * Отрисовка компонента
     * @returns {*|string}
     */
    render() {
        return this.template();
    }
}
