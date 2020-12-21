import { RouterStore } from 'store/routes';
import { baseStaticUrl, Request } from 'managers/request/request';
import { Model } from 'models/model';
import { ModelPlayList } from 'models/playlist';

import DefaultAvatar from 'assets/default/user-default.svg';

interface IUserAttrs {
    id: number,
    username: string,
    email?: string,
    avatar: string,
    is_subscribed?: boolean,
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
            is_subscribed: false,
        };

        if (attrs) {
            attrs.avatar = attrs.avatar ? attrs.avatar.replace('.', baseStaticUrl) : DefaultAvatar;
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

    static getProfile(nickname: string): Promise<ModelUser> {
        return new Promise((resolve, reject) => {
            const url = RouterStore.api.user.profile.replace(':nickname', nickname);

            Request.get(url).then((res) => {
                const { body, status } = res;
                if (status !== 200) {
                    reject(body);
                }

                const user = new ModelUser(body, true);
                resolve(user);
            });
        });
    }

    static getSubs(nickname: string): Promise<Array<ModelUser[]>> {
        return new Promise((resolve, reject) => {
            const url = RouterStore.api.user.getSubs.replace(':nickname', nickname);
            Request.get(url).then((res) => {
                const { body, status } = res;
                if (status !== 200) {
                    reject(body);
                }

                const subscribers = body.subscribers ? body.subscribers.map((item: IUserAttrs) => new ModelUser(item)) : [];
                const subscriptions = body.subscriptions ? body.subscriptions.map((item: IUserAttrs) => new ModelUser(item)) : [];

                resolve([subscribers, subscriptions]);
            });
        });
    }

    static follow(nickname: string) {
        return new Promise((resolve) => {
            const url = RouterStore.api.user.follow.replace(':nickname', nickname);

            Request.post(url, { payload: {} }).then((res) => {
                resolve(res.body);
            });
        });
    }

    static unFollow(nickname: string) {
        return new Promise((resolve) => {
            const url = RouterStore.api.user.follow.replace(':nickname', nickname);

            Request.delete(url).then((res) => {
                resolve(res.body);
            });
        });
    }

    static getProfileWithPlaylists(nickname: string) {
        return new Promise((resolve, reject) => {
            ModelUser.getProfile(nickname)
                .then((user) => {
                    ModelPlayList.fetchGetPublicPlaylists(user.attrs.id.toString()).then((playlists) => {
                        resolve({ user, playlists });
                    });
                })
                .catch(() => {
                    reject();
                });
        });
    }
}
