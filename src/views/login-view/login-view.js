import { BaseView } from '../../managers/base-view/base-view.js';
import { HeaderFiller } from '../../components/header-filler/header-filler.js';
import { Footer } from '../../components/footer/footer.js';
import { userFormValidator } from '../../managers/validator/validator.js';
import { regTemplates } from '../../store/reg-templates.js';
import { Request } from '../../managers/request/request.js';
import { RouterStore } from '../../store/routes.js';
import { router } from '../../managers/router/router.js';

/**
 * View отображающая страницу входа
 */
export class LoginView extends BaseView {
    constructor(props, storage) {
        super(props, storage);
        this.header = new HeaderFiller(this.props);
        this.footer = new Footer(this.props);

        this.submit = this.submit.bind(this);
        this.template = Handlebars.templates['login.hbs'];
    }

    submit(event) {
        event.preventDefault();
        const { target } = event;
        const login = target.querySelector('[name="login"]');
        const password = target.querySelector('[name="password"]');
        const formErrors = target.querySelector('.form-errors');
        let isValidate = true;

        formErrors.innerText = '';

        const usernameValidator = userFormValidator(
            login, regTemplates.username,
            'Имя может содержать только буквы и цифры. Минимальная длина 2 символа',
        );

        if (!usernameValidator.status) {
            formErrors.innerText = usernameValidator.message;
            isValidate = false;
        }

        const password1Validator = userFormValidator(password,
            regTemplates.password,
            'Длина пароля от 8 до 30 символов<br />Может содержать только латинские буквы и цифры');

        if (!password1Validator.status) {
            formErrors.innerHTML = password1Validator.message;
            isValidate = false;
        }

        const payload = {
            login: login.value,
            password: password.value,
        };

        if (!isValidate) {
            return;
        }

        Request.post(RouterStore.api.user.login, { payload }).then((res) => {
            const { status, body } = res;
            if (status !== 200) {
                formErrors.innerText = body.message;
                return;
            }

            const userAttrs = {
                id: body.id,
                username: body.username,
                email: body.email,
            };

            const user = this.storage.get('user');
            user.update(userAttrs);
            user.isLoaded = true;
            this.storage.set('user', user);
            router.back();
        });
    }

    render() {
        const user = this.storage.get('user');

        if (user.isLoaded) {
            router.go(RouterStore.website.index);
            return;
        }

        this.props.parent.innerHTML = this.template({ header: this.header.render(), footer: this.footer.render() });
        const form = this.props.parent.querySelector('.login-form');
        form.addEventListener('submit', this.submit);
    }
}
