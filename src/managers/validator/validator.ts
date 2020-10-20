/**
 * Функция валидатор данных пользоватея
 * @param {object} target - значение <input> из <form>
 * @param {RegExp} reg – регулярное выражение
 * @param {string} helpText - строка ошибки
 * @returns {{message: string, status: boolean}|{status: boolean}}
 */

export const userFormValidator = (target: HTMLInputElement, reg: RegExp, helpText: string): { status: boolean, message: string } => {
    const { value } = target;
    if (!value) {
        return { status: false, message: 'Заполните поле' };
    }

    const match = new RegExp(reg).test(value);

    if (!match) {
        return { status: false, message: `${helpText}` };
    }
    return { status: true, message: 'OK' };
};
