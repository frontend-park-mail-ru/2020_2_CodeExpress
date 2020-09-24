// TODO: Использовать на нижнем слайдере.
// const slider = document.querySelector('.index-slider__track');
// const slides = document.querySelectorAll('.index-slider__item');
// const sliderWidth = parseFloat(getComputedStyle(slider).width);
// const itemWidth = parseFloat(getComputedStyle(slides[0]).width);
//
// const step = itemWidth / sliderWidth * 100;
// const items = [];
//
// slides.forEach((item, index) => {
//     items.push({ item: item, position: index, transform: 0 });
// });
//
// const position = {
//     getItemMin: function () {
//         let indexItem = 0;
//         items.forEach((item, index) => {
//            if(item.position < items[indexItem].position) {
//                indexItem = index;
//            }
//         });
//         return indexItem;
//     },
//     getItemMax: function () {
//         let indexItem = 0;
//         items.forEach((item, index) => {
//             if(item.position > items[indexItem].position) {
//                 indexItem = index;
//             }
//         });
//         return indexItem;
//     },
//     getMin: function () {
//         return items[position.getItemMin()].position;
//     },
//     getMax: function () {
//         return items[position.getItemMax()].position;
//     }
// };
//
// let positionLeftSlide = 0;
// let transform = 0;
//
// const transformItem = (direction) => {
//     let nextSlide;
//
//     const currentSlide =  slider.querySelector('.index-slider__item_current');
//     const backwardSlide = slider.querySelector('.index-slider__item_left');
//     const forwardSlide = slider.querySelector('.index-slider__item_right');
//
//     currentSlide.classList.remove('index-slider__item_current');
//     backwardSlide.classList.remove('index-slider__item_left');
//     forwardSlide.classList.remove('index-slider__item_right');
//
//     if (direction === 'right') {
//         positionLeftSlide++;
//         if ((positionLeftSlide + sliderWidth / itemWidth - 1) > position.getMax()) {
//             currentSlide.classList.add('index-slider__item_left');
//             forwardSlide.classList.add('index-slider__item_current');
//             items[position.getItemMax()].item.classList.add('index-slider__item_right');
//             nextSlide = position.getItemMin();
//             const slide  = items[nextSlide];
//             slide.position = position.getMax() + 1;
//             slide.transform += items.length * 100;
//             slide.item.style.transform = `translateX(${slide.transform}%)`;
//
//         }
//
//         transform -= step;
//     }
//     if (direction === 'left') {
//         positionLeftSlide--;
//         if(positionLeftSlide < position.getMin()) {
//             nextSlide = position.getItemMax();
//             const slide = items[nextSlide];
//             slide.position = position.getMin() - 1;
//             slide.transform -= items.length * 200;
//             slide.item.style.transform += `translateX(${slide.transform}%)`;
//         }
//         transform += step;
//     }
//     slider.style.transform = `translateX(${transform}%)`;
// };
//
// const sliderInit = () => {
//     items[1].item.classList.add('index-slider__item_current');
//     items[2].item.classList.add('index-slider__item_right');
//     items[0].item.classList.add('index-slider__item_left')
// };
//
// sliderInit();
//
//
// setInterval(() => {
//     transformItem('right');
// }, 5000);
//
// slider.addEventListener('click', (event) => {
//     if (event.target.tagName === 'DIV' && event.target.classList.contains('index-slider__item_left')) {
//         transformItem('left');
//     }
//     if (event.target.tagName === 'DIV' && event.target.classList.contains('index-slider__item_right')) {
//         transformItem('right');
//     }
// });
//
//
