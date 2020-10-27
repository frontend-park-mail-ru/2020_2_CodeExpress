import { Component } from 'managers/component/component';
import { IProps, IState } from 'store/interfaces';

import TrackListTemplate from './track-list.hbs';
import './track.scss';

export interface ITrack {
    index: number,
    duration: string,
    album: string,
    audio: string,
    title: string,
    group: string
}

export interface ITrackList extends IProps {
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
        return TrackListTemplate({ tracks: this.props.tracksList });
    }
}
