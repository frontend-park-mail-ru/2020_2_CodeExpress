import { RouterStore } from 'store/routes';
import { Request } from 'managers/request/request';

interface IUserAttrs {
    id: number,
    username: string,
    email: string,
    avatar: string,
}

type userKeys = keyof IUserAttrs;

/**
 * Модель пользователя
 */
export class ModelUser {
    attrs: IUserAttrs;

    isLoaded: boolean;

    /**
     * конструктор модели пользователя
     * @param {object} attrs - объект, в котором храняться данные пользователя
     * @param {boolean} isLoaded - флаг показывающий загружен ли пользователь
     */
    constructor(attrs: IUserAttrs = null, isLoaded = false) {
        const defaults: IUserAttrs = {
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
     * @returns {*}
     */
    get(key: string): any {
        const spl = key.split('.');

        const tempAttr: IUserAttrs = this.attrs;
        let result: number | string;
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < spl.length; i++) {
            const tempKey: string = spl[i];
            result = tempAttr[tempKey as userKeys];

            if (result === undefined || result === null) {
                return null;
            }
        }
        return result;
    }

    /**
     * Функция изменения полей в объекте модели
     * @param {object} attrs - объект, в котором храняться данные пользователя
     */
    update(attrs: IUserAttrs): void {
        this.attrs = Object.assign(this.attrs, attrs);
    }

    /**
     * Функция получения текущего пользователя с сервера
     * @returns {Promise}
     */
    static getCurrentUser(): Promise<ModelUser> {
        return new Promise((resolve) => {
            const url = RouterStore.api.user.current;
            let user: ModelUser;
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
