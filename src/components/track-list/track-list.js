import { Component } from 'managers/component/component';

import TrackListTemplate from './track-list.hbs';

/**
 * Список песен
 */
export class TrackList extends Component {
    /**
     * Конструктор TrackLIst
     * @param {object} props - объект, в котором лежат переданные параметры
     */
    constructor(props) {
        super(props);

        this.template = TrackListTemplate;
    }

    /**
     * Отрисовка компонента
     * @returns {*|string}
     */
    render() {
        return this.template({ tracks: this.props.tracks });
    }
}
