import { Component } from '../../managers/component/component.js';

export class Footer extends Component {
    constructor(props) {
        super(props);

        this.template = Handlebars.templates['footer.hbs'];
    }

    /**
     * Отрисовка компонента
     * @returns {*|string}
     */
    render() {
        return this.template();
    }
}
