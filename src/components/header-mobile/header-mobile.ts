import { Component } from 'managers/component/component';
import { ModelUser } from 'models/user';

import HeaderFillerTemplate from './header-mobile.hbs';
import './header-mobile.scss';
/**
 * Header на страницах sing up и login
 */
export class HeaderMobile extends Component {
    /**
     * Отрисовка компонента
     * @returns {string}
     */
    render(): string {
        const user: ModelUser = this.storage.get('user');
        return HeaderFillerTemplate({
            userAuth: user.isLoaded,
        });
    }

    activeLink() {
        const activeClass = 'header-mobile__item_active';
        const activeLink = document.querySelector(`.${activeClass}`);

        if (activeLink) {
            activeLink.classList.remove(activeClass);
        }

        document.querySelectorAll('.header-mobile__item').forEach((item: HTMLLinkElement) => {
            if (item.href === window.location.href) {
                item.classList.add(activeClass);
            }
        });
    }
}
