import { Component } from 'managers/component/component';

import FooterTemplate from './footer.hbs';
import './footer.css';
/**
 * Подвал сайта на страницах sign up и login
 */
export class Footer extends Component {
    /**
     * Отрисовка компонента
     * @returns {*|string}
     */
    render(): HTMLCollection {
        return FooterTemplate();
    }
}