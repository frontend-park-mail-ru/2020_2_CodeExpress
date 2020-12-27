import { Model } from 'models/model';
import { baseStaticUrl, Request } from 'managers/request/request';
import { RouterStore } from 'store/routes';

import imagineDragons from '../assets/backgrounds/imagine_dragons.jpg';
import DefaultAvatar from '../assets/default/user-default.png';

export interface IArtist {
    id: number,
    name: string,
    poster: string,
    avatar: string,
    description: string
}

export class ModelArtist extends Model<IArtist> {
    constructor(attrs: IArtist = null, isLoaded = false) {
        super(attrs, isLoaded);

        const defaults: IArtist = {
            id: null,
            name: null,
            poster: null,
            avatar: null,
            description: null,
        };

        if (attrs) {
            attrs.poster = attrs.poster.replace('.', baseStaticUrl);
            attrs.avatar = attrs.avatar.length > 0 ? attrs.avatar.replace('.', baseStaticUrl) : DefaultAvatar;
        }

        this.attrs = Object.assign(defaults, attrs);
    }

    static fetchArtistArray(): Promise<IArtist[]> {
        return new Promise((resolve) => {
            const url = RouterStore.api.artist.list;
            Request.get(url).then((res) => {
                const { body } = res;
                const artists: IArtist[] = body.map ? body.map((artist: IArtist) => new ModelArtist(artist)) : null;
                resolve(artists);
            });
        });
    }

    static fetchCurrentArtist(slug: string) {
        return new Promise((resolve) => {
            const url = RouterStore.api.artist.current.replace(':slug', slug);
            let artist: ModelArtist = new ModelArtist();
            Request.get(url).then((res) => {
                const { body, status } = res;
                if (status === 200) {
                    artist = new ModelArtist(body, true);
                }
                resolve(artist);
            });
        });
    }

    static fetchGetArtistDayMock(id: number) {
        return new Promise((resolve) => {
            const res = {
                title: 'IMAGINE DRAGONS',
                poster: imagineDragons,
                id: 1,
            };
            resolve(res);
        });
    }
}
