import Swiper from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

export function initReviewsSlider() {
  const el = document.querySelector('.swiper');
  if (!el) return;

  const nextButton = el.querySelector('.swiper-button-next');
  const prevButton = el.querySelector('.swiper-button-prev');

  const reviewsSwiper = new Swiper(el, {
    preventClicks: false, 
    preventClicksPropagation: false,
    effect: 'fade',
    fadeEffect: { crossFade: true },
    speed: 400,
    loop: true,
    allowTouchMove: true,
  });

  if (prevButton) {
    prevButton.addEventListener('click', () => {
      reviewsSwiper.slidePrev();
    });
  }

  if (nextButton) {
    nextButton.addEventListener('click', () => {
      reviewsSwiper.slideNext();
    });
  }
}