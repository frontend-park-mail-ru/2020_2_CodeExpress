import { Component } from 'managers/component/component';
import { IProps, IState } from 'store/interfaces';
import { ITrack } from 'models/track';

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
        return TrackListTemplate({ tracks: this.props.tracksList });
    }
}
