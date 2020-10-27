import { player } from 'components/player/player';
import { SideBar } from 'components/sidebar/sidebar';
import { HeaderPaper } from 'components/header-paper/header-paper';
import { Component } from 'managers/component/component';
import { IProps, IStorage, IState } from 'store/interfaces';

import PageTemplate from './page.hbs';
import './page.scss';

/**
 * Класс, который отрисовывает основные компоненты сайта.
 */
export class Page extends Component {
    public header: HeaderPaper;

    private sideBar: SideBar;

    /**
     * Конструктор Page
     * @param {object} props - объект, в котором лежат переданные параметры
     * @param {object} storage - объект, который в котором лежат фукнции для работы с User
     */
    constructor(props: IProps, storage: IStorage<IState>) {
        super(props, storage);

        this.header = new HeaderPaper(this.props, this.storage);
        this.sideBar = new SideBar(this.props);
    }

    show(): void {
        const pageState: boolean = this.storage.get('pageState');
        if (!pageState) {
            this.render();
            this.setEventListeners();
        }
    }

    /**
     * Отрисовка компонента
     * @returns {*|string}
     */
    render(): void {
        this.props.parent.innerHTML = PageTemplate({
            sidebar: this.sideBar.render(), header: this.header.render(), player: player.render(),
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
