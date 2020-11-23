import { Component } from 'managers/component/component';
import { ModelUser } from 'models/user';
import { baseStaticUrl } from 'managers/request/request';
import { isMobile } from 'store/consts';

import HeaderPaperTemplate from './header-paper.hbs';
import './header-paper.scss';

const defaultAvatar = require('../../assets/default/user-default.svg');
/**
 * Header на основных страницах
 */
export class HeaderPaper extends Component {
    /**
     * Отрисовка компонента
     * @returns {*|string}
     */
    render(): string {
        const user: ModelUser = this.storage.get('user');
        const avatar: string = user.get('avatar');
        return HeaderPaperTemplate({
            load: user.isLoaded,
            username: user.get('username'),
            isAvatar: avatar !== '' && avatar,
            avatar,
            baseStaticUrl,
            defaultAvatar,
        });
    }

    mobile() {
        if (isMobile) {
            const header = document.querySelector('.header');
            if (window.scrollY > 0) {
                header.classList.add('header-paper_mobile');
            } else {
                header.classList.remove('header-paper_mobile');
            }

            window.addEventListener('scroll', () => {
                if (window.scrollY > 0) {
                    header.classList.add('header-paper_mobile');
                } else {
                    header.classList.remove('header-paper_mobile');
                }
            });
        }
    }
}
