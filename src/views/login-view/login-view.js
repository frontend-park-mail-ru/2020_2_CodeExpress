import { BaseView } from '../../managers/base-view/base-view.js';
import { HeaderFiller } from '../../components/header-filler/header-filler.js';
import { Footer } from '../../components/footer/footer.js';

/**
 * View отображающая страницу входа
 */
export class LoginView extends BaseView {
    constructor(props, storage) {
        super(props, storage);
        this.header = new HeaderFiller(this.props);
        this.footer = new Footer(this.props);

        this.template = Handlebars.templates['login.hbs'];
    }

    render() {
        const user = this.storage.get('user');
        const router = this.storage.get('router');

        if (user.isLoaded) {
            router.go('/');
        } else {
            this.props.parent.innerHTML = this.template({ header: this.header.render(), footer: this.footer.render() });
        }
    }
}
