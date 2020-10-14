import { Component } from 'managers/component/component';
import HeaderPaperTemplate from './header-paper.hbs';
import './header-paper.css';
/**
 * Header на основных страницах
 */
export class HeaderPaper extends Component {
    /**
     * Конструктор HeaderPaper
     * @param {object} props - объект, в котором лежат переданные параметры
     * @param {object} storage - объект, который в котором лежат фукнции для работы с User
     */
    constructor(props, storage) {
        super(props, storage);

        this.template = HeaderPaperTemplate;
    }

    /**
     * Отрисовка компонента
     * @returns {*|string}
     */
    render() {
        const user = this.storage.get('user');
        const avatar = user.get('avatar');
        return this.template({
            load: user.isLoaded, username: user.get('username'), isAvatar: avatar !== '' && avatar, avatar,
        });
    }
}
