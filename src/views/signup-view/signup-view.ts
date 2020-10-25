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
import './signup.scss';

const banner1 = require('../../assets/backgrounds/banner1.jpg');
const banner2 = require('../../assets/backgrounds/banner2.jpg');

/**
 * View отображающая страницу регистрации
 */
export class SignupView extends View {
    private header: HeaderFiller;

    private footer: Footer;

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
    }

    /**
     * Обработчик формы регистрации
     * @param {object} event
     */
    submit(event: Event) {
        event.preventDefault();
        const { target } = event;

        const errorInputClass = 'form-signup__error';
        const errorHelpTextActive = 'help-error_active';

        const email: HTMLInputElement = (<HTMLInputElement>target).querySelector('[name="email"]');
        const username: HTMLInputElement = (<HTMLInputElement>target).querySelector('[name="username"]');
        const password1: HTMLInputElement = (<HTMLInputElement>target).querySelector('[name="password1"]');
        const password2: HTMLInputElement = (<HTMLInputElement>target).querySelector('[name="password2"]');
        const emailErrors: HTMLElement = (<HTMLElement>target).querySelector('.email-error');
        const formErrors: HTMLElement = document.querySelector('.signup-page__errors');
        const usernameErrors: HTMLElement = (<HTMLElement>target).querySelector('.username-error');
        const passwordErrors: HTMLElement = (<HTMLElement>target).querySelector('.password-error');
        let isValidate = true;

        username.classList.remove(errorInputClass);
        email.classList.remove(errorInputClass);
        password1.classList.remove(errorInputClass);
        password2.classList.remove(errorInputClass);

        formErrors.innerText = '';
        usernameErrors.innerText = '';
        usernameErrors.classList.remove(errorHelpTextActive);
        passwordErrors.innerText = '';
        passwordErrors.classList.remove(errorHelpTextActive);
        emailErrors.innerText = '';
        emailErrors.classList.remove(errorHelpTextActive);

        const emailValidator = userFormValidator(email, regTemplates.email, 'Поле дожно быть формата email@email.ru');
        if (!emailValidator.status) {
            emailErrors.innerText = emailValidator.message;
            emailErrors.classList.add(errorHelpTextActive);
            email.classList.add(errorInputClass);
            isValidate = false;
        }

        const usernameValidator = userFormValidator(username, regTemplates.username, 'Имя может содержать только буквы и цифры');
        if (!usernameValidator.status) {
            usernameErrors.innerText = usernameValidator.message;
            usernameErrors.classList.add(errorHelpTextActive);
            username.classList.add(errorInputClass);
            isValidate = false;
        }

        const password1Validator = userFormValidator(password1,
            regTemplates.password,
            'Длина пароля от 8 до 30 символов<br />Может содержать только латинские буквы и цифры');

        if (!password1Validator.status) {
            passwordErrors.innerHTML = password1Validator.message;
            passwordErrors.classList.add(errorHelpTextActive);
            password1.classList.add(errorInputClass);
            password2.classList.add(errorInputClass);
            isValidate = false;
        }

        if (password1.value && password1.value && password1.value !== password2.value) {
            passwordErrors.innerHTML += '<br />Пароли не совпадают';
            passwordErrors.classList.add(errorHelpTextActive);
            password1.classList.add(errorInputClass);
            password2.classList.add(errorInputClass);
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
                router.go(RouterStore.website.index);
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

        const images: Array<File> = [banner1, banner2];

        this.props.parent.innerHTML = SighupTemplate({ img: images[Math.floor(Math.random() * 2)] });

        const form: HTMLFormElement = this.props.parent.querySelector('.form-signup');
        form.addEventListener('submit', this.submit);
    }
}
