import { Model } from 'models/model';
import { baseStaticUrl, IPayload, Request } from 'managers/request/request';
import { RouterStore } from 'store/routes';
import { ModelTrack } from 'models/track';

const defaultPlaylist = require('../assets/default/playlist.png');

interface IPlaylist {
    id: number,
    user_id: number,
    title: string,
    poster: string,
    tracks?: ModelTrack[],
}

export class ModelPlayList extends Model<IPlaylist> {
    constructor(attrs: IPlaylist = null, isLoaded = false) {
        super(attrs, isLoaded);

        const defaults: IPlaylist = {
            id: null,
            user_id: null,
            title: null,
            poster: null,
        };

        if (attrs) {
            attrs.poster = attrs.poster ? attrs.poster.replace('.', baseStaticUrl) : defaultPlaylist.default;
        }

        this.attrs = Object.assign(defaults, attrs);
    }

    static fetchGetPlaylists(): Promise<ModelPlayList[]> {
        return new Promise((resolve) => {
            Request.get(RouterStore.api.playlists.list).then((res) => {
                const { body } = res;
                const playlists = body.map ? body.map((item: IPlaylist) => new ModelPlayList(item)) : null;
                resolve(playlists);
            });
        });
    }

    static fetchGetCurrentPlaylist(url: string): Promise<ModelPlayList> {
        return new Promise((resolve) => {
            const regUrl = RouterStore.api.playlists.current.replace(':id', url);
            let playlist: ModelPlayList = new ModelPlayList();
            Request.get(regUrl).then((res) => {
                const { body, status } = res;

                if (status === 200) {
                    playlist = new ModelPlayList(body, true);
                }
                resolve(playlist);
            });
        });
    }

    static fetchPostCreatePlaylist(title: string): Promise<ModelPlayList> {
        return new Promise((resolve) => {
            const payload = { title };
            Request.post(RouterStore.api.playlists.create, { payload, serialize: false }).then((res) => {
                const { body } = res;
                const playlist: ModelPlayList = new ModelPlayList(body);

                resolve(playlist);
            });
        });
    }

    static fetchPostAddTrack(id: string, payload: IPayload) {
        return new Promise((resolve) => {
            const regUrl = RouterStore.api.playlists.add.replace(':id', id);
            Request.post(regUrl, { payload, serialize: true }).then((res) => {
                resolve(res);
            });
        });
    }

    static fetchDeletePlaylist(id: string) {
        return new Promise((resolve) => {
            const regUrl = RouterStore.api.playlists.delete.replace(':id', id);
            Request.delete(regUrl).then((res) => {
                resolve(res);
            });
        });
    }

    static fetchPutPlaylist(id: string, payload: FormData) {
        return new Promise((resolve) => {
            const regUrl = RouterStore.api.playlists.update.replace(':id', id);
            Request.put(regUrl, { payload, serialize: false }).then((res) => {
                const playlist = new ModelPlayList(res.body);
                resolve(playlist);
            });
        });
    }
}
