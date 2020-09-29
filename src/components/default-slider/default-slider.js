// eslint-disable-next-line import/extensions
import Component from '../../managers/component/component.js';

export default class DefaultSlider extends Component {
    constructor(props) {
        super(props);
        this.position = 0;
    }

    init() {
        const template = Handlebars.templates['default-slider.hbs'];
        return template({ slides: this.props.slides });
    }

    getElements(slider) {
        const container = slider.querySelector('.slider__container');
        const track = slider.querySelector('.slider__track');
        const slides = slider.querySelectorAll('.slider-item');
        const slidesCount = slides.length;
        const prevBtn = slider.querySelector('.slider__prev-button');
        const nextBtn = slider.querySelector('.slider__next-button');
        const slideWidth = container.clientWidth / this.props.slideToShow;
        const movePosition = this.props.slideToScroll * slideWidth;

        slides.forEach((item) => {
            // eslint-disable-next-line no-param-reassign
            item.style.minWidth = `${slideWidth}px`;
        });

        this.setState({
            slider, slides, slidesCount, container, track, slideWidth, movePosition, prevBtn, nextBtn,
        });
    }

    setPosition() {
        this.state.track.style.transform = `translateX(${this.position}px)`;
    }

    checkBtns() {
        const { slideToShow } = this.props;
        const {
            nextBtn, prevBtn, slidesCount, slideWidth,
        } = this.state;

        prevBtn.disabled = this.position === 0;
        nextBtn.disabled = this.position <= -(slidesCount - slideToShow) * slideWidth;
    }

    setEvents() {
        const { slideToShow, slideToScroll } = this.props;
        const {
            prevBtn, nextBtn, slidesCount, slideWidth, movePosition,
        } = this.state;

        this.checkBtns();

        nextBtn.addEventListener('click', () => {
            const slidesLeft = slidesCount - (Math.abs(this.position) + slideToShow * slideWidth) / slideWidth;

            this.position -= slidesLeft >= slideToScroll ? movePosition : slidesLeft * slideWidth;

            this.setPosition();
            this.checkBtns();
        });

        prevBtn.addEventListener('click', () => {
            const slidesLeft = Math.abs(this.position) / slideWidth;

            this.position += slidesLeft >= slideToScroll ? movePosition : slidesLeft * slideWidth;

            this.setPosition();
            this.checkBtns();
        });
    }
}
