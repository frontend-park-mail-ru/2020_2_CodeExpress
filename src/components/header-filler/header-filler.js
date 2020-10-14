import { Component } from 'managers/component/component';
import HeaderFillerTemplate from './header-filler.hbs';
import './header.css';
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

        this.template = HeaderFillerTemplate;
    }

    /**
     * Отрисовка компонента
     * @returns {*|string}
     */
    render() {
        return this.template();
    }
}
