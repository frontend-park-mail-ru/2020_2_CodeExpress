export interface IProps {
    parent?: HTMLElement,
    arg?: string
}

export interface IState {
    [key: string]: any
}

export interface IStorage<TState> {
    get(key: keyof TState): any
    set(value: any): void
}

export interface IModel {
    [key: string]: any
}
