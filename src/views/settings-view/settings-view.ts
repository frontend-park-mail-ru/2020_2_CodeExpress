import { Page } from 'components/page/page';
import { View } from 'managers/base-view/base-view';
import { baseStaticUrl, Request } from 'managers/request/request';
import { RouterStore } from 'store/routes';
import { userFormValidator } from 'managers/validator/validator';
import { regTemplates } from 'store/reg-templates';
import { router } from 'managers/router/router';
import { ModelUser } from 'models/user';
import { IProps, IState } from 'store/interfaces';
import { toast } from 'components/app/app';

import SettingsTemplate from './settings.hbs';
import './settings.scss';

import defaultAvatar from '../../assets/default/user-default.png';

/**
 * View отображающая страницу профиля
 */
export class SettingsView extends View<IProps, IState> {
    private page: Page;

    /**
     * Конструктор SettingsView
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
        const file: File = (<HTMLInputElement>target).files[0];
        const formErrors: HTMLInputElement = document.querySelector('.avatar-error');
        const profileAvatarPage: HTMLImageElement = this.props.parent.querySelector('.form-avatar__img') as HTMLImageElement;
        const profileAvatarHeader: HTMLImageElement = document.querySelector('.header__profile-avatar') as HTMLImageElement;

        const payload = new FormData();
        payload.append('avatar', file);

        Request.put(RouterStore.api.user.change.avatar, { payload, serialize: false }).then((res) => {
            const { status, body } = res;

            if (status !== 200) {
                formErrors.innerText = body.message;
                toast.add(body.message, false);
                return;
            }

            const user = this.storage.get('user');
            const avatar = body.avatar.replace('.', baseStaticUrl);
            user.update({ avatar });

            profileAvatarPage.src = avatar;
            profileAvatarHeader.src = avatar;

            toast.add('Аватар усешно был изменен', true);
        });
    }

    /**
     * Обработчик формы изменения данных пользователя
     * @param {object} event
     */
    changeProfile(event: Event) {
        event.preventDefault();

        const errorInputClass = 'input__error';
        const { target } = event;
        const email: HTMLInputElement = (<HTMLElement>target).querySelector('[name="email"]');
        const username: HTMLInputElement = (<HTMLElement>target).querySelector('[name="username"]');
        const formErrors: HTMLInputElement = (<HTMLElement>target).querySelector('.profile-error');
        let isValidate = true;

        email.classList.remove(errorInputClass);
        username.classList.remove(errorInputClass);
        formErrors.innerText = '';

        const emailValidator = userFormValidator(email, regTemplates.email, 'Поле дожно быть формата email@email.ru');
        if (!emailValidator.status) {
            formErrors.innerText = emailValidator.message;
            email.classList.add(errorInputClass);
            isValidate = false;
        }

        const usernameValidator = userFormValidator(username, regTemplates.username, 'Имя может содержать только буквы и цифры');
        if (!usernameValidator.status) {
            formErrors.innerText = usernameValidator.message;
            username.classList.add(errorInputClass);
            isValidate = false;
        }

        if (!isValidate) {
            toast.add('Ошибка в форме', false);
            return;
        }

        const payload = {
            email: email.value,
            username: username.value,
        };

        Request.put(RouterStore.api.user.change.profile, { payload, serialize: true }).then((res) => {
            const { status, body } = res;
            if (status !== 200) {
                formErrors.innerText = body.message;
                toast.add(body.message, false);
                return;
            }

            const user = this.storage.get('user');
            user.update({ username: body.username, email: body.email });

            email.value = user.get('email');
            username.value = user.get('username');
            toast.add('Данные успешно обновлены', true);
        });
    }

    /**
     * Обработчик формы изменения пароля пользователя
     * @param {object} event
     */
    changePassword(event: Event) {
        event.preventDefault();

        const errorInputClass = 'input__error';
        const { target } = event;
        const oldPassword: HTMLInputElement = (<HTMLElement>target).querySelector('[name="old_password"]');
        const newPassword: HTMLInputElement = (<HTMLElement>target).querySelector('[name="new_password"]');
        const newPasswordRepeated: HTMLInputElement = (<HTMLElement>target).querySelector('[name="new_repeated_password"]');
        const formErrors: HTMLInputElement = (<HTMLElement>target).querySelector('.password-error');
        let isValidate = true;

        oldPassword.classList.remove(errorInputClass);
        newPassword.classList.remove(errorInputClass);
        newPasswordRepeated.classList.remove(errorInputClass);
        formErrors.innerText = '';

        const password1Validator = userFormValidator(newPassword,
            regTemplates.password,
            'Длина пароля от 8 до 30 символов<br />Может содержать только латинские буквы и цифры');

        if (!oldPassword.value) {
            formErrors.innerHTML = 'Заполните поле';
            oldPassword.classList.add(errorInputClass);
            isValidate = false;
        }

        if (!password1Validator.status) {
            formErrors.innerHTML = password1Validator.message;
            newPassword.classList.add(errorInputClass);
            isValidate = false;
        }

        if (!newPasswordRepeated.value) {
            formErrors.innerHTML = 'Заполните поле';
            newPasswordRepeated.classList.add(errorInputClass);
            isValidate = false;
        }

        if (newPassword.value && newPasswordRepeated.value && newPassword.value !== newPasswordRepeated.value) {
            formErrors.innerHTML += '<br />Пароли не совпадают';
            newPassword.classList.add(errorInputClass);
            newPasswordRepeated.classList.add(errorInputClass);
            isValidate = false;
        }

        if (!isValidate) {
            toast.add('Ошибка в форме', false);
            return;
        }

        const payload = {
            old_password: oldPassword.value,
            password: newPassword.value,
            repeated_password: newPasswordRepeated.value,
        };

        Request.put(RouterStore.api.user.change.password, { payload, serialize: true }).then((res) => {
            const { status, body } = res;
            if (status !== 200) {
                formErrors.innerText = body.message;
                toast.add(body.message, false);
            }
            toast.add('Пароль успешно изменен', true);
        });
    }

    /**
     * Обработчик клика на кнопку выхода
     * @param {object} event
     */
    logout(event: Event) {
        event.preventDefault();

        Request.delete(RouterStore.api.user.logout).then((res) => {
            const { status, body } = res;
            if (status === 200) {
                const newUser = new ModelUser();
                const user = this.storage.get('user');
                user.update(newUser.attrs);
                user.isLoaded = false;
                this.storage.set({ user });

                const parent: HTMLElement = document.querySelector('.page__wrapper');
                const header = parent.querySelector('.header');
                parent.removeChild(header);
                parent.insertAdjacentHTML('afterbegin', this.page.header.render());

                router.go(RouterStore.website.index);
            } else {
                toast.add(body.message, false);
            }
        });
    }

    /**
     * Функция отрисовки View
     */
    render() {
        const user = this.storage.get('user');
        const avatar: string = user.get('avatar');

        if (!user.isLoaded && this.storage.get('updateState')) {
            this.storage.set({ pageState: false });
            router.go('/');
            return;
        }

        this.page.show();
        this.props.parent = document.querySelector('.page__content');

        this.props.parent.insertAdjacentHTML('afterbegin', SettingsTemplate({
            username: user.get('username'),
            email: user.get('email'),
            isAvatar: avatar !== '' && avatar,
            avatar,
            defaultAvatar,
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
