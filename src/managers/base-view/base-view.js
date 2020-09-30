import { Component } from '../component/component.js';

/**
 * Базовый класс для View
 */
export class BaseView extends Component {
    hide() {
        this.props.parent.innerHTML = '';
    }

    show() {
        this.render();
    }
}
