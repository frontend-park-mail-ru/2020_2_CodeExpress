const baseBackendUrl = 'https://musicexpress.sarafa2n.ru:8080';
export const baseStaticUrl = 'https://musicexpress.sarafa2n.ru:8080';

export interface IPayload {
    [key: string] : any
}

export interface IRequestBody {
    payload: IPayload,
    serialize?: boolean,
}

/**
 * Модуль для работы с сетью
 */
export class Request {
    /**
     * Функция, которая возвращает готовый url для запроса на сервер
     * @param  {string} url - api url
     * @returns {string}
     */

    static setCsrfToken(token: string): void {
        localStorage.setItem('token', token);
    }

    static getCsrfToken(): string | null {
        return localStorage.getItem('token');
    }

    static getBackendUrl(url: string): string {
        return `${baseBackendUrl}${url}`;
    }

    static delete(url: string): Promise<any> {
        const requestUrl = this.getBackendUrl(url);

        return fetch(requestUrl, {
            method: 'DELETE',
            credentials: 'include',
            mode: 'cors',
            headers: {
                'X-Csrf-Token': this.getCsrfToken(),
            },
        }).then((response) => response.json().then((body) => ({ status: response.status, body })));
    }

    /**
     * Функция, которая делает GET запрос на сервер
     * @param {string} url - api url
     * @returns {Promise<{body: *, status: *}>}
     */
    static get(url: string): Promise<any> {
        const requestUrl = this.getBackendUrl(url);

        return fetch(requestUrl, {
            method: 'GET',
            credentials: 'include',
            mode: 'cors',
        }).then((response) => response.json().then((body) => ({ status: response.status, body })));
    }

    /**
     * Функция, которая делает POST запрос на сервер
     * @param {string} url - api url
     * @param {object} params - объект с доп параметрами
     * @returns {Promise<{body: *, status: *}>}
     */
    static post(url: string, params?: IRequestBody): Promise<any> {
        const {
            payload: data,
            serialize = true,
        } = params;

        const requestUrl = this.getBackendUrl(url);
        const headers = serialize ? { 'Content-Type': 'application/json;charset=utf-8' } : null;
        return fetch(requestUrl, {
            method: 'POST',
            credentials: 'include',
            mode: 'cors',
            headers: {
                ...headers,
                'X-Csrf-Token': this.getCsrfToken(),
            },
            body: serialize ? JSON.stringify(data) : data as FormData,
        }).then((response) => {
            if (response.headers.get('X-Csrf-Token')) {
                this.setCsrfToken(response.headers.get('X-Csrf-Token'));
            }
            return response.json().then((body) => ({ status: response.status, body }));
        });
    }

    static put(url: string, params: IRequestBody): Promise<any> {
        const {
            payload: data,
            serialize = true,
        } = params;
        const requestUrl = this.getBackendUrl(url);
        const headers = serialize ? { 'Content-Type': 'application/json;charset=utf-8' } : null;
        return fetch(requestUrl, {
            method: 'PUT',
            credentials: 'include',
            mode: 'cors',
            headers: {
                ...headers,
                'X-Csrf-Token': this.getCsrfToken(),
            },
            body: serialize ? JSON.stringify(data) : data as FormData,
        }).then((response) => response.json().then((body) => ({ status: response.status, body })));
    }
}
