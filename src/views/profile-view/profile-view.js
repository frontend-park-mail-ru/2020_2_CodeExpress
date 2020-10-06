import { Page } from '../../components/page/page.js';
import { BaseView } from '../../managers/base-view/base-view.js';
import { Request } from '../../managers/request/request.js';
import { RouterStore } from '../../store/routes.js';
import { userFormValidator } from '../../managers/validator/validator.js';
import { regTemplates } from '../../store/reg-templates.js';
import { router } from '../../managers/router/router.js';

/**
 * View отображающая страницу профиля
 */
export class ProfileView extends BaseView {
    /**
     * Конструктор ProfileView
     * @param {object} props - объект, в котором лежат переданные параметры
     * @param {object} storage - объект, который в котором лежат фукнции для работы с User
     */
    constructor(props, storage) {
        super(props, storage);
        this.page = new Page(this.props, this.storage);

        this.changeAvatar = this.changeAvatar.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.changeProfile = this.changeProfile.bind(this);
        this.logout = this.logout.bind(this);
        this.template = Handlebars.templates['profile.hbs'];
    }

    /**
     * Обработчик формы изменения аватарки пользователя
     * @param {object} event
     */
    changeAvatar(event) {
        event.preventDefault();

        const { target } = event;
        const file = target.files[0];
        const formErrors = target.querySelector('.profile-change-errors');

        const payload = new FormData();
        payload.append('avatar', file);

        Request.post(RouterStore.api.user.change.avatar, { payload, serialize: false }).then((res) => {
            const { status, body } = res;

            if (status !== 200) {
                formErrors.innerText = body.message;
                return;
            }
            const user = this.storage.get('user');
            user.update(body.user);
        });
    }

    /**
     * Обработчик формы изменения данных пользователя
     * @param {object} event
     */
    changeProfile(event) {
        event.preventDefault();

        const { target } = event;
        const email = target.querySelector('[name="email"]');
        const username = target.querySelector('[name="username"]');
        const formErrors = target.querySelector('.profile-change-errors');
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

        Request.post(RouterStore.api.user.change.profile, { payload }).then((res) => {
            const { status, body } = res;
            if (status !== 200) {
                formErrors.innerText = body.message;
                return;
            }

            const user = this.storage.get('user');
            user.update(body.user);

            email.value = user.get('email');
            username.value = user.get('username');
        });
    }

    /**
     * Обработчик формы изменения пароля пользователя
     * @param {object} event
     */
    changePassword(event) {
        event.preventDefault();

        const { target } = event;
        const password1 = target.querySelector('[name="password1"]');
        const password2 = target.querySelector('[name="password2"]');
        const formErrors = target.querySelector('.password-errors');
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

        Request.post(RouterStore.api.user.change.profile, { payload }).then((res) => {
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
    logout(event) {
        event.preventDefault();

        // TODO: Передалать позже на выскакивающее сообщение
        const logoutErrors = this.props.parent.querySelector('.logout-error');

        Request.post(RouterStore.api.user.logout).then((res) => {
            const { status, body } = res;
            if (status === 200) {
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

        this.page.render();

        const parent = this.props.parent.querySelector('.layout__content_wrap');

        parent.insertAdjacentHTML('afterbegin', this.template({ username: user.get('username'), email: user.get('email') }));

        this.page.setEventListeners();

        const avatarChangeForm = this.props.parent.querySelector('.form-change-avatar');
        avatarChangeForm.addEventListener('change', this.changeAvatar);

        const profileChangeForm = this.props.parent.querySelector('.form-change-profile');
        profileChangeForm.addEventListener('submit', this.changeProfile);

        const passwordChangeForm = this.props.parent.querySelector('.form-change-password');
        passwordChangeForm.addEventListener('submit', this.changePassword);

        const logoutBtn = this.props.parent.querySelector('.logout-btn');
        logoutBtn.addEventListener('click', this.logout);
    }
}
