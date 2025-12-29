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

    if (!wrapperEl || !trackEl || items.length === 0) return;

    let index = 0; // Track which item is at the front

    const updatePosition = () => {
        const itemWidth = items[0].offsetWidth + gap;
        // The limit is now based on moving the last item to the 0th index position
        const maxIndex = items.length - 1;
        
        // Ensure index stays within bounds [0 to last item]
        if (index > maxIndex) index = maxIndex;
        if (index < 0) index = 0;

        const targetTranslate = index * itemWidth;
        trackEl.style.transform = `translateX(-${targetTranslate}px)`;
        
        // Update Button States (Optional: dim them when at start/end)
        if (prevBtn) prevBtn.style.opacity = index === 0 ? "0.3" : "1";
        if (nextBtn) nextBtn.style.opacity = index === maxIndex ? "0.3" : "1";
        
        updateActiveDots();
    };

    const updateActiveDots = () => {
        if (!dotsEl) return;
        const dotsArr = dotsEl.querySelectorAll("span");
        dotsArr.forEach((dot, i) => {
            dot.classList.toggle("active", i === index);
        });
    };

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            if (index < items.length - 1) {
                index++;
                updatePosition();
            } else {
                // Optional: Loop back to start if clicking next at the end
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
                // Optional: Loop to end if clicking prev at the start
                index = items.length - 1;
                updatePosition();
            }
        });
    }

    if (dotsEl) {
        dotsEl.innerHTML = "";
        items.forEach((_, i) => {
            const dot = document.createElement("span");
            if (i === 0) dot.classList.add("active");
            dot.addEventListener("click", () => {
                index = i;
                updatePosition();
            });
            dotsEl.appendChild(dot);
        });
    }

    window.addEventListener("resize", updatePosition);
    updatePosition(); // Initial call
}


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


document.addEventListener('contextmenu', (event) => event.preventDefault());

document.addEventListener('dragstart', event => {
    if (event.target.tagName === 'IMG') {
        event.preventDefault();
    }
});
