import { BaseView } from '../../managers/base-view/base-view.js';
import { HeaderFiller } from '../../components/header-filler/header-filler.js';
import { Footer } from '../../components/footer/footer.js';

export class LoginView extends BaseView {
    constructor(props) {
        super(props);
        this.header = new HeaderFiller(this.props);
        this.footer = new Footer(this.props);

        this.template = Handlebars.templates['login.hbs'];
    }

    render() {
        this.props.parent.innerHTML = this.template({ header: this.header.render(), footer: this.footer.render() });
    }
}
