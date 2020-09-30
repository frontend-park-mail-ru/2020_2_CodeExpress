import { Component } from '../../managers/component/component.js';

export class TrackList extends Component {
    constructor(props) {
        super(props);

        this.template = Handlebars.templates['track-list.hbs'];
    }

    render() {
        return this.template({ tracks: this.props.tracks });
    }
}
