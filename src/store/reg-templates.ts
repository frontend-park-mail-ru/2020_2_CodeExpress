// Объект, в котором хранятся строки для RegExp
export const regTemplates = {
    url: /([^:]+):?(.+)?/,
    email: /^.+@.+\..+$/,
    username: /^[a-zA-Z0-9а-яА-Я_]{2,30}$/,
    password: /[a-zA-Z0-9_]{8,30}$/,
};
