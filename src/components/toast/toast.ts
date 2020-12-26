import { Component } from 'managers/component/component';
import { IProps, IState } from 'store/interfaces';

import ToastTemplate from './toast.hbs';
import './toast.scss';

export class Toast extends Component<IProps, IState> {
    constructor(props: IProps = null) {
        super(props);
        this.props.parent = document.querySelector('.toasts');

        window.addEventListener('scroll', () => {
            if (window.scrollY > 10) {
                this.props.parent.style.top = '50px';
            } else {
                this.props.parent.style.top = '100px';
            }
        });
    }

    close = (toast: HTMLElement, timer: NodeJS.Timeout) => {
        clearTimeout(timer);
        toast.style.transform = 'translateY(50px)';
        toast.style.opacity = '0';
    };

    add(text: string, type: boolean) {
        const typeClass = type ? 'toast_success' : 'toast_error';
        const toast: HTMLElement = document.createElement('div');

        toast.classList.add('toast');
        toast.style.opacity = '1';
        toast.classList.add(typeClass);
        toast.innerHTML = ToastTemplate({ text });
        this.props.parent.prepend(toast);

        const timer = setTimeout(() => {
            toast.style.transform = 'translateY(50px)';
            toast.style.opacity = '0';

            setTimeout(() => {
                toast.style.display = 'none';
            }, 1000);
        }, 2000);

        toast.querySelector('.toast__toggle').addEventListener('click', () => this.close(toast, timer), true);
    }
}
