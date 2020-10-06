/**
 * Базовый класс для компонентов
 */
export class Component {
    /**
     * Абстрактный констркуктор
     * @param {object} props - объект, в котором лежат переданные параметры
     * @param {object} storage - объект, который в котором лежат фукнции для работы с User
     */
    constructor(props, storage) {
        this.props = props;
        this.state = {};
        this.storage = storage;
    }

    /**
     * Функция добавления состояний компоненту
     * @param {object} obj - переданный объект состояний
     */
    setState(obj) {
        this.state = { ...this.state, ...obj };
    }
}
