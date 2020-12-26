import { View } from 'managers/base-view/base-view';
import { IProps, IState } from 'store/interfaces';

import { router } from 'managers/router/router';
import { playerService } from 'components/app/app';
import { RouterStore } from 'store/routes';
import { Request } from 'managers/request/request';

import AdminTemplate from './admin-view.hbs';
import './admin-view.scss';

export class AdminView extends View<IProps, IState> {
    createTrack = (event: Event) => {
        event.preventDefault();

        const target = event.target as HTMLElement;
        const title: HTMLInputElement = target.querySelector('[name="title"]');
        const id: HTMLInputElement = target.querySelector('[name="album_id"]');
        const payload = {
            title: title.value,
            album_id: Number(id.value),
        };

        Request.post(RouterStore.api.admin.track.create, { payload, serialize: true }).then((res) => {
            this.props.parent.querySelector('.response-create-track').innerHTML = JSON.stringify(res.body);
        });
    };

    addAudioTrack = (event: Event) => {
        event.preventDefault();

        const target = event.target as HTMLElement;
        const file: File = (<HTMLInputElement>target.querySelector('[name="audio"]')).files[0];
        const id: HTMLInputElement = target.querySelector('[name="id"]');
        const url = RouterStore.api.admin.track.audio.replace(':id', id.value);

        const payload = new FormData();
        payload.append('audio', file);

        Request.post(url, { payload, serialize: false }).then((res) => {
            this.props.parent.querySelector('.response-add-audio').innerHTML = JSON.stringify(res.body);
        });
    };

    changeTrack = (event: Event) => {
        event.preventDefault();

        const target = event.target as HTMLElement;
        const id: HTMLInputElement = target.querySelector('[name="id"]');
        const title: HTMLInputElement = target.querySelector('[name="title"]');
        const albumId: HTMLInputElement = target.querySelector('[name="album_id"]');
        const index: HTMLInputElement = target.querySelector('[name="index"]');
        const url = RouterStore.api.admin.track.change.replace(':id', id.value);

        const payload = {
            title: title.value,
            album_id: Number(albumId.value),
            index: Number(index.value),
        };

        Request.put(url, { payload, serialize: true }).then((res) => {
            this.props.parent.querySelector('.response-change-track').innerHTML = JSON.stringify(res.body);
        });
    };

    deleteTrack = (event: Event) => {
        event.preventDefault();

        const target = event.target as HTMLElement;
        const id: HTMLInputElement = target.querySelector('[name="id"]');
        const url = RouterStore.api.admin.track.delete.replace(':id', id.value);

        Request.delete(url).then((res) => {
            this.props.parent.querySelector('.response-delete-track').innerHTML = JSON.stringify(res.body);
        });
    };

    createAlbum = (event: Event) => {
        event.preventDefault();

        const target = event.target as HTMLElement;
        const title: HTMLInputElement = target.querySelector('[name="title"]');
        const id: HTMLInputElement = target.querySelector('[name="artist_id"]');
        const payload = {
            title: title.value,
            artist_id: Number(id.value),
        };

        Request.post(RouterStore.api.admin.album.create, { payload, serialize: true }).then((res) => {
            this.props.parent.querySelector('.response-create-album').innerHTML = JSON.stringify(res.body);
        });
    };

    photoAlbum = (event: Event) => {
        event.preventDefault();

        const target = event.target as HTMLElement;
        const file: File = (<HTMLInputElement>target.querySelector('[name="poster"]')).files[0];
        const id: HTMLInputElement = target.querySelector('[name="id"]');
        const url = RouterStore.api.admin.album.poster.replace(':id', id.value);

        const payload = new FormData();
        payload.append('poster', file);

        Request.post(url, { payload, serialize: false }).then((res) => {
            this.props.parent.querySelector('.response-add-poster-album').innerHTML = JSON.stringify(res.body);
        });
    };

    changeAlbum = (event: Event) => {
        event.preventDefault();

        const target = event.target as HTMLElement;
        const id: HTMLInputElement = target.querySelector('[name="id"]');
        const title: HTMLInputElement = target.querySelector('[name="title"]');
        const artistId: HTMLInputElement = target.querySelector('[name="artist_id"]');
        const url = RouterStore.api.admin.album.change.replace(':id', id.value);
        const payload = {
            title: title.value,
            artist_id: Number(artistId.value),
        };

        Request.put(url, { payload, serialize: true }).then((res) => {
            this.props.parent.querySelector('.response-change-album').innerHTML = JSON.stringify(res.body);
        });
    };

