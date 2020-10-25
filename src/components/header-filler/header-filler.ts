import { Component } from 'managers/component/component';
import HeaderFillerTemplate from './header-filler.hbs';
/**
 * Header на страницах sing up и login
 */
export class HeaderFiller extends Component {
    /**
     * Отрисовка компонента
     * @returns {*|string}
     */
    render(): HTMLCollection {
        return HeaderFillerTemplate();
    }
}
