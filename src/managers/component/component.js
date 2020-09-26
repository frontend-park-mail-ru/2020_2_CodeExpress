export default class Component {
    constructor(parent, props) {
        this.parent = parent;
        this.props = props;
        this.destroy = true;
    }

    get active() {
        return !this.destroy;
    }

    hide() {
        this.parent.innerHTML = '';
        this.destroy = true;
    }

    show() {
        this.destroy = false;
        this.render();
    }
}
