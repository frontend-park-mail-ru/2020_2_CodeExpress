import { IProps, IState, IStorage } from 'store/interfaces';

/**
 * Базовый класс для компонентов
 */
export abstract class Component<TProps = IProps, TState extends IState = IState, TStorage extends IStorage<TState> = IStorage<TState>> {
    protected props: TProps;

    protected state: TState;

    protected storage: TStorage ;

    /**
     * Абстрактный констркуктор
     * @param {object} props - объект, в котором лежат переданные параметры
     * @param {object} storage - объект, который в котором лежат фукнции для работы с User
     */
    protected constructor(props: TProps, storage: TStorage = null) {
        this.storage = storage;
        this.props = { ...props };
    }

    /**
     * Функция добавления состояний компоненту
     * @param partialState
     */
    setState(partialState: Partial<TState>): void {
        this.state = { ...this.state, ...partialState };
    }
}
