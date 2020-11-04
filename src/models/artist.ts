import { Model } from 'models/model';
import { Request } from 'managers/request/request';
import { IAlbum, ITrack } from 'store/interfaces';
import { RouterStore } from 'store/routes';

interface IArtist {
    name: string,
    poster: string,
    banner: string,
    text: string,
    trackArray: ITrack[],
    albumArray: IAlbum[]
}

export class ModelArtist extends Model<IArtist> {
    constructor(attrs: IArtist = null, isLoaded = false) {
        super(attrs, isLoaded);

        const defaults: IArtist = {
            name: null,
            poster: null,
            banner: null,
            text: null,
            trackArray: null,
            albumArray: null,
        };

        this.attrs = Object.assign(defaults, attrs);
    }

    static fetchArtistArray(): Promise<IArtist[]> {
        return new Promise((resolve) => {
            const url = RouterStore.api.artist.list;
            Request.get(url).then((res) => {
                const { body } = res;
                const artists: IArtist[] = body.map((artist: IArtist) => new ModelArtist(artist));
                resolve(artists);
            });
        });
    }

    static fetchCurrentArtist(slug: string) {
        return new Promise((resolve) => {
            const url = RouterStore.api.artist.current.replace(':slug', slug);
            const artist: ModelArtist = new ModelArtist();
            Request.get(url).then((res) => {
                const { body, status } = res;
                if (status === 200) {
                    artist.attrs.name = body.name;
                    artist.attrs.text = body.text;
                    artist.attrs.poster = body.poster;
                    artist.attrs.banner = body.banner;
                    artist.attrs.trackArray = body.tracks;
                    artist.attrs.albumArray = body.albums;
                }
                resolve(artist);
            });
        });
    }
}
