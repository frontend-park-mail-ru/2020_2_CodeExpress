import { Component } from '../../managers/component/component.js';

export class DefaultSlider extends Component {
    constructor(props) {
        super(props);

        this.template = Handlebars.templates['default-slider.hbs'];
        this.position = 0;
    }

    /**
     * Поиск элементов слайдера
     * @param slider
     */
    didMount(slider) {
        this.container = slider.querySelector('.slider__container');
        this.track = slider.querySelector('.slider__track');
        this.slides = slider.querySelectorAll('.slider-item');
        this.slidesCount = this.slides.length;
        this.prevBtn = slider.querySelector('.slider__prev-button');
        this.nextBtn = slider.querySelector('.slider__next-button');
        this.slideWidth = this.container.clientWidth / this.props.slideToShow;
        this.movePosition = this.props.slideToScroll * this.slideWidth;
    }

    setMinWidth(slides, slideWidth) {
        slides.forEach((item) => {
            // eslint-disable-next-line no-param-reassign
            item.style.minWidth = `${slideWidth}px`;
        });
    }

    setPosition() {
        this.track.style.transform = `translateX(${this.position}px)`;
    }

    setDisabledToButtons() {
        this.prevBtn.disabled = this.position === 0;
        const isEnd = this.position <= -(this.slidesCount - this.slideToShow) * this.slideWidth;
        this.nextBtn.disabled = isEnd;
    }

    setEventListeners(slider) {
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

    render() {
        return this.template({ slides: this.props.slides });
    }
}
