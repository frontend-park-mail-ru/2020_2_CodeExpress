// eslint-disable-next-line import/extensions
import Page from '../../components/page/page.js';
// eslint-disable-next-line import/extensions
import BaseView from '../../managers/base-view/base-view.js';
// eslint-disable-next-line import/extensions
import DefaultSlider from '../../components/default-slider/default-slider.js';
// eslint-disable-next-line import/extensions
import TrackList from '../../components/track-list/track-list.js';

// eslint-disable-next-line import/extensions,import/named
import { slides, tracks } from '../../store/consts.js';

export default class IndexView extends BaseView {
    render() {
        const template = Handlebars.templates['index.hbs'];
        const page = new Page(this.props);
        page.init();

        const parent = this.props.parent.querySelector('.layout__content_wrap');
        const slider = new DefaultSlider({ slides, slideToShow: 3, slideToScroll: 1 });
        const trackList = new TrackList({ tracks });

        parent.insertAdjacentHTML('afterbegin', template({ slider: slider.init(), tracks: trackList.init() }));

        const sliderWrap = parent.querySelector('.slider');
        slider.getElements(sliderWrap);
        slider.setEvents();

        page.setEvents();
    }
}
