import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";

export function initAnimatedTitlesAnimations() { 
    gsap.registerPlugin(ScrollTrigger, SplitText);

    const lenisInstance = new Lenis({
        duration: 0.8,
    });
    lenisInstance.on("scroll", ScrollTrigger.update); 
    gsap.ticker.add((time) => {
        lenisInstance.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    document.fonts.ready.then(() => {
        const animatedTitleHeadings = gsap.utils.toArray(".animated-title h3");
        const splits = [];

        animatedTitleHeadings.forEach((heading) => {
            const split = new SplitText(heading, { type: "chars", charsClass: "char" });
            splits.push(split);

            split.chars.forEach((char, i) => {
                const charInitialY = i % 2 === 0 ? -150 : 150;
                gsap.set(char, { y: charInitialY });
            });
        });

        const animatedTitles = gsap.utils.toArray(".animated-title");

        animatedTitles.forEach((animatedTitle, index) => {
            const animatedTitleContainer = animatedTitle.querySelector(".animated-title__container");
            if (!animatedTitleContainer) return;

            const animatedTitleContainerInitialX = index === 1 ? -100 : 100;
            const split = splits[index];
            const charCount = split.chars.length;

            ScrollTrigger.create({
                trigger: animatedTitle,
                start: "top bottom",
                end: "top 25%",
                scrub: 1,
                onUpdate: (self) => {
                    const animatedTitleContainerX = animatedTitleContainerInitialX - self.progress * animatedTitleContainerInitialX;
                    gsap.set(animatedTitleContainer, { x: `${animatedTitleContainerX}%` });

                    split.chars.forEach((char, i) => {
                        let charStaggerIndex = index === 1 ? charCount - 1 - i : i;

                        const charStartDelay = 0.1;
                        const charTimelineSpan = 1 - charStartDelay;
                        const staggerFactor = Math.min(0.75, charTimelineSpan * 0.75);
                        const delay = charStartDelay + (charStaggerIndex / charCount) * staggerFactor;
                        const duration = charTimelineSpan - (staggerFactor * (charCount - 1)) / charCount;
                        const start = delay;

                        let charProgress = 0;
                        if (self.progress >= start) {
                            charProgress = Math.min(1, (self.progress - start) / duration);
                        }

                        const charInitialY = i % 2 === 0 ? -150 : 150;
                        const charY = charInitialY - charProgress * charInitialY;
                        gsap.set(char, { y: charY });
                    });
                }
            });
        });
    });
}