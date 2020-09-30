import { Player } from '../player/player.js';
import { SideBar } from '../sidebar/sidebar.js';
import { HeaderPaper } from '../header-paper/header-paper.js';
import { Component } from '../../managers/component/component.js';

/**
 * Класс, который отрисовывает основные компоненты сайта.
 */
export class Page extends Component {
    constructor(props) {
        super(props);

        this.template = Handlebars.templates['page.hbs'];
        this.header = new HeaderPaper(this.props);
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
        const tracksWrap = this.props.parent.querySelector('[data-tracks="true"]');
        this.player.setEventListeners(tracksWrap);
    }
}
