import { View } from 'managers/base-view/base-view';
import { HeaderFiller } from 'components/header-filler/header-filler';
import { Footer } from 'components/footer/footer';
import { userFormValidator } from 'managers/validator/validator';
import { regTemplates } from 'store/reg-templates';
import { baseStaticUrl, Request } from 'managers/request/request';
import { RouterStore } from 'store/routes';
import { router } from 'managers/router/router';
import { IProps, IStorage, IState } from 'src/store/interfaces';
import { player } from 'components/player/player';

import LoginTemplate from './login.hbs';
import './login.scss';

const banner1 = require('../../assets/backgrounds/banner1.jpg');
const banner2 = require('../../assets/backgrounds/banner2.jpg');

/**
 * View отображающая страницу входа
 */
export class LoginView extends View<IProps, IState> {
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

        const errorInputClass = 'form-login__error';

        const login: HTMLInputElement = (<HTMLElement>target).querySelector('[name="login"]');
        const password: HTMLInputElement = (<HTMLElement>target).querySelector('[name="password"]');
        const formErrors: HTMLElement = document.querySelector('.login-page__errors');
        let isValidate = true;

        login.classList.remove(errorInputClass);
        password.classList.remove(errorInputClass);
        formErrors.innerText = '';

        if (!login.value) {
            formErrors.innerText = 'Заполните поле';
            login.classList.add(errorInputClass);
            isValidate = false;
        }

        if (!password.value) {
            formErrors.innerHTML = 'Заполните поле';
            password.classList.add(errorInputClass);
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
                login.classList.add(errorInputClass);
                password.classList.add(errorInputClass);
                return;
            }

            const userAttrs = {
                id: body.id,
                username: body.username,
                email: body.email.replace('.', baseStaticUrl),
                avatar: body.avatar.slice(1),
            };

            const user = this.storage.get('user');
            user.update(userAttrs);
            user.isLoaded = true;
            this.storage.set({ user });
            this.storage.set({ updateState: true });
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

        const images: Array<File> = [banner1, banner2];

        this.props.parent.innerHTML = LoginTemplate({ img: images[Math.floor(Math.random() * 2)] });
        const form: HTMLFormElement = this.props.parent.querySelector('.form-login');
        form.addEventListener('submit', this.submit);
    }
}
