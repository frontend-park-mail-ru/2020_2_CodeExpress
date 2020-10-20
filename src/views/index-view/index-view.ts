import { Page } from 'components/page/page';
import { View } from 'managers/base-view/base-view';
import { DefaultSlider } from 'components/default-slider/default-slider';
import { TrackList } from 'components/track-list/track-list';
import { slidesTemp, tracksList } from 'store/consts';
import { IProps, IState, IStorage } from 'store/interfaces';

import IndexTemplate from './index.hbs';
import './index.css';
import './album-list.css';

/**
 * View отображающая главную страницу
 */
export class IndexView extends View {
    private page: Page;

    private slider: DefaultSlider;

    private trackList: TrackList;

    /**
     * Конструктор IndexView
     * @param {object} props - объект, в котором лежат переданные параметры
     * @param {object} storage - объект, который в котором лежат фукнции для работы с User
     */
    constructor(props: IProps, storage: IStorage<IState>) {
        super(props, storage);
        this.page = new Page(this.props, this.storage);
        const slideToShow = 3;
        const slideToScroll = 1;
        this.slider = new DefaultSlider({ slidesTemp, slideToShow, slideToScroll });
        this.trackList = new TrackList({ tracksList });
    }

    /**
     * Функция отрисовки View
     */
    render(): void {
        this.page.render();
        const parent = this.props.parent.querySelector('.layout__content_wrap');
        parent.insertAdjacentHTML('afterbegin', IndexTemplate({ slider: this.slider.render(), tracks: this.trackList.render() }));
        const sliderWrap: HTMLElement = parent.querySelector('.slider');
        this.slider.setEventListeners(sliderWrap);

        this.page.setEventListeners();
        this.page.setEventToTracks();
    }
}
