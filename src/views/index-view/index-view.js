import { Page } from '../../components/page/page.js';
import { BaseView } from '../../managers/base-view/base-view.js';
import { DefaultSlider } from '../../components/default-slider/default-slider.js';
import { TrackList } from '../../components/track-list/track-list.js';
import { slides, tracks } from '../../store/consts.js';

/**
 * View отображающая главную страницу
 */
export class IndexView extends BaseView {
    /**
     * Конструктор IndexView
     * @param {object} props - объект, в котором лежат переданные параметры
     * @param {object} storage - объект, который в котором лежат фукнции для работы с User
     */
    constructor(props, storage) {
        super(props, storage);
        this.page = new Page(this.props, this.storage);
        this.slider = new DefaultSlider({ slides, slideToShow: 3, slideToScroll: 1 });
        this.trackList = new TrackList({ tracks });

        this.template = Handlebars.templates['index.hbs'];
    }

    /**
     * Функция отрисовки View
     */
    render() {
        this.page.render();

        const parent = this.props.parent.querySelector('.layout__content_wrap');
        parent.insertAdjacentHTML('afterbegin', this.template({ slider: this.slider.render(), tracks: this.trackList.render() }));

        const sliderWrap = parent.querySelector('.slider');
        this.slider.setEventListeners(sliderWrap);

        this.page.setEventListeners();
        this.page.setEventToTracks();
    }
}
