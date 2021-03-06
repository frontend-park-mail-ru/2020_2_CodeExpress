import { Model } from 'models/model';
import { RouterStore } from 'store/routes';
import { baseStaticUrl, IRequestBody, Request } from 'managers/request/request';

import DefaultAlbum from '../assets/default/defaultAlbum.png';

export interface ITrack {
    id: number,
    title: string,
    index: string,
    duration: string,
    album_poster: string,
    album_id: number,
    artist_id: number,
    artist: string,
    audio: string,
    is_favorite: boolean,
    date?: Date,
    is_liked: boolean,
}

export class ModelTrack extends Model<ITrack> {
    constructor(attrs: ITrack = null, isLoaded = false, update = true) {
        super(attrs, isLoaded);
        const defaults: ITrack = {
            id: null,
            title: null,
            index: null,
            duration: null,
            album_poster: null,
            album_id: null,
            artist_id: null,
            artist: null,
            audio: null,
            is_favorite: false,
            is_liked: false,
        };

        if (attrs && update) {
            attrs.index = Number.parseInt(attrs.index, 10) >= 10 ? attrs.index : `0${attrs.index}`;
            const time = new Date(Number.parseInt(attrs.duration, 10) * 1000);
            const seconds = time.getSeconds() >= 10 ? time.getSeconds() : `0${time.getSeconds()}`;
            attrs.duration = `${time.getMinutes()}:${seconds}`;
            attrs.audio = attrs.audio.replace('.', baseStaticUrl);
            attrs.album_poster = attrs.album_poster.length > 0 ? attrs.album_poster.replace('.', baseStaticUrl) : DefaultAlbum;
        }

        this.attrs = Object.assign(defaults, attrs);
    }

    static fetchAddTrack(id: number, params: IRequestBody): Promise<any> {
        return new Promise((resolve) => {
            const url = RouterStore.api.track.add;

            Request.post(url, params).then((res) => {
                resolve(res);
            });
        });
    }

    static fetchIndexTrackList(count: number, from: number): Promise<ModelTrack[]> {
        return new Promise((resolve) => {
            let url = RouterStore.api.track.index.replace(':count', String(count));
            url = url.replace(':from', String(from));

            Request.get(url).then((res) => {
                const { body } = res;
                const tracks = body.map ? body.map((track: ITrack) => new ModelTrack(track, true)) : null;
                resolve(tracks);
            });
        });
    }

    static fetchIndexPopularTrackList(count: number, from: number): Promise<ModelTrack[]> {
        return new Promise((resolve) => {
            let url = RouterStore.api.track.popular.replace(':count', String(count));
            url = url.replace(':from', String(from));

            Request.get(url).then((res) => {
                const { body } = res;
                const tracks = body.map ? body.map((track: ITrack) => new ModelTrack(track, true)) : null;
                resolve(tracks);
            });
        });
    }

    static fetchArtistTracks(id: string): Promise<ModelTrack[]> {
        return new Promise((resolve) => {
            const url = RouterStore.api.track.artist.replace(':id', id);

            Request.get(url).then((res) => {
                const { body } = res;
                const tracks = body.map ? body.map((track: ITrack) => new ModelTrack(track)) : null;
                resolve(tracks);
            });
        });
    }

    static fetchRandomArtistTracks(id: string, count: number, from: number): Promise<ModelTrack[]> {
        return new Promise((resolve) => {
            const url = RouterStore.api.track.random.replace(':id', id)
                .replace(':from', String(from))
                .replace(':count', String(count));

            Request.get(url).then((res) => {
                const { body } = res;
                const tracks: ModelTrack[] = body.map ? body.map((track: ITrack) => new ModelTrack(track)) : [];
                resolve(tracks);
            });
        });
    }

    static fetchFavoriteTrackAdd(id: string): Promise<any> {
        return new Promise((resolve) => {
            const payload = { id };
            const url = RouterStore.api.track.favorite.add.replace(':id', id);
            Request.post(url, { payload, serialize: true }).then((res) => {
                resolve(res);
            });
        });
    }

    static fetchFavoriteTrackRemove(id: string) {
        return new Promise((resolve) => {
            const url = RouterStore.api.track.favorite.add.replace(':id', id);
            Request.delete(url).then((res) => {
                resolve(res);
            });
        });
    }

    static fetchFavoriteTrackList(): Promise<ModelTrack[]> {
        return new Promise((resolve) => {
            const url = RouterStore.api.track.favorite.list;

            Request.get(url).then((res) => {
                const { body } = res;
                const tracks = body.map ? body.map((track: ITrack) => new ModelTrack(track)) : null;
                resolve(tracks);
            });
        });
    }

    static fetchAllTrackList(): Promise<any> {
        return new Promise((resolve) => {
            const url = RouterStore.api.track.all;
            Request.get(url).then((res) => {
                const { body } = res;
                const tracks = body.map ? body.map((track: ITrack) => new ModelTrack(track)) : null;
                resolve(tracks);
            });
        });
    }

    static fetchUpdateTrack(id: string, params: IRequestBody): Promise<any> {
        return new Promise((resolve) => {
            const url = RouterStore.api.track.update.replace(':id', id);
            Request.put(url, params).then((res) => {
                resolve(res);
            });
        });
    }

    static fetchDeleteTrack(id: string): Promise<any> {
        return new Promise((resolve) => {
            const url = RouterStore.api.track.delete.replace(':id', id);
            Request.delete(url).then((res) => {
                resolve(res);
            });
        });
    }

    static fetchLikeTrack(id: string) :Promise<any> {
        return new Promise((resolve) => {
            const url = RouterStore.api.track.like.replace(':id', id);
            Request.post(url, { payload: {}, serialize: true }).then((res) => {
                resolve(res);
            });
        });
    }

    static fetchDislikeTrack(id: string) :Promise<any> {
        return new Promise((resolve) => {
            const url = RouterStore.api.track.like.replace(':id', id);
            Request.delete(url).then((res) => {
                resolve(res);
            });
        });
    }
}
