import { Component } from 'managers/component/component';
import { IProps, IState } from 'store/interfaces';
import { ModelTrack } from 'models/track';
import { player, playerService, toast } from 'components/app/app';
import { ModelPlayList } from 'models/playlist';
import { classContainsValidator } from 'managers/validator/validator';
import { ModelUser } from 'models/user';

import TrackListTemplate from './track-list.hbs';
import './track.scss';

interface ITrackList extends IProps {
    tracksList: ModelTrack[],
    playlistsHidden?: boolean,
    orderShow?: boolean;
}
/**
 * Список песен
 */
export class TrackList extends Component<ITrackList, IState> {
    /**
     * Отрисовка компонента
     * @returns {*|string}
     */
    render() {
        const user: ModelUser = this.storage.get('user');
        const playlistsHidden = this.props.playlistsHidden || false;
        const orderShow = this.props.orderShow || false;
        const playlists: ModelPlayList[] = this.storage.get('playlists');

        if (this.props.tracksList) {
            this.props.tracksList = this.props.tracksList.map((item, index) => {
                const idx = index + 1;
                item.attrs.index = idx >= 10 ? `${idx}` : `0${idx}`;
                return item;
            });
        }

        return TrackListTemplate({
            tracks: this.props.tracksList,
            playlists,
            playlistsLen: playlists ? playlists.length : 0,
            user: user.isLoaded,
            playlistsHidden: !playlistsHidden,
            orderShow,
        });
    }

    static removeTrackInFavorite(target: HTMLElement) {
        ModelTrack.fetchFavoriteTrackRemove(target.dataset.id).then(() => {
            target.classList.remove('fa-plus');
            target.classList.add('fa-times');
            target.dataset.add = 'false';
            toast.add('Трек успено удален из избранного', true);
        });
    }

    static addTrackInFavorite(target: HTMLElement) {
        ModelTrack.fetchFavoriteTrackAdd(target.dataset.id).then(() => {
            target.classList.remove('fa-times');
            target.classList.add('fa-plus');
            target.dataset.add = 'true';
            toast.add('Трек успено добавлен в избранное', true);
        });
    }

    static addTrackInPlaylist = (event: Event) => {
        event.preventDefault();
        const { target } = event;
        const playlistId = (<HTMLElement>target).dataset.playlist;
        const trackId = (<HTMLElement>target).dataset.track;

        ModelPlayList.fetchPostAddTrack(playlistId, { track_id: Number(trackId) }).then(() => toast.add('Трек успено добавлен в плейлист', true));
    };

    static likeTrack = (target: HTMLElement) => {
        ModelTrack.fetchLikeTrack(target.dataset.track).then(() => {
            target.dataset.like = 'true';
            const icon = target.querySelector('.like-icon');
            icon.parentElement.classList.add('track-item__icon_active');
            icon.classList.remove('far');
            icon.classList.add('fas');
        });
    };

    static dislikeTrack = (target: HTMLElement) => {
        ModelTrack.fetchDislikeTrack(target.dataset.track).then(() => {
            target.dataset.like = 'false';
            const icon = target.querySelector('.like-icon');
            icon.parentElement.classList.remove('track-item__icon_active');
            icon.classList.remove('fas');
            icon.classList.add('far');
        });
    };

    static hideModalWindow(target: HTMLElement, wrapper: HTMLElement) {
        wrapper.classList.remove('track-item__dots-wrapper_active');
        target.dataset.disabled = 'true';
    }

    static showModalWindow(target: HTMLElement, wrapper: HTMLElement) {
        wrapper.classList.add('track-item__dots-wrapper_active');
        target.dataset.disabled = 'false';

        document.addEventListener('keydown', (event) => {
            if (event.code !== 'Escape') {
                return;
            }
            TrackList.hideModalWindow(target, wrapper);
        }, true);
        document.addEventListener('click', (event) => {
            if (classContainsValidator(<HTMLElement>event.target, 'track-item__dots-item')) {
                TrackList.hideModalWindow(target, wrapper);
            }
        }, true);
        wrapper.querySelectorAll('.track-item__playlist-item').forEach((item) => {
            item.addEventListener('click', this.addTrackInPlaylist);
        });
    }

    static toggleEllipsis = (target: HTMLElement, item: HTMLElement) => {
        const wrapper: HTMLElement = item.querySelector('.track-item__dots-wrapper');
        const isDisabled = target.dataset.disabled;

        if (isDisabled === 'true') {
            TrackList.showModalWindow(target, wrapper);
        } else {
            TrackList.hideModalWindow(target, wrapper);
        }
    };

    static setEventToTracks(tracks: NodeList): void {
        const blackList: string[] = ['track-item__group', 'track-item__icon', 'track-item__dots-item', 'track-item__playlist-item', 'like-icon'];

        tracks.forEach((item: HTMLElement) => {
            item.addEventListener('click', (e) => {
                const target = e.target as HTMLElement;

                if (target.classList.contains('add-favorite')) {
                    if (target.dataset.add === 'false') {
                        TrackList.addTrackInFavorite(target);
                    } else {
                        TrackList.removeTrackInFavorite(target);
                    }
                }
                if (target.classList.contains('add-order')) {
                    playerService.addInOrder(item);
                }
                if (target.classList.contains('fa-ellipsis-v')) {
                    TrackList.toggleEllipsis(target, item);
                }
                if (classContainsValidator(target, ...blackList)) {
                    player.changeCurrentTrack(item);
                }
                if (target.classList.contains('like')) {
                    if (target.dataset.like === 'false') {
                        TrackList.likeTrack(target);
                    } else {
                        TrackList.dislikeTrack(target);
                    }
                }
                if (target.classList.contains('like-icon')) {
                    if (target.parentElement.dataset.like === 'false') {
                        TrackList.likeTrack(target.parentElement);
                    } else {
                        TrackList.dislikeTrack(target.parentElement);
                    }
                }
            });
        });
    }
}
