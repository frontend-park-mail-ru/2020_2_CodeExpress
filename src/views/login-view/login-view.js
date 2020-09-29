// eslint-disable-next-line import/extensions
import BaseView from '../../managers/base-view/base-view.js';
// eslint-disable-next-line import/extensions
import HeaderFiller from '../../components/header-filler/header-filler.js';
// eslint-disable-next-line import/extensions
import Footer from '../../components/footer/footer.js';

export default class LoginView extends BaseView {
    render() {
        const template = Handlebars.templates['login.hbs'];
        const header = new HeaderFiller(this.props);
        const footer = new Footer(this.props);

        this.props.parent.innerHTML = template();
        header.init();
        footer.init();
    }
}
