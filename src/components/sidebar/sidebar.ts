import { Component } from 'managers/component/component';
import { ModelUser } from 'models/user';
import SlideBarTemplate from './sidebar.hbs';

import './sidebar.scss';
/**
 * Боковое меню
 */
export class SideBar extends Component {
    /**
     * Отрисовка компонента
     * @returns {*|string}
     */
    render() {
        const user: ModelUser = this.storage.get('user');
        return SlideBarTemplate({
            userAuth: user.isLoaded,
        });
    }
}
