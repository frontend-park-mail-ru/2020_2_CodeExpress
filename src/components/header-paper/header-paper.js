import { Component } from '../../managers/component/component.js';

export class HeaderPaper extends Component {
    constructor(props) {
        super(props);

        this.template = Handlebars.templates['header-paper.hbs'];
    }

    render() {
        return this.template();
    }
}
