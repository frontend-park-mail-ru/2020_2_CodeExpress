const baseBackendUrl = 'http://127.0.0.1:8080';

export class Request {
    static getBackendUrl(url) {
        return `${baseBackendUrl}${url}`;
    }

    static get(url) {
        const requestUrl = this.getBackendUrl(url);

        return fetch(requestUrl, {
            method: 'GET',
            credentials: 'include',
            mode: 'no-cors',
            headers: {
            },
        }).then((response) => response.json().then((body) => ({ status: response.status, body })));
    }

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
