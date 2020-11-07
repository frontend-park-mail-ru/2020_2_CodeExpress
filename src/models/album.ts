import { Model } from 'models/model';
import { RouterStore } from 'store/routes';
import { Request } from 'managers/request/request';

interface IAlbum {
    id: number,
    title: string,
    artist: string,
    poster: string,
}

export class ModelAlbum extends Model<IAlbum> {
    constructor(attrs: IAlbum = null, isLoaded = false) {
        super(attrs, isLoaded);

        const defaults: IAlbum = {
            id: null,
            title: null,
            artist: null,
            poster: null,
        };

        this.attrs = Object.assign(defaults, attrs);
    }

    static fetchGetIndexAlbumArray() {
        return new Promise((resolve) => {
            const url = RouterStore.api.albums.indexList;
            Request.get(url).then((res) => {
                const { body } = res;
                const albums: IAlbum[] = body.map((album: IAlbum) => new ModelAlbum(album));
                resolve(albums);
            });
        });
    }

    static fetchGetArtistArray(id: number) {
        return new Promise((resolve) => {
            const url = RouterStore.api.albums.artist.replace(':id', String(id));
            Request.get(url).then((res) => {
                const { body } = res;
                const albums: IAlbum[] = body.map((album: IAlbum) => new ModelAlbum(album));
                resolve(albums);
            });
        });
    }

    static fetchGetCurrentAlbum(id: number) {
        return new Promise((resolve) => {
            const url = RouterStore.api.albums.current.replace(':id', String(id));
            const album: ModelAlbum = new ModelAlbum();
            Request.get(url).then((res) => {
                const { body, status } = res;
                if (status === 200) {
                    album.attrs.id = body.id;
                    album.attrs.title = body.title;
                    album.attrs.poster = body.poster;
                    album.attrs.artist = body.artist;
                    album.isLoaded = true;
                }
                resolve(album);
            });
        });
    }
}
