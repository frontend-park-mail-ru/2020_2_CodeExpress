export interface IProps {
    parent?: HTMLElement,
    arg?: string | number
}

export interface IState {
    [key: string]: any
}

export interface IStorage<TState> {
    get(key: keyof TState): any
    set(value: any): void
}
