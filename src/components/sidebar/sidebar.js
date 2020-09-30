import { Component } from '../../managers/component/component.js';

export class SideBar extends Component {
    constructor(props) {
        super(props);

        this.template = Handlebars.templates['sidebar.hbs'];
    }

    render() {
        return this.template();
    }
}
