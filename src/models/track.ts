import { Model } from 'models/model';
import { RouterStore } from 'store/routes';
import { baseStaticUrl, IRequestBody, Request } from 'managers/request/request';

export interface ITrack {
    id: number,
    title: string,
    index: string,
    duration: string,
    album_poster: string,
    album_id: number,
    artist_id: number,
    artist: string,
    audio: string
}

export class ModelTrack extends Model<ITrack> {
    constructor(attrs: ITrack = null, isLoaded = false) {
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
        };

        if (attrs) {
            attrs.index = Number.parseInt(attrs.index, 10) > 10 ? attrs.index : `0${attrs.index}`;
            const time = new Date(Number.parseInt(attrs.duration, 10) * 1000);
            const seconds = time.getSeconds() > 10 ? time.getSeconds() : `0${time.getSeconds()}`;
            attrs.duration = `${time.getMinutes()}:${seconds}`;
            attrs.audio = attrs.audio.replace('.', baseStaticUrl);
            attrs.album_poster = attrs.album_poster.replace('.', baseStaticUrl);
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

    static fetchIndexTrackList(count: number, from: number): Promise<ITrack[]> {
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

    static fetchArtistTracks(id: string): Promise<ITrack[]> {
        return new Promise((resolve) => {
            const url = RouterStore.api.track.artist.replace(':id', id);

            Request.get(url).then((res) => {
                const { body } = res;
                const tracks = body.map ? body.map((track: ITrack) => new ModelTrack(track)) : null;
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

    static fetchFavoriteTrackList(): Promise<ITrack[]> {
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
}
