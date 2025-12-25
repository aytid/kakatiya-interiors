// Fade-up scroll animation
const fadeElements = document.querySelectorAll('.fade-up');

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.2 });

fadeElements.forEach(el => observer.observe(el));

/* Loader */
window.addEventListener("load", () => {
    setTimeout(() => {
        document.getElementById("page-loader").classList.add("hide");
    }, 2000);
});

/* Hamburger */
const hamburger = document.getElementById("hamburger");
const nav = document.getElementById("mobileNav");

hamburger.addEventListener("click", () => {
    nav.classList.toggle("active");
});

/* Auto-close on link click */
document.querySelectorAll('#mobileNav a').forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
    });
});


const servicesWrapper = document.querySelector('.services-wrapper');
const servicesTrack = document.querySelector('.services-track');
const servicesItems = document.querySelectorAll('.services-track .carousel-item');
const servicesPrev = document.querySelector('.services-prev');
const servicesNext = document.querySelector('.services-next');

const servicesItemWidth = servicesItems[0].offsetWidth + 24;
let servicesIndex = 0;

function visibleServices() {
    return Math.floor(servicesWrapper.offsetWidth / servicesItemWidth);
}

function maxServicesIndex() {
    return servicesItems.length - visibleServices();
}

function moveServices() {
    servicesTrack.style.transform =
        `translateX(-${servicesIndex * servicesItemWidth}px)`;
}

servicesNext.addEventListener('click', () => {
    servicesIndex++;
    if (servicesIndex > maxServicesIndex()) servicesIndex = 0;
    moveServices();
});

servicesPrev.addEventListener('click', () => {
    servicesIndex--;
    if (servicesIndex < 0) servicesIndex = maxServicesIndex();
    moveServices();
});

let servicesAuto = setInterval(() => {
    servicesIndex++;
    if (servicesIndex > maxServicesIndex()) servicesIndex = 0;
    moveServices();
}, 2500);

servicesTrack.addEventListener('mouseenter', () => clearInterval(servicesAuto));
servicesTrack.addEventListener('mouseleave', () => {
    servicesAuto = setInterval(() => {
        servicesIndex++;
        if (servicesIndex > maxServicesIndex()) servicesIndex = 0;
        moveServices();
    }, 2500);
});

window.addEventListener('resize', moveServices);

const worksWrapper = document.querySelector('.works-wrapper');
const worksTrack = document.querySelector('.works-track');
const worksItems = worksTrack.querySelectorAll('.carousel-item');
const worksPrev = worksWrapper.querySelector('.carousel-btn.prev');
const worksNext = worksWrapper.querySelector('.carousel-btn.next');

const worksItemWidth = worksItems[0].offsetWidth + 24;
let worksIndex = 0;

function visibleWorks() {
    return Math.floor(worksWrapper.offsetWidth / worksItemWidth);
}

function maxWorksIndex() {
    return worksItems.length - visibleWorks();
}

function moveWorks() {
    worksTrack.style.transform =
        `translateX(-${worksIndex * worksItemWidth}px)`;
}

worksNext.addEventListener('click', () => {
    worksIndex++;
    if (worksIndex > maxWorksIndex()) worksIndex = 0;
    moveWorks();
});

worksPrev.addEventListener('click', () => {
    worksIndex--;
    if (worksIndex < 0) worksIndex = maxWorksIndex();
    moveWorks();
});

let worksAuto = setInterval(() => {
    worksIndex++;
    if (worksIndex > maxWorksIndex()) worksIndex = 0;
    moveWorks();
}, 2500);

worksTrack.addEventListener('mouseenter', () => clearInterval(worksAuto));
worksTrack.addEventListener('mouseleave', () => {
    worksAuto = setInterval(() => {
        worksIndex++;
        if (worksIndex > maxWorksIndex()) worksIndex = 0;
        moveWorks();
    }, 2500);
});

window.addEventListener('resize', moveWorks);