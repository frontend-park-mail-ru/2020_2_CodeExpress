// eslint-disable-next-line import/extensions
import Player from '../player/player.js';
// eslint-disable-next-line import/extensions
import SideBar from '../sidebar/sidebar.js';
// eslint-disable-next-line import/extensions
import HeaderPaper from '../header-paper/header-paper.js';
// eslint-disable-next-line import/extensions
import Component from '../../managers/component/component.js';

export default class Page extends Component {
    init() {
        const { parent } = this.props;
        const template = Handlebars.templates['page.hbs'];
        parent.innerHTML = template();

        const sideBarParent = parent.querySelector('.layout__sidebars');
        const sidebar = new SideBar({ parent: sideBarParent });
        sidebar.render();

        const headerPaperParent = parent.querySelector('.layout__right-sidebar-wrap');
        const headerPaper = new HeaderPaper({ parent: headerPaperParent });
        headerPaper.render();
        const player = new Player(this.props);
        player.init();
        this.setState({ player });
        this.setState({ sidebar });
    }

    setEvents() {
        const tracksWrap = this.props.parent.querySelector('[data-tracks="true"]');
        this.state.player.setEventToTracks(tracksWrap);
    }
}
