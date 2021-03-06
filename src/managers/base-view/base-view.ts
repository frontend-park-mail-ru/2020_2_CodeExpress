import { Component } from 'managers/component/component';
import { IState, IProps } from 'store/interfaces';

/**
 * Базовый класс для View
 */
export abstract class View<TProps extends IProps = IProps, TState extends IState = IState> extends Component<TProps, TState> {
    hide(): void {
        this.unMount();
        this.props.parent.innerHTML = '';
    }

    show(arg: string): void {
        window.scrollTo(0, 0);
        this.props.arg = arg;
        this.didMount();
        this.render();
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    unMount(): void {}

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    didMount(): void {}

    abstract render(): void;
}
