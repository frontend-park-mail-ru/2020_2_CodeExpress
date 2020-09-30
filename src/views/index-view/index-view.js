import { Page } from '../../components/page/page.js';
import { BaseView } from '../../managers/base-view/base-view.js';
import { DefaultSlider } from '../../components/default-slider/default-slider.js';
import { TrackList } from '../../components/track-list/track-list.js';
import { slides, tracks } from '../../store/consts.js';

/**
 * View отображающая главную страницу
 */
export class IndexView extends BaseView {
    constructor(props) {
        super(props);
        this.page = new Page(this.props);
        this.slider = new DefaultSlider({ slides, slideToShow: 3, slideToScroll: 1 });
        this.trackList = new TrackList({ tracks });

        this.template = Handlebars.templates['index.hbs'];
    }

    render() {
        const page = new Page(this.props);
        page.render();

        const parent = this.props.parent.querySelector('.layout__content_wrap');
        const slider = new DefaultSlider({ slides, slideToShow: 3, slideToScroll: 1 });
        const trackList = new TrackList({ tracks });

        parent.insertAdjacentHTML('afterbegin', this.template({ slider: slider.render(), tracks: trackList.render() }));

        const sliderWrap = parent.querySelector('.slider');
        slider.setEventListeners(sliderWrap);

        page.setEventListeners();
    }
}
