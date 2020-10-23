import { View } from 'managers/base-view/base-view';
import { HeaderFiller } from 'components/header-filler/header-filler';
import { Footer } from 'components/footer/footer';
import { userFormValidator } from 'managers/validator/validator';
import { regTemplates } from 'store/reg-templates';
import { RouterStore } from 'store/routes';
import { Request } from 'managers/request/request';
import { router } from 'managers/router/router';
import { IProps, IState, IStorage } from 'store/interfaces';
import { ModelUser } from 'models/user';
import { player } from 'components/player/player';

import SighupTemplate from './signup.hbs';
import './signup.css';
/**
 * View отображающая страницу регистрации
 */
export class SignupView extends View {
    private header: HeaderFiller;

    private footer: Footer;

    private readonly template: any;

    /**
     * Конструктор SignupView
     * @param {object} props - объект, в котором лежат переданные параметры
     * @param {object} storage - объект, который в котором лежат фукнции для работы с User
     */
    constructor(props: IProps, storage: IStorage<IState>) {
        super(props, storage);
        this.header = new HeaderFiller(this.props);
        this.footer = new Footer(this.props);

        this.submit = this.submit.bind(this);
        this.template = SighupTemplate;
    }

    /**
     * Обработчик формы регистрации
     * @param {object} event
     */
    submit(event: Event) {
        event.preventDefault();
        const { target } = event;
        const email: HTMLInputElement = (<HTMLInputElement>target).querySelector('[name="email"]');
        const username: HTMLInputElement = (<HTMLInputElement>target).querySelector('[name="username"]');
        const password1: HTMLInputElement = (<HTMLInputElement>target).querySelector('[name="password1"]');
        const password2: HTMLInputElement = (<HTMLInputElement>target).querySelector('[name="password2"]');
        const emailErrors: HTMLElement = (<HTMLElement>target).querySelector('.email-errors');
        const formErrors: HTMLElement = (<HTMLElement>target).querySelector('.form-errors');
        const usernameErrors: HTMLElement = (<HTMLElement>target).querySelector('.username-errors');
        const passwordErrors: HTMLElement = (<HTMLElement>target).querySelector('.password-errors');
        let isValidate = true;

        formErrors.innerText = '';
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

        if (!isValidate) {
            return;
        }

        Request.post(RouterStore.api.user.register, { payload, serialize: true }).then((res) => {
            const { status, body } = res;
            if (status !== 200) {
                formErrors.innerText = body.message;
                return;
            }

            if (status === 200) {
                router.go(RouterStore.website.login);
            }
        });
    }

    /**
     * Функция отрисовки View
     */
    render() {
        const pageState = this.storage.get('pageState');
        if (pageState === true) {
            player.stop();
        }

        this.storage.set({ pageState: false });

        const user: ModelUser = this.storage.get('user');

        if (user.isLoaded) {
            router.go('/');
            return;
        }

        this.props.parent.innerHTML = this.template({
            header: this.header.render(),
            footer: this.footer.render(),
        });

        const form: HTMLFormElement = this.props.parent.querySelector('.sign-up-form');
        form.addEventListener('submit', this.submit);
    }
}
