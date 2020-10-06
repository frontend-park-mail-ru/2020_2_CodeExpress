const baseBackendUrl = 'http://musicexpress.sarafa2n.ru:8080';

/**
 * Модуль для работы с сетью
 */
export class Request {
    /**
     * Функция, которая возвращает готовый url для запроса на сервер
     * @param  {string} url - api url
     * @returns {string}
     */
    static getBackendUrl(url) {
        return `${baseBackendUrl}${url}`;
    }

    /**
     * Функция, которая делает GET запрос на сервер
     * @param {string} url - api url
     * @returns {Promise<{body: *, status: *}>}
     */
    static get(url) {
        const requestUrl = this.getBackendUrl(url);

        return fetch(requestUrl, {
            method: 'GET',
            credentials: 'include',
            mode: 'cors',
            headers: {
            },
        }).then((response) => response.json().then((body) => ({ status: response.status, body })));
    }

    /**
     * Функция, которая делает POST запрос на сервер
     * @param {string} url - api url
     * @param {object} params - объект с доп параметрами
     * @returns {Promise<{body: *, status: *}>}
     */
    static post(url, params = {}) {
        const {
            payload: data,
            serialize = true,
        } = params;

        const requestUrl = this.getBackendUrl(url);

        return fetch(requestUrl, {
            method: 'POST',
            credentials: 'include',
            mode: 'cors',
            body: serialize ? JSON.stringify(data) : data,
        }).then((response) => response.json().then((body) => ({ status: response.status, body })));
    }
}
