import { Component } from '../component/component.js';

export class BaseView extends Component {
    hide() {
        this.props.parent.innerHTML = '';
    }

    show() {
        this.render();
    }
}
