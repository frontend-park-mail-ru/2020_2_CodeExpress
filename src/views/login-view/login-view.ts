import { View } from 'managers/base-view/base-view';
import { HeaderFiller } from 'components/header-filler/header-filler';
import { Footer } from 'components/footer/footer';
import { userFormValidator } from 'managers/validator/validator';
import { regTemplates } from 'store/reg-templates';
import { Request } from 'managers/request/request';
import { RouterStore } from 'store/routes';
import { router } from 'managers/router/router';
import { IProps, IStorage, IState } from 'src/store/interfaces';
import { player } from 'components/player/player';

import LoginTemplate from './login.hbs';
import './login.css';

/**
 * View отображающая страницу входа
 */
export class LoginView extends View {
    private header: HeaderFiller;

    private footer: Footer;

    /**
     * Конструктор LoginView
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
     * Обработчик формы авторизации
     * @param {object} event
     */
    submit(event: Event): void {
        event.preventDefault();
        const { target } = event;
        const login: HTMLInputElement = (<HTMLElement>target).querySelector('[name="login"]');
        const password: HTMLInputElement = (<HTMLElement>target).querySelector('[name="password"]');
        const formErrors: HTMLElement = (<HTMLElement>target).querySelector('.form-errors');
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

        Request.post(RouterStore.api.user.login, { payload, serialize: true }).then((res) => {
            const { status, body } = res;
            if (status !== 200) {
                formErrors.innerText = body.message;
                return;
            }

            const userAttrs = {
                id: body.id,
                username: body.username,
                email: body.email,
                avatar: body.avatar.slice(1),
            };

            const user = this.storage.get('user');
            user.update(userAttrs);
            user.isLoaded = true;
            this.storage.set({ user });
            router.back();
        });
    }

    /**
     * Функция отрисовки View
     */
    render(): void {
        const pageState = this.storage.get('pageState');
        if (pageState) {
            player.stop();
        }

        this.storage.set({ pageState: false });

        const user = this.storage.get('user');

        if (user.isLoaded) {
            router.go(RouterStore.website.index);
            return;
        }

        this.props.parent.innerHTML = LoginTemplate({ header: this.header.render(), footer: this.footer.render() });
        const form: HTMLFormElement = this.props.parent.querySelector('.login-form');
        form.addEventListener('submit', this.submit);
    }
}
