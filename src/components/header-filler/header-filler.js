import { Component } from '../../managers/component/component.js';

export class HeaderFiller extends Component {
    constructor(props) {
        super(props);

        this.template = Handlebars.templates['header-filler.hbs'];
    }

    render() {
        return this.template();
    }
}
