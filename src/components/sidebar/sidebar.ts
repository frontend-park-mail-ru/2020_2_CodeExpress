import { Component } from 'managers/component/component';

import SlideBarTemplate from './sidebar.hbs';
import './sidebar.css';
/**
 * Боковое меню
 */
export class SideBar extends Component {
    /**
     * Отрисовка компонента
     * @returns {*|string}
     */
    render() {
        return SlideBarTemplate();
    }
}
