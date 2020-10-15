import { Component } from 'managers/component/component';

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
