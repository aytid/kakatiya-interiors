document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});
const fadeElements = document.querySelectorAll('.fade-up');
const observer = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    },
    { threshold: 0.1 }
);
fadeElements.forEach(el => observer.observe(el));

window.addEventListener("load", () => {
    const loader = document.getElementById("page-loader");
    if (loader) {
        setTimeout(() => {
            loader.classList.add("hide");
        }, 600);
    }
});

const hamburger = document.getElementById("hamburger");
const nav = document.getElementById("mobileNav");

if (hamburger && nav) {
    hamburger.addEventListener("click", () => {
        nav.classList.toggle("active");
        hamburger.classList.toggle("open");
    });

    document.querySelectorAll('#mobileNav a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
        });
    });
}

function setupCarousel({ wrapper, track, item, prev, next, dots, gap = 24 }) {
    const wrapperEl = document.querySelector(wrapper);
    const trackEl = document.querySelector(track);
    const items = trackEl ? trackEl.querySelectorAll(item) : [];
    const prevBtn = document.querySelector(prev);
    const nextBtn = document.querySelector(next);
    const dotsEl = document.querySelector(dots);

    if (!wrapperEl || !trackEl || items.length === 0) {
        console.warn(`Carousel not found: ${wrapper}`);
        return;
    }

    let index = 0;
    let touchStartX = 0;
    let touchStartY = 0;
    let currentX = 0;
    let isSwiping = false;
    let startTranslate = 0;

    const getItemWidth = () => items[0].offsetWidth + gap;
    const maxIndex = () => items.length - 1;

    const updatePosition = (animate = true) => {
        if (index < 0) index = 0;
        if (index > maxIndex()) index = maxIndex();

        const translate = -(index * getItemWidth());
        
        if (animate) {
            trackEl.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        } else {
            trackEl.style.transition = 'none';
        }
        
        trackEl.style.transform = `translateX(${translate}px)`;
        currentX = translate;
        
        if (prevBtn) prevBtn.style.opacity = index === 0 ? "0.3" : "1";
        if (nextBtn) nextBtn.style.opacity = index === maxIndex() ? "0.3" : "1";
        
        updateDots();
    };

    const updateDots = () => {
        if (!dotsEl) return;
        const dotElements = dotsEl.querySelectorAll("span");
        dotElements.forEach((dot, i) => {
            dot.classList.toggle("active", i === index);
        });
    };

    // Button controls
    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            if (index < maxIndex()) {
                index++;
                updatePosition();
            } else {
                index = 0;
                updatePosition();
            }
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            if (index > 0) {
                index--;
                updatePosition();
            } else {
                index = maxIndex();
                updatePosition();
            }
        });
    }

    // Dots
    if (dotsEl) {
        dotsEl.innerHTML = "";
        items.forEach((_, i) => {
            const dot = document.createElement("span");
            if (i === 0) dot.classList.add("active");
            dot.style.cursor = "pointer";
            dot.addEventListener("click", () => {
                index = i;
                updatePosition();
            });
            dotsEl.appendChild(dot);
        });
    }

    // TOUCH HANDLING - Attached to wrapper for better capture
    wrapperEl.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        isSwiping = true;
        startTranslate = -(index * getItemWidth());
        trackEl.style.transition = 'none';
    }, { passive: true });

    wrapperEl.addEventListener('touchmove', (e) => {
        if (!isSwiping) return;

        const touchX = e.touches[0].clientX;
        const touchY = e.touches[0].clientY;
        const diffX = touchStartX - touchX;
        const diffY = touchStartY - touchY;

        // Determine if horizontal swipe
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 5) {
            // Horizontal movement - prevent default to stop page scroll
            if (e.cancelable) e.preventDefault();
            
            let newTranslate = startTranslate - diffX;
            
            // Add resistance at edges
            if (index === 0 && diffX < 0) {
                newTranslate = startTranslate - (diffX * 0.3);
            } else if (index === maxIndex() && diffX > 0) {
                newTranslate = startTranslate - (diffX * 0.3);
            }
            
            trackEl.style.transform = `translateX(${newTranslate}px)`;
        }
    }, { passive: false });

    wrapperEl.addEventListener('touchend', (e) => {
        if (!isSwiping) return;
        isSwiping = false;
        
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;
        const threshold = getItemWidth() * 0.2; // 20% of item width

        trackEl.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

        if (Math.abs(diff) > threshold) {
            if (diff > 0 && index < maxIndex()) {
                index++; // Swipe left -> next
            } else if (diff < 0 && index > 0) {
                index--; // Swipe right -> prev
            }
        }
        
        updatePosition();
    }, { passive: true });

    // Mouse drag support for desktop (optional but nice)
    let isDragging = false;
    let mouseStartX = 0;

    wrapperEl.addEventListener('mousedown', (e) => {
        isDragging = true;
        mouseStartX = e.clientX;
        startTranslate = -(index * getItemWidth());
        trackEl.style.transition = 'none';
        wrapperEl.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const diff = mouseStartX - e.clientX;
        trackEl.style.transform = `translateX(${startTranslate - diff}px)`;
    });

    window.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        isDragging = false;
        wrapperEl.style.cursor = 'grab';
        
        const diff = mouseStartX - e.clientX;
        const threshold = getItemWidth() * 0.2;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0 && index < maxIndex()) index++;
            else if (diff < 0 && index > 0) index--;
        }
        updatePosition();
    });

    window.addEventListener("resize", () => updatePosition());
    updatePosition();
}

// Initialize all carousels
document.addEventListener('DOMContentLoaded', () => {
    setupCarousel({
        wrapper: ".services-wrapper",
        track: ".services-track",
        item: ".carousel-item",
        prev: ".services-prev",
        next: ".services-next",
        dots: ".services-dots"
    });

    setupCarousel({
        wrapper: ".skills-wrapper",
        track: ".skills-track",
        item: ".skill-card",    
        prev: ".skills-prev",
        next: ".skills-next",
        dots: ".skills-dots",
        gap: 28
    });

    setupCarousel({
        wrapper: ".works-wrapper",
        track: ".works-track",
        item: ".carousel-item",
        prev: ".works-prev",
        next: ".works-next",
        dots: ".works-dots"
    });

    setupCarousel({
        wrapper: ".tv-wrapper",
        track: ".tv-track",
        item: ".carousel-item",
        prev: ".tv-prev",
        next: ".tv-next",
        dots: ".tv-dots"
    });

    setupCarousel({
        wrapper: ".wardrobe-wrapper",
        track: ".wardrobe-track",
        item: ".carousel-item",
        prev: ".wardrobe-prev",
        next: ".wardrobe-next",
        dots: ".wardrobe-dots"
    });

    setupCarousel({
        wrapper: ".pooja-wrapper",
        track: ".pooja-track",
        item: ".carousel-item",
        prev: ".pooja-prev",
        next: ".pooja-next",
        dots: ".pooja-dots"
    });

    setupCarousel({
        wrapper: ".bedroom-wrapper",
        track: ".bedroom-track",
        item: ".carousel-item",
        prev: ".bedroom-prev",
        next: ".bedroom-next",
        dots: ".bedroom-dots"
    });

    setupCarousel({
        wrapper: ".elevation-wrapper",
        track: ".elevation-track",
        item: ".carousel-item",
        prev: ".elevation-prev",
        next: ".elevation-next",
        dots: ".elevation-dots"
    });

    setupCarousel({
        wrapper: ".plans-wrapper",
        track: ".plans-track",
        item: ".carousel-item",
        prev: ".plans-prev",
        next: ".plans-next",
        dots: ".plans-dots"
    });
});
