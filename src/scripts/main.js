import { initExpertiseAnimations } from './modules/expertise';
import { initHoverTextAnimations } from './modules/hover-split-text';
import { initReviewsSlider } from './modules/swiper.js';
import { initAnimatedTitlesAnimations } from './modules/animated-titles.js';
import { initCaseCardHover } from './modules/case-card.js';

document.addEventListener('DOMContentLoaded', () => {

    const isMobile = window.innerWidth <= 1024;

    if (!isMobile) {
        initExpertiseAnimations();
        initHoverTextAnimations();
        initAnimatedTitlesAnimations();
        initCaseCardHover();
    }

    initReviewsSlider();
    console.log('App initialized!');
});