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

    activeLink() {
        const activeClass = 'group-links__link_active';
        const activeLink = document.querySelector(`.${activeClass}`);

        if (activeLink) {
            activeLink.classList.remove(activeClass);
        }

        document.querySelectorAll('.group-links__link').forEach((item: HTMLLinkElement) => {
            if (item.href === window.location.href) {
                item.classList.add(activeClass);
            }
        });
    }
}
