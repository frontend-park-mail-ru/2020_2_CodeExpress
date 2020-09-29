// eslint-disable-next-line import/extensions
import Component from '../../managers/component/component.js';

export default class HeaderFiller extends Component {
    init() {
        const template = Handlebars.templates['header-filler.hbs'];
        this.props.parent.insertAdjacentHTML('afterbegin', template());
    }
}
