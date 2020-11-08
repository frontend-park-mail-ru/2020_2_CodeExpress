import { Model } from 'models/model';
import { ITrack, ModelTrack } from 'models/track';

import { RouterStore } from 'store/routes';
import { baseStaticUrl, Request } from 'managers/request/request';

export interface IAlbum {
    id: number,
    title: string,
    artist_name: string,
    artist_id: number,
    poster: string,
    tracks: any
}

export class ModelAlbum extends Model<IAlbum> {
    constructor(attrs: IAlbum = null, isLoaded = false) {
        super(attrs, isLoaded);

        const defaults: IAlbum = {
            id: null,
            title: null,
            artist_id: null,
            artist_name: null,
            poster: null,
            tracks: null,
        };

        if (attrs) {
            attrs.poster = attrs.poster.replace('.', baseStaticUrl);
            attrs.tracks = attrs.tracks ? attrs.tracks.map((track: ITrack) => new ModelTrack(track, true)) : null;
        }

        this.attrs = Object.assign(defaults, attrs);
    }

    static fetchGetIndexAlbumArray(count: number, from: number) {
        return new Promise((resolve) => {
            let url = RouterStore.api.albums.indexList.replace(':count', String(count));
            url = url.replace(':from', String(from));
            Request.get(url).then((res) => {
                const { body } = res;
                const albums: IAlbum[] = body.map ? body.map((album: IAlbum) => new ModelAlbum(album)) : null;
                resolve(albums);
            });
        });
    }

    static fetchGetArtistArray(id: string): Promise<ModelAlbum[]> {
        return new Promise((resolve) => {
            const url = RouterStore.api.albums.artist.replace(':id', id);
            Request.get(url).then((res) => {
                const { body } = res;
                const albums: ModelAlbum[] = body.albums.map ? body.albums.map((album: IAlbum) => new ModelAlbum(album)) : null;
                resolve(albums);
            });
        });
    }

    static fetchGetCurrentAlbum(id: number) {
        return new Promise((resolve) => {
            const url = RouterStore.api.albums.current.replace(':id', String(id));
            let album: ModelAlbum = new ModelAlbum();
            Request.get(url).then((res) => {
                const { body, status } = res;
                if (status === 200) {
                    album = new ModelAlbum(body, true);
                }
                resolve(album);
            });
        });
    }
}
