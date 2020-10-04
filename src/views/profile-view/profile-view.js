import { Page } from '../../components/page/page.js';
import { BaseView } from '../../managers/base-view/base-view.js';

/**
 * View отображающая страницу профиля
 */
export class ProfileView extends BaseView {
    constructor(props, storage) {
        super(props, storage);
        this.page = new Page(this.props, this.storage);

        this.template = Handlebars.templates['profile.hbs'];
    }

    render() {
        this.page.render();

        const parent = this.props.parent.querySelector('.layout__content_wrap');

        parent.insertAdjacentHTML('afterbegin', this.template());

        this.page.setEventListeners();
    }
}
