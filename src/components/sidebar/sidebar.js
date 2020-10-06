import { Component } from '../../managers/component/component.js';

/**
 * Боковое меню
 */
export class SideBar extends Component {
    /**
     * Конструктор SideBar
     * @param {object} props - объект, в котором лежат переданные параметры
     */
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
