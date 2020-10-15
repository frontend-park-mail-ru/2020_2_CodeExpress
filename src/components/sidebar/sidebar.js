import { Component } from 'managers/component/component';

import SlideBarTemplate from './sidebar.hbs';
import './sidebar.css';
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

        this.template = SlideBarTemplate;
    }

    /**
     * Отрисовка компонента
     * @returns {*|string}
     */
    render() {
        return this.template();
    }
}
