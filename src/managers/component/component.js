export default class Component {
    constructor(parent, props) {
        this.parent = parent;
        this.props = props;
        this.hidden = true;
    }

    get active() {
        return !this.hidden;
    }

    hide() {
        this.parent.innerHTML = '';
        this.hidden = true;
    }

    show() {
        this.hidden = false;
        this.render();
    }
}
