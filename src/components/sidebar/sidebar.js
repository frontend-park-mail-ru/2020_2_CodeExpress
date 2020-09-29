// eslint-disable-next-line import/extensions
import Component from '../../managers/component/component.js';

export default class SideBar extends Component {
    render() {
        const template = Handlebars.templates['sidebar.hbs'];
        this.props.parent.insertAdjacentHTML('afterbegin', template());
    }
}
