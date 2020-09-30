/**
 * Базовый класс для компонентов
 */
export class Component {
    constructor(props) {
        this.props = props;
        this.state = {};
    }

    setState(obj) {
        this.state = { ...this.state, ...obj };
    }
}
