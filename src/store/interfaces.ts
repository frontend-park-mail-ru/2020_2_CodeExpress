export interface IProps {
    parent?: HTMLElement
}

export interface IState {
    [key: string]: any
}

export interface IStorage<TState> {
    get(key: keyof TState): any
    set(value: any): void
}
