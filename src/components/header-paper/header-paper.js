// eslint-disable-next-line import/extensions
import Component from '../../managers/component/component.js';

export default class HeaderPaper extends Component {
    render() {
        const template = Handlebars.templates['header-paper.hbs'];
        this.props.parent.insertAdjacentHTML('afterbegin', template());
    }
}
