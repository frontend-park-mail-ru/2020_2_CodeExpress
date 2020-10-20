import { Player } from 'components/player/player';
import { SideBar } from 'components/sidebar/sidebar';
import { HeaderPaper } from 'components/header-paper/header-paper';
import { Component } from 'managers/component/component';
import { IProps, IStorage, IState } from 'store/interfaces';

import PageTemplate from './page.hbs';
/**
 * Класс, который отрисовывает основные компоненты сайта.
 */
export class Page extends Component {
    private header: HeaderPaper;

    private player: Player;

    private sideBar: SideBar;

    /**
     * Конструктор Page
     * @param {object} props - объект, в котором лежат переданные параметры
     * @param {object} storage - объект, который в котором лежат фукнции для работы с User
     */
    constructor(props: IProps, storage: IStorage<IState>) {
        super(props, storage);

        this.header = new HeaderPaper(this.props, this.storage);
        this.player = new Player(this.props);
        this.sideBar = new SideBar(this.props);
    }

    /**
     * Отрисовка компонента
     * @returns {*|string}
     */
    render(): void {
        this.props.parent.innerHTML = PageTemplate({
            sidebar: this.sideBar.render(), header: this.header.render(), player: this.player.render(),
        });
    }

    /**
     * Установка EventListeners
     */
    setEventListeners(): void {
        this.player.setEventListeners();
    }

    /**
     * Установка события click на все песни в блоке с data-tracks
     */
    setEventToTracks(): void {
        const tracksWrap: HTMLElement = this.props.parent.querySelector('[data-tracks="true"]');
        this.player.setEventToTracks(tracksWrap);
    }
}