import { Model } from 'models/model';
import { ITrack } from 'store/interfaces';
import { RouterStore } from 'store/routes';
import { IRequestBody, Request } from 'managers/request/request';

export class ModelTrack extends Model<ITrack> {
    constructor(attrs: ITrack = null, isLoaded = false) {
        super(attrs, isLoaded);
        const defaults: ITrack = {
            id: null,
            index: null,
            title: null,
            group: null,
            duration: null,
            album: null,
            audio: null,
        };

        this.attrs = Object.assign(defaults, attrs);
    }

    static fetchFavoriteTrackList(): Promise<ITrack[]> {
        return new Promise((resolve) => {
            const url = RouterStore.api.track.favorite.list;
            Request.get(url).then((res) => {
                const { body } = res;
                const tracks = body.map((track: ITrack) => new ModelTrack(track));
                resolve(tracks);
            });
        });
    }

    static fetchFavoriteTrackAdd(id: string): Promise<any> {
        return new Promise((resolve) => {
            const payload = { id };
            const url = RouterStore.api.track.favorite.add;
            Request.post(url, { payload, serialize: true }).then((res) => {
                resolve(res);
            });
        });
    }

    static fetchAllTrackList(): Promise<any> {
        return new Promise((resolve) => {
            const url = RouterStore.api.track.all;
            Request.get(url).then((res) => {
                const { body } = res;
                const tracks = body.map((track: ITrack) => new ModelTrack(track));
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
