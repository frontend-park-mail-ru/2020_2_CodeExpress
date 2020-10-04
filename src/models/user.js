import { RouterStore } from '../store/routes.js';
import { Request } from '../managers/request/request.js';

export class ModelUser {
    constructor(attrs = null, isLoaded = false) {
        const defaults = {
            id: null,
            username: null,
            email: null,
        };

        this.attrs = { ...defaults, ...attrs };
        this.isLoaded = isLoaded;
    }

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

    update(attrs) {
        this.attrs = Object.assign(this.attrs, attrs);
    }

    static getCurrentUser() {
        return new Promise((resolve) => {
            const url = RouterStore.api.user.current;
            let user;
            Request.get(url).then((res) => {
                const { body, status } = res;
                if (status === 200) {
                    user = new ModelUser(body.data.user, true);
                } else {
                    user = new ModelUser();
                }
                resolve(user);
            });
        });
    }
}
