// Карточки услуг

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initExpertiseAnimations() { 
    gsap.registerPlugin(ScrollTrigger);

    const cards = document.querySelectorAll(".service-card");

    cards.forEach((card, index) => {
      if (index === cards.length - 1) return;

      ScrollTrigger.create({
        trigger: cards[index + 1],
        start: "top bottom",
        end: "top top",
        scrub: true,

        onUpdate: (self) => {
          const progress = self.progress;
          const scale = 1 - progress * 0.25;
          const rotation = (index % 2 === 0 ? 5 : -5) * progress;
          const opacity = progress * 0.5;

          gsap.set(card, {
            scale: scale,
            rotate: rotation,
          });

          const overlay = card.querySelector(".service-card__overlay");
          if (overlay) {
            gsap.set(overlay, { opacity: opacity });
          }
        },
      });
    });
}