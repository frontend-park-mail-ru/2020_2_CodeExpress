// eslint-disable-next-line import/extensions
import Component from '../../managers/component/component.js';

export default class Footer extends Component {
    init() {
        const template = Handlebars.templates['footer.hbs'];
        this.props.parent.insertAdjacentHTML('beforeend', template());
    }
}