    deleteAlbum = (event: Event) => {
        event.preventDefault();

        const target = event.target as HTMLElement;
        const id: HTMLInputElement = target.querySelector('[name="id"]');
        const url = RouterStore.api.admin.album.delete.replace(':id', id.value);

        Request.delete(url).then((res) => {
            this.props.parent.querySelector('.response-delete-album').innerHTML = JSON.stringify(res.body);
        });
    };

    createArtist = (event: Event) => {
        event.preventDefault();

        const target = event.target as HTMLElement;
        const name: HTMLInputElement = target.querySelector('[name="name"]');
        const description: HTMLInputElement = target.querySelector('[name="description"]');

        const payload = {
            name: name.value,
            description: description.value,
        };

        Request.post(RouterStore.api.admin.artist.create, { payload, serialize: true }).then((res) => {
            this.props.parent.querySelector('.response-create-artist').innerHTML = JSON.stringify(res.body);
        });
    };

    changeArtist = (event: Event) => {
        event.preventDefault();

        const target = event.target as HTMLElement;
        const name: HTMLInputElement = target.querySelector('[name="name"]');
        const id: HTMLInputElement = target.querySelector('[name="id"]');
        const description: HTMLInputElement = target.querySelector('[name="description"]');
        const url = RouterStore.api.admin.artist.change.replace(':id', id.value);

        const payload = {
            name: name.value,
            description: description.value,
        };

        Request.put(url, { payload, serialize: true }).then((res) => {
            this.props.parent.querySelector('.response-change-artist').innerHTML = JSON.stringify(res.body);
        });
    };

    deleteArtist = (event: Event) => {
        event.preventDefault();

        const target = event.target as HTMLElement;
        const id: HTMLInputElement = target.querySelector('[name="id"]');
        const url = RouterStore.api.admin.artist.delete.replace('id', id.value);

        Request.delete(url).then((res) => {
            this.props.parent.querySelector('.response-delete-artist').innerHTML = JSON.stringify(res.body);
        });
    };

    filesArtist = (event: Event) => {
        event.preventDefault();

        const target = event.target as HTMLElement;
        const poster: File = (<HTMLInputElement>target.querySelector('[name="poster"]')).files[0];
        const avatar: File = (<HTMLInputElement>target.querySelector('[name="avatar"]')).files[0];
        const id: HTMLInputElement = target.querySelector('[name="id"]');
        const url = RouterStore.api.admin.artist.files.replace(':id', id.value);

        const payload = new FormData();
        payload.append('poster', poster);
        payload.append('poster', avatar);

        Request.post(url, { payload, serialize: false }).then((res) => {
            this.props.parent.querySelector('.response-files-artist').innerHTML = JSON.stringify(res.body);
        });
    };

    render() {
        const pageState = this.storage.get('pageState');
        if (pageState) {
            playerService.pause();
        }

        this.storage.set({ pageState: false });

        const user = this.storage.get('user');

        if (!user.isLoaded) {
            router.go(RouterStore.website.index);
            return;
        }

        this.props.parent.innerHTML = AdminTemplate();

        this.props.parent.querySelector('.form-create-track').addEventListener('submit', this.createTrack);
        this.props.parent.querySelector('.form-add-audio').addEventListener('submit', this.addAudioTrack);
        this.props.parent.querySelector('.form-change-track').addEventListener('submit', this.changeTrack);
        this.props.parent.querySelector('.form-delete-track').addEventListener('submit', this.deleteTrack);

        this.props.parent.querySelector('.form-create-album').addEventListener('submit', this.createAlbum);
        this.props.parent.querySelector('.form-add-poster-album').addEventListener('submit', this.photoAlbum);
        this.props.parent.querySelector('.form-change-album').addEventListener('submit', this.changeAlbum);
        this.props.parent.querySelector('.form-delete-album').addEventListener('submit', this.deleteAlbum);

        this.props.parent.querySelector('.form-create-artist').addEventListener('submit', this.createArtist);
        this.props.parent.querySelector('.form-change-artist').addEventListener('submit', this.changeArtist);
        this.props.parent.querySelector('.form-delete-artist').addEventListener('submit', this.deleteArtist);
        this.props.parent.querySelector('.form-files-artist').addEventListener('submit', this.filesArtist);
    }
}
