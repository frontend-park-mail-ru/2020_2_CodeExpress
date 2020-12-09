import { Model } from 'models/model';
import { ITrack, ModelTrack } from 'models/track';
import { IAlbum, ModelAlbum } from 'models/album';
import { IArtist, ModelArtist } from 'models/artist';

import { RouterStore } from 'store/routes';
import { Request } from 'managers/request/request';

export interface ISearch {
    albums: ModelAlbum[],
    tracks: ModelTrack[],
    artists: ModelArtist[]
}

export class ModelSearch extends Model<ISearch> {
    constructor(attrs: ISearch = null, isLoaded = false) {
        super(attrs, isLoaded);

        const defaults: ISearch = {
            albums: null,
            tracks: null,
            artists: null,
        };

        this.attrs = Object.assign(defaults, attrs);
    }

    static fetchGet(query: string, offset: number, limit: number): Promise<ModelSearch> {
        return new Promise((resolve) => {
            let url = RouterStore.api.search.all.replace(':query', query);
            url = url.replace(':offset', String(offset));
            url = url.replace(':limit', String(limit));

            Request.get(url).then((res) => {
                const { body } = res;

                const albums: ModelAlbum[] = body.albums ? body.albums.map((album: IAlbum) => new ModelAlbum(album)) : null;
                const tracks: ModelTrack[] = body.tracks ? body.tracks.map((track: ITrack) => new ModelTrack(track)) : null;
                const artists: ModelArtist[] = body.artists ? body.artists.map((artist: IArtist) => new ModelArtist(artist)) : null;
                const search: ModelSearch = new ModelSearch({ albums, artists, tracks }, true);

                resolve(search);
            });
        });
    }
}
