import { Component } from '../../managers/component/component.js';

export class Footer extends Component {
    constructor(props) {
        super(props);

        this.template = Handlebars.templates['footer.hbs'];
    }

    render() {
        return this.template();
    }
}
