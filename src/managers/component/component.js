/**
 * Базовый класс для компонентов
 */
export class Component {
    constructor(props, storage) {
        this.props = props;
        this.state = {};
        this.storage = storage;
    }

    setState(obj) {
        this.state = { ...this.state, ...obj };
    }
}
