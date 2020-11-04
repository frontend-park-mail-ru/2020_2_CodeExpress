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

export interface ITrack {
    id: number,
    index: number,
    duration: string,
    album: string,
    audio: string,
    title: string,
    group: string
}

export interface ITrackList extends IProps {
    tracksList: ITrack[],
}

export interface IAlbum {
    title: string,
    group: string,
    albumPicture: string,
    tracksList: ITrack[],
}
