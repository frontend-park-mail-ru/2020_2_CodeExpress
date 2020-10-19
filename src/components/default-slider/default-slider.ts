import { Component } from 'managers/component/component';
import { IState } from 'store/interfaces';

import SliderTemplate from './default-slider.hbs';
import './slider.css';

interface ISliderProps{
    slidesTemp: Array<any>,
    slideToShow: number,
    slideToScroll: number
}

/**
 * Слайдер
 */
export class DefaultSlider extends Component<ISliderProps, IState> {
    private position: number;

    private container: HTMLElement;

    private track: HTMLElement;

    private slides: NodeListOf<HTMLElement>;

    private slidesCount: number;

    private prevBtn: HTMLFieldSetElement;

    private nextBtn: HTMLFieldSetElement;

    private slideWidth: number;

    private movePosition: number;

    /**
     * Конструктор слайдера
     * @param {object} props - объект, в котором лежат переданные параметры
     */
    constructor(props: ISliderProps) {
        super(props);
        this.position = 0;
    }

    /**
     * Поиск элементов слайдера
     * @param {HTMLElement} slider - контейнер слайдер
     */
    didMount(slider: HTMLElement): void {
        const { slideToShow, slideToScroll } = this.props;

        this.container = slider.querySelector('.slider__container');
        this.track = slider.querySelector('.slider__track');
        this.slides = slider.querySelectorAll('.slider-item');
        this.slidesCount = this.slides.length;
        this.prevBtn = slider.querySelector('.slider__prev-button');
        this.nextBtn = slider.querySelector('.slider__next-button');
        this.slideWidth = this.container.clientWidth / slideToShow;
        this.movePosition = slideToScroll * this.slideWidth;
    }

    /**
     * Установка минимальной ширины всем слайдам
     * @param {NodeListOf<HTMLElement>} slides - NodeList со всеми слайдами
     * @param {number} slideWidth - минимальная ширина слайда
     */
    setMinWidth(slides: NodeListOf<HTMLElement>, slideWidth: number): void {
        slides.forEach((item: HTMLElement) => {
            item.style.minWidth = `${slideWidth}px`;
        });
    }

    /**
     * Изменение position у track
     */
    setPosition(): void {
        this.track.style.transform = `translateX(${this.position}px)`;
    }

    /**
     * Функция, которая отключает кнопки управления слайдера при достижении конца слайдера.
     */
    setDisabledToButtons(): void {
        this.prevBtn.disabled = this.position === 0;
        this.nextBtn.disabled = this.position <= -(this.slidesCount - this.props.slideToShow) * this.slideWidth;
    }

    /**
     * Функция, которая устанавливает addEventListener блокам управления
     * @param {HTMLElement} slider -  контейнер слайдера
     */
    setEventListeners(slider: HTMLElement): void {
        const { slideToShow, slideToScroll } = this.props;

        this.didMount(slider);

        this.setMinWidth(this.slides, this.slideWidth);
        this.setDisabledToButtons();

        this.nextBtn.addEventListener('click', () => {
            const currentPosition = (Math.abs(this.position) + slideToShow * this.slideWidth); // Определение текущего position
            const slidesLeft = this.slidesCount - currentPosition / this.slideWidth; // Определении кол-ва оставшихся слайдов

            this.position -= slidesLeft >= slideToScroll ? this.movePosition : slidesLeft * this.slideWidth;

            this.setPosition();
            this.setDisabledToButtons();
        });

        this.prevBtn.addEventListener('click', () => {
            const slidesLeft = Math.abs(this.position) / this.slideWidth;

            this.position += slidesLeft >= slideToScroll ? this.movePosition : slidesLeft * this.slideWidth;

            this.setPosition();
            this.setDisabledToButtons();
        });
    }

    /**
     * Отрисовка компонента
     * @returns {*|string}
     */
    render(): HTMLCollection {
        return SliderTemplate({ slides: this.props.slidesTemp });
    }
}
