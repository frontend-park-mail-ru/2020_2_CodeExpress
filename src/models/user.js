import { RouterStore } from 'store/routes';
import { Request } from 'managers/request/request';

/**
 * Модель пользователя
 */
export class ModelUser {
    /**
     * конструктор модели пользователя
     * @param {object} attrs - объект, в котором храняться данные пользователя
     * @param {boolean} isLoaded - флаг показывающий загружен ли пользователь
     */
    constructor(attrs = null, isLoaded = false) {
        const defaults = {
            id: null,
            username: null,
            email: null,
            avatar: null,
        };

        this.attrs = { ...defaults, ...attrs };
        this.isLoaded = isLoaded;
    }

    /**
     * Функция получения значения по ключу из объека модели
     * @param {string} key - поле, значение которого нужно получить
     * @param defaultv
     * @returns {*}
     */
    get(key, defaultv) {
        const spl = key.split('.');

        let result = this.attrs;
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < spl.length; i++) {
            const tempKey = spl[i];
            result = result[tempKey];

            if (result === undefined) {
                return defaultv;
            }

            if (result === null) {
                return defaultv || result;
            }
        }
        return result;
    }

    /**
     * Функция изменения полей в объекте модели
     * @param {object} attrs - объект, в котором храняться данные пользователя
     */
    update(attrs) {
        this.attrs = Object.assign(this.attrs, attrs);
    }

    /**
     * Функция получения текущего пользователя с сервера
     * @returns {Promise}
     */
    static getCurrentUser() {
        return new Promise((resolve) => {
            const url = RouterStore.api.user.current;
            let user;
            Request.get(url).then((res) => {
                const { body, status } = res;
                if (status === 200) {
                    user = new ModelUser();
                    user.attrs.username = body.username;
                    user.attrs.email = body.email;
                    user.attrs.id = body.id;
                    user.attrs.avatar = body.avatar.slice(1);
                    user.isLoaded = true;
                } else {
                    user = new ModelUser();
                }
                resolve(user);
            });
        });
    }
}
