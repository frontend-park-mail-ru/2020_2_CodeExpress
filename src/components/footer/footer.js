import { Component } from 'managers/component/component';

import FooterTemplate from './footer.hbs';
import './footer.css';
/**
 * Подвал сайта на страницах sign up и login
 */
export class Footer extends Component {
    /**
     * Конструктор подвала
     * @param {object} props - объект, в котором лежат переданные параметры
     */
    constructor(props) {
        super(props);

        this.template = FooterTemplate;
    }

    /**
     * Отрисовка компонента
     * @returns {*|string}
     */
    render() {
        return this.template();
    }
}
