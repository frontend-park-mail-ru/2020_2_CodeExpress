import { BaseView } from '../../managers/base-view/base-view.js';
import { HeaderFiller } from '../../components/header-filler/header-filler.js';
import { Footer } from '../../components/footer/footer.js';
import { userFormValidator } from '../../managers/validator/validator.js';
import { regTemplates } from '../../store/reg-templates.js';
import { RouterStore } from '../../store/routes.js';
import { Request } from '../../managers/request/request.js';
import { router } from '../../managers/router/router.js';

/**
 * View отображающая страницу регистрации
 */
export class SignupView extends BaseView {
    constructor(props, storage) {
        super(props, storage);
        this.header = new HeaderFiller(this.props);
        this.footer = new Footer(this.props);

        this.submit = this.submit.bind(this);
        this.props.parent.addEventListener('submit', this.submit);

        this.template = Handlebars.templates['signup.hbs'];
    }

    submit(event) {
        event.preventDefault();
        const { target } = event;
        const email = target.querySelector('[name="email"]');
        const username = target.querySelector('[name="username"]');
        const password1 = target.querySelector('[name="password1"]');
        const password2 = target.querySelector('[name="password2"]');
        const emailErrors = target.querySelector('.email-errors');
        const formErrors = target.querySelector('.form-errors');
        const usernameErrors = target.querySelector('.username-errors');
        const passwordErrors = target.querySelector('.password-errors');
        let isValidate = true;

        usernameErrors.innerText = '';
        passwordErrors.innerText = '';
        emailErrors.innerText = '';

        const emailValidator = userFormValidator(email, regTemplates.email, 'Поле дожно быть формата email@email.ru');
        if (!emailValidator.status) {
            emailErrors.innerText = emailValidator.message;
            isValidate = false;
        }

        const usernameValidator = userFormValidator(username, regTemplates.username, 'Имя может содержать только буквы и цифры');
        if (!usernameValidator.status) {
            usernameErrors.innerText = usernameValidator.message;
            isValidate = false;
        }

        const password1Validator = userFormValidator(password1,
            regTemplates.password,
            'Длина пароля от 8 до 30 символов<br />Может содержать только латинские буквы и цифры');

        if (!password1Validator.status) {
            passwordErrors.innerHTML = password1Validator.message;
            isValidate = false;
        }

        if (password1.value && password1.value && password1.value !== password2.value) {
            passwordErrors.innerHTML += '<br />Пароли не совпадают';
            isValidate = false;
        }

        const payload = {
            email: email.value,
            username: username.value,
            password: password1.value,
            repeated_password: password2.value,
        };

        if (isValidate) {
            Request.post(RouterStore.api.user.register, { payload }).then((res) => {
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
                router.go(RouterStore.website.index);
            });
        }
    }

    render() {
        const user = this.storage.get('user');

        if (user.isLoaded) {
            router.go('/');
        } else {
            this.props.parent.innerHTML = this.template({
                header: this.header.render(),
                footer: this.footer.render(),
            });
        }
    }
}
