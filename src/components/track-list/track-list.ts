import { Component } from 'managers/component/component';
import { IState, ITrackList } from 'store/interfaces';

import TrackListTemplate from './track-list.hbs';
import './track.scss';

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
