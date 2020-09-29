// eslint-disable-next-line import/extensions
import Component from '../../managers/component/component.js';

export default class TrackList extends Component {
    init() {
        const template = Handlebars.templates['track-list.hbs'];
        return template({ tracks: this.props.tracks });
    }
}
