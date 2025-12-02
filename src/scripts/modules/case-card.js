import gsap from "gsap";

export function initCaseCardHover() {
    const cards = document.querySelectorAll(".case-card");
    const overlay = document.getElementById("case-title-overlay");

    if (!overlay) return;

    let isAnimating = false;
    let currentCard = null;
    let mouseX = 0;
    let mouseY = 0;

    gsap.set(overlay, { 
        opacity: 0, 
        y: 50,
        rotateX: 0,
        zIndex: 9999 
    });

    function showOverlay() {
        // Сбрасываем стартовое положение перед анимацией
        gsap.set(overlay, { opacity: 0, y: 50, rotateX: 50 });
        return gsap.to(overlay, { 
            opacity: 1, 
            y: 0,
            rotateX: 0,
            duration: 0.3, 
            ease: "power1.out",
            // onStart: () => gsap.set(overlay, { rotateX: 50 })
        });
    }

    function hideOverlay() {
        return gsap.to(overlay, { 
            opacity: 0, 
            y: -50,
            rotateX: -50,
            duration: 0.3, 
            ease: "power1.in" 
        });
    }

    function isMouseOverCard(card) {
        const rect = card.getBoundingClientRect();
        return mouseX >= rect.left && mouseX <= rect.right &&
               mouseY >= rect.top && mouseY <= rect.bottom;
    }

    // Отслеживаем позицию курсора
    window.addEventListener("mousemove", e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Проверяем курсор при скролле
    window.addEventListener("scroll", () => {
        if (currentCard && !Array.from(cards).some(isMouseOverCard)) {
            // Если курсор не над ни одной карточкой — скрываем overlay
            const tl = gsap.timeline({ onComplete: () => currentCard = null });
            tl.add(hideOverlay());
            cards.forEach(c => gsap.to(c, { opacity: 1, duration: 0.2 }));
        }
    });

    cards.forEach(card => {
        const title = card.dataset.title;

        card.addEventListener("mouseenter", () => {
            if (currentCard === card && isAnimating) return;

            isAnimating = true;
            const tl = gsap.timeline({
                onComplete: () => {
                    currentCard = card;
                    isAnimating = false;
                }
            });

            if (currentCard) {
                tl.add(hideOverlay());
                tl.add(() => { overlay.textContent = title; });
                tl.add(showOverlay());
            } else {
                overlay.textContent = title;
                tl.add(showOverlay());
            }

            cards.forEach(c => {
                if (c !== card) gsap.to(c, { opacity: 0, duration: 0.3 });
            });
        });

        card.addEventListener("mouseleave", (event) => {
            if (event.relatedTarget && event.relatedTarget.classList?.contains("case-card")) return;

            isAnimating = true;
            const tl = gsap.timeline({
                onComplete: () => {
                    currentCard = null;
                    isAnimating = false;
                }
            });

            tl.add(hideOverlay());
            cards.forEach(c => gsap.to(c, { opacity: 1, duration: 0.2 }));
        });
    });
}