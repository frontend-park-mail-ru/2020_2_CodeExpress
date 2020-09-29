// eslint-disable-next-line import/extensions
import Component from '../component/component.js';

export default class BaseView extends Component {
    constructor(props) {
        super(props);
        this.destroy = true;
    }

    get active() {
        return !this.destroy;
    }

    hide() {
        this.props.parent.innerHTML = '';
        this.destroy = true;
    }

    show() {
        this.destroy = false;
        this.render();
    }
}
