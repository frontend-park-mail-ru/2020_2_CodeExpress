import { Page } from 'components/page/page';
import { View } from 'managers/base-view/base-view';
import { DefaultSlider } from 'components/default-slider/default-slider';
import { TrackList } from 'components/track-list/track-list';
import { slidesTemp, tracksList } from 'store/consts';
import { IProps, IState, IStorage } from 'store/interfaces';

import IndexTemplate from './index.hbs';
import './index.scss';
import './track.scss';
import './album.scss';

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
        this.page.show();
        this.storage.set({ pageState: true });

        const genreArray: Array<string> = ['Альтернативный Рок',
            'Иностранный Рок', 'Русский Рок', 'Поп', 'Хипхоп', 'Саундтреки',
            'Електронная', 'Джаз', 'Блюз', 'Кантри', 'Метал', 'Классическая'];

        this.props.parent = document.querySelector('.page__content');
        this.props.parent.insertAdjacentHTML('afterbegin', IndexTemplate({ genres: genreArray }));
    }
}
