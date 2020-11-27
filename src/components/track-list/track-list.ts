import { Component } from 'managers/component/component';
import { IProps, IState } from 'store/interfaces';
import { ITrack, ModelTrack } from 'models/track';
import { player } from 'components/player/player';
import { ModelPlayList } from 'models/playlist';
import { classContainsValidator } from 'managers/validator/validator';

import TrackListTemplate from './track-list.hbs';
import './track.scss';

interface ITrackList extends IProps {
    tracksList: ITrack[],
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
        return TrackListTemplate({ tracks: this.props.tracksList, playlists: this.storage.get('playlists') });
    }

    static addTrackInFavorite(target: HTMLElement) {
        ModelTrack.fetchFavoriteTrackAdd(target.dataset.id).then((res) => {
            const { body } = res;
            if (body.message === 'added') {
                target.classList.add('track-item__plus_active');
            } else if (body.message === 'deleted') {
                target.classList.remove('track-item__plus_active');
            }
        });
    }

    static addTrackInPlaylist = (event: Event) => {
        event.preventDefault();
        const { target } = event;
        const playlistId = (<HTMLElement>target).dataset.playlist;
        const trackId = (<HTMLElement>target).dataset.track;

        // TODO: Доделать с уведомлением
        ModelPlayList.fetchPostAddTrack(playlistId, { track_id: trackId }).then();
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
        const blackList: string[] = ['track-item__group', 'track-item__icon', 'track-item__dots-item', 'track-item__playlist-item'];

        tracks.forEach((item: HTMLElement) => {
            item.addEventListener('click', (e) => {
                const target = e.target as HTMLElement;

                if (target.classList.contains('fa-fire-alt')) {
                    TrackList.addTrackInFavorite(target);
                }
                if (target.classList.contains('fa-ellipsis-v')) {
                    TrackList.toggleEllipsis(target, item);
                }
                if (classContainsValidator(target, ...blackList)) {
                    player.changeSong(item);
                }
            });
        });
    }
}
