import { Model } from 'models/model';
import { ITrack, ModelTrack } from 'models/track';

import { RouterStore } from 'store/routes';
import { baseStaticUrl, Request } from 'managers/request/request';
import { ModelArtist } from 'models/artist';

import DefaultAlbum from '../assets/default/defaultAlbum.png';

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
            attrs.poster = attrs.poster.length > 0 ? attrs.poster.replace('.', baseStaticUrl) : DefaultAlbum;
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

    static fetchGetTopAlbums(count: number, from: number) {
        return new Promise((resolve) => {
            const url = RouterStore.api.albums.top
                .replace(':from', String(from))
                .replace(':count', String(count));

            Request.get(url).then((res) => {
                const { body } = res;
                const albums: ModelAlbum[] = body.map ? body.map((album: IAlbum) => new ModelAlbum(album)) : [];
                const artists: any[] = [];
                const result: any[] = [];

                albums.forEach((item: any) => artists.push(String(item.attrs.artist_id)));

                const promises = artists.map((item: any) => ModelArtist.fetchCurrentArtist(item)
                    .then((artist: ModelArtist) => artists.push(artist)));

                Promise.all(promises).then(() => {
                    artists.splice(0, 3);

                    albums.forEach((item) => {
                        const artist = artists.find((t) => t.attrs.id === item.attrs.artist_id);
                        const temp = {
                            poster: artist.attrs.poster,
                            avatar: item.attrs.poster,
                            title: item.attrs.title,
                            artist: item.attrs.artist_name,
                            artist_id: item.attrs.artist_id,
                            id: item.attrs.id,
                        };

                        result.push(temp);
                    });
                    resolve(result);
                });
            });
        });
    }
}
