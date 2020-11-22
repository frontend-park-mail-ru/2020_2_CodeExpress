import { player } from 'components/player/player';
import { SideBar } from 'components/sidebar/sidebar';
import { HeaderPaper } from 'components/header-paper/header-paper';
import { Component } from 'managers/component/component';
import { IProps, IStorage, IState } from 'store/interfaces';
import { router } from 'managers/router/router';
import { HeaderMobile } from 'components/header-mobile/header-mobile';

import PageTemplate from './page.hbs';
import './page.scss';

/**
 * Класс, который отрисовывает основные компоненты сайта.
 */
export class Page extends Component {
    public header: HeaderPaper;

    private sideBar: SideBar;

    private mobileHeader: HeaderMobile;

    /**
     * Конструктор Page
     * @param {object} props - объект, в котором лежат переданные параметры
     * @param {object} storage - объект, который в котором лежат фукнции для работы с User
     */
    constructor(props: IProps, storage: IStorage<IState>) {
        super(props, storage);

        this.header = new HeaderPaper(this.props, this.storage);
        this.mobileHeader = new HeaderMobile(this.props, this.storage);
        this.sideBar = new SideBar(this.props, this.storage);
    }

    show(): void {
        const pageState: boolean = this.storage.get('pageState');
        const updateState: boolean = this.storage.get('updateState');

        if (!pageState) {
            this.render();
            this.setEventListeners();
            this.storage.set({ pageState: true });
        }
        if (pageState && updateState) {
            const page = this.props.parent.querySelector('.page');
            const pageWrapper = this.props.parent.querySelector('.page__wrapper');

            this.props.parent.querySelector('.header').remove();
            this.props.parent.querySelector('.sidebar').remove();
            document.querySelector('.header-mobile').remove();

            page.insertAdjacentHTML('afterbegin', this.sideBar.render());
            pageWrapper.insertAdjacentHTML('afterbegin', this.header.render());
            document.querySelector('#app').insertAdjacentHTML('beforeend', this.mobileHeader.render());

            this.header.mobile();
            this.sideBar.activeLink();
            this.mobileHeader.activeLink();

            const buttonBack: HTMLElement = document.querySelector('.fa-long-arrow-alt-left');
            const buttonNext: HTMLElement = document.querySelector('.fa-long-arrow-alt-right');

            buttonBack.addEventListener('click', router.back);
            buttonNext.addEventListener('click', router.forward);
        }
    }

    /**
     * Отрисовка компонента
     * @returns {*|string}
     */
    render(): void {
        this.props.parent.innerHTML = PageTemplate({
            sidebar: this.sideBar.render(),
            header: this.header.render(),
            player: player.render(),
            mobileHeader: this.mobileHeader.render(),
        });
    }

    /**
     * Установка EventListeners
     */
    setEventListeners(): void {
        player.setEventListeners();
    }

    /**
     * Установка события click на все песни в блоке с data-tracks
     */
    setEventToTracks(): void {
        const tracks: NodeList = this.props.parent.querySelectorAll('.track-item');
        player.setEventToTracks(tracks);
    }
}
