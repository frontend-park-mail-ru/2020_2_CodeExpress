import { RouterStore } from 'store/routes';
import { baseStaticUrl, Request } from 'managers/request/request';
import { Model } from 'models/model';

interface IUserAttrs {
    id: number,
    username: string,
    email: string,
    avatar: string,
}

/**
 * Модель пользователя
 */
export class ModelUser extends Model<IUserAttrs> {
    /**
     * конструктор модели пользователя
     * @param {object} attrs - объект, в котором храняться данные пользователя
     * @param {boolean} isLoaded - флаг показывающий загружен ли пользователь
     */
    constructor(attrs: IUserAttrs = null, isLoaded = false) {
        super(attrs, isLoaded);
        const defaults: IUserAttrs = {
            id: null,
            username: null,
            email: null,
            avatar: null,
        };

        if (attrs) {
            attrs.avatar = attrs.avatar.replace('.', baseStaticUrl);
        }

        this.attrs = { ...defaults, ...attrs };
    }

    /**
     * Функция получения текущего пользователя с сервера
     * @returns {Promise}
     */
    static getCurrentUser(): Promise<ModelUser> {
        return new Promise((resolve) => {
            const url = RouterStore.api.user.current;
            let user: ModelUser = new ModelUser();

            Request.get(url).then((res) => {
                const { body, status } = res;
                if (status === 200) {
                    user = new ModelUser(body, true);
                }
                resolve(user);
            });
        });
    }
}
