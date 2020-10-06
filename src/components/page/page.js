import { Player } from '../player/player.js';
import { SideBar } from '../sidebar/sidebar.js';
import { HeaderPaper } from '../header-paper/header-paper.js';
import { Component } from '../../managers/component/component.js';

/**
 * Класс, который отрисовывает основные компоненты сайта.
 */
export class Page extends Component {
    /**
     * Конструктор Page
     * @param {object} props - объект, в котором лежат переданные параметры
     * @param {object} storage - объект, который в котором лежат фукнции для работы с User
     */
    constructor(props, storage) {
        super(props, storage);

        this.template = Handlebars.templates['page.hbs'];
        this.header = new HeaderPaper(this.props, this.storage);
        this.player = new Player(this.props);
        this.sideBar = new SideBar(this.props);
    }

    /**
     * Отрисовка компонента
     * @returns {*|string}
     */
    render() {
        this.props.parent.innerHTML = this.template({
            sidebar: this.sideBar.render(), header: this.header.render(), player: this.player.render(),
        });
    }

    /**
     * Установка EventListeners
     */
    setEventListeners() {
        this.player.setEventListeners();
    }

    /**
     * Установка события click на все песни в блоке с data-tracks
     */
    setEventToTracks() {
        const tracksWrap = this.props.parent.querySelector('[data-tracks="true"]');
        this.player.setEventToTracks(tracksWrap);
    }
}
