const fadeElements = document.querySelectorAll('.fade-up');

const observer = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    },
    { threshold: 0.2 }
);

fadeElements.forEach(el => observer.observe(el));

window.addEventListener("load", () => {
    setTimeout(() => {
        const loader = document.getElementById("page-loader");
        if (loader) loader.classList.add("hide");
    }, 500);
});

const hamburger = document.getElementById("hamburger");
const nav = document.getElementById("mobileNav");

if (hamburger && nav) {
    hamburger.addEventListener("click", () => {
        nav.classList.toggle("active");
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

    let index = 0;
    const itemWidth = () => items[0].offsetWidth + gap;

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            index = (index + 1) % items.length;
            trackEl.style.transform = `translateX(-${index * itemWidth()}px)`;
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            index = (index - 1 + items.length) % items.length;
            trackEl.style.transform = `translateX(-${index * itemWidth()}px)`;
        });
    }

    if (dotsEl) {
        dotsEl.innerHTML = "";
        items.forEach((_, i) => {
            const dot = document.createElement("span");
            if (i === 0) dot.classList.add("active");
            dotsEl.appendChild(dot);
        });

        const dotsArr = dotsEl.querySelectorAll("span");

        trackEl.addEventListener("scroll", () => {
            const scrollIndex = Math.round(trackEl.scrollLeft / itemWidth());
            dotsArr.forEach(d => d.classList.remove("active"));
            if (dotsArr[scrollIndex]) dotsArr[scrollIndex].classList.add("active");
        });
    }

    window.addEventListener("resize", () => {
        trackEl.style.transform = `translateX(-${index * itemWidth()}px)`;
    });
}

setupCarousel({
    wrapper: ".services-wrapper",
    track: ".services-track",
    item: ".carousel-item",
    prev: ".services-prev",
    next: ".services-next",
    dots: ".services-dots",
    gap: 24
});

setupCarousel({
    wrapper: ".works-wrapper",
    track: ".works-track",
    item: ".carousel-item",
    prev: ".works-wrapper .prev",
    next: ".works-wrapper .next",
    dots: ".works-dots",
    gap: 24
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
