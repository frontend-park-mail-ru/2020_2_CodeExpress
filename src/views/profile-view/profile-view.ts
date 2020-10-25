import { Page } from 'components/page/page';
import { View } from 'managers/base-view/base-view';
import { Request } from 'managers/request/request';
import { RouterStore } from 'store/routes';
import { userFormValidator } from 'managers/validator/validator';
import { regTemplates } from 'store/reg-templates';
import { router } from 'managers/router/router';
import { ModelUser } from 'models/user';
import { IProps, IState } from 'store/interfaces';

import ProfileTemplate from './profile.hbs';
import './profile.scss';

/**
 * View отображающая страницу профиля
 */
export class ProfileView extends View<IProps, IState> {
    private page: Page;

    /**
     * Конструктор ProfileView
     * @param {object} props - объект, в котором лежат переданные параметры
     * @param {object} storage - объект, который в котором лежат фукнции для работы с User
     */
    constructor(props: IProps, storage: any) {
        super(props, storage);
        this.page = new Page(this.props, this.storage);

        this.changeAvatar = this.changeAvatar.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.changeProfile = this.changeProfile.bind(this);
        this.logout = this.logout.bind(this);
    }

    /**
     * Обработчик формы изменения аватарки пользователя
     * @param {Event} event
     */
    changeAvatar(event: Event) {
        event.preventDefault();

        const { target } = event;
        const file = (<HTMLInputElement>target).files[0];
        const formErrors: HTMLInputElement = (<HTMLElement>target).querySelector('.avatar-error');

        const payload = new FormData();
        payload.append('avatar', file);

        Request.post(RouterStore.api.user.change.avatar, { payload, serialize: false }).then((res) => {
            const { status, body } = res;

            if (status !== 200) {
                formErrors.innerText = body.message;
                return;
            }
            const user = this.storage.get('user');
            const avatar = body.avatar.slice(1);
            user.update({ avatar });

            const profileAvatarPage: HTMLImageElement = this.props.parent.querySelector('.form-avatar__img') as HTMLImageElement;
            const profileAvatarHeader: HTMLImageElement = this.props.parent.querySelector('.header__profile-avatar ') as HTMLImageElement;

            profileAvatarPage.src = `http://musicexpress.sarafa2n.ru:8080${avatar}`;
            profileAvatarHeader.src = `http://musicexpress.sarafa2n.ru:8080${avatar}`;
        });
    }

    /**
     * Обработчик формы изменения данных пользователя
     * @param {object} event
     */
    changeProfile(event: Event) {
        event.preventDefault();

        const { target } = event;
        const email: HTMLInputElement = (<HTMLElement>target).querySelector('[name="email"]');
        const username: HTMLInputElement = (<HTMLElement>target).querySelector('[name="username"]');
        const formErrors: HTMLInputElement = (<HTMLElement>target).querySelector('.profile-error');
        let isValidate = true;

        const emailValidator = userFormValidator(email, regTemplates.email, 'Поле дожно быть формата email@email.ru');
        if (!emailValidator.status) {
            formErrors.innerText = emailValidator.message;
            isValidate = false;
        }

        const usernameValidator = userFormValidator(username, regTemplates.username, 'Имя может содержать только буквы и цифры');
        if (!usernameValidator.status) {
            formErrors.innerText = usernameValidator.message;
            isValidate = false;
        }

        if (!isValidate) {
            return;
        }

        const payload = {
            email: email.value,
            username: username.value,
        };

        Request.post(RouterStore.api.user.change.profile, { payload, serialize: true }).then((res) => {
            const { status, body } = res;
            if (status !== 200) {
                formErrors.innerText = body.message;
                return;
            }

            const user = this.storage.get('user');
            user.update({ username: body.username, email: body.email });

            email.value = user.get('email');
            username.value = user.get('username');
        });
    }

    /**
     * Обработчик формы изменения пароля пользователя
     * @param {object} event
     */
    changePassword(event: Event) {
        event.preventDefault();

        const { target } = event;
        const password1: HTMLInputElement = (<HTMLElement>target).querySelector('[name="new_password"]');
        const password2: HTMLInputElement = (<HTMLElement>target).querySelector('[name="new_repeated_password"]');
        const formErrors: HTMLInputElement = (<HTMLElement>target).querySelector('.password-error');
        let isValidate = true;

        const password1Validator = userFormValidator(password1,
            regTemplates.password,
            'Длина пароля от 8 до 30 символов<br />Может содержать только латинские буквы и цифры');

        if (!password1Validator.status) {
            formErrors.innerHTML = password1Validator.message;
            isValidate = false;
        }

        if (password1.value && password1.value && password1.value !== password2.value) {
            formErrors.innerHTML += '<br />Пароли не совпадают';
            isValidate = false;
        }

        if (!isValidate) {
            return;
        }

        const payload = {
            password: password1.value,
            repeated_password: password2.value,
        };

        Request.post(RouterStore.api.user.change.password, { payload, serialize: true }).then((res) => {
            const { status, body } = res;
            if (status !== 200) {
                formErrors.innerText = body.message;
            }
        });
    }

    /**
     * Обработчик клика на кнопку выхода
     * @param {object} event
     */
    logout(event: Event) {
        event.preventDefault();

        // TODO: Передалать позже на выскакивающее сообщение
        const logoutErrors: HTMLElement = this.props.parent.querySelector('.logout-error');

        Request.delete(RouterStore.api.user.logout).then((res) => {
            const { status, body } = res;
            if (status === 200) {
                const newUser = new ModelUser();
                const user = this.storage.get('user');
                user.update(newUser.attrs);
                user.isLoaded = false;
                this.storage.set({ user });

                const parent: HTMLElement = document.querySelector('.layout__right-sidebar-wrap');
                const header = parent.querySelector('.sub-menu');
                parent.removeChild(header);
                parent.insertAdjacentHTML('afterbegin', this.page.header.render());

                router.go(RouterStore.website.index);
            } else {
                logoutErrors.innerText = body.message;
            }
        });
    }

    /**
     * Функция отрисовки View
     */
    render() {
        const user = this.storage.get('user');

        if (!user.isLoaded) {
            router.go('/');
            return;
        }

        this.page.show();
        this.storage.set({ pageState: true });

        this.props.parent = document.querySelector('.layout__content_wrap');
        const avatar: string = user.get('avatar');
        this.props.parent.insertAdjacentHTML('afterbegin', ProfileTemplate({
            username: user.get('username'), email: user.get('email'), isAvatar: avatar !== '' && avatar, avatar,
        }));

        const avatarChangeForm: HTMLElement = this.props.parent.querySelector('.form-change-avatar');
        avatarChangeForm.addEventListener('change', this.changeAvatar);

        const profileChangeForm: HTMLElement = this.props.parent.querySelector('.form-change-profile');
        profileChangeForm.addEventListener('submit', this.changeProfile);

        const passwordChangeForm: HTMLElement = this.props.parent.querySelector('.form-change-password');
        passwordChangeForm.addEventListener('submit', this.changePassword);
        const logoutBtn: HTMLElement = this.props.parent.querySelector('.logout-btn');
        logoutBtn.addEventListener('click', this.logout);
    }
}
