const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("#site-nav");
const revealItems = document.querySelectorAll("[data-reveal]");
const counters = document.querySelectorAll("[data-count]");

const syncHeader = () => {
    if (!header) {
        return;
    }

    header.classList.toggle("is-scrolled", window.scrollY > 18);
};

syncHeader();
window.addEventListener("scroll", syncHeader, { passive: true });

if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("is-open");
        navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            nav.classList.remove("is-open");
            navToggle.setAttribute("aria-expanded", "false");
        });
    });
}

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
        });
    }, {
        threshold: 0.16,
        rootMargin: "0px 0px -8% 0px"
    });

    revealItems.forEach((item) => revealObserver.observe(item));
} else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
}

const animateCounter = (element) => {
    const target = Number(element.dataset.count || "0");
    const start = performance.now();
    const duration = 1400;

    const frame = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = String(Math.round(target * eased));

        if (progress < 1) {
            requestAnimationFrame(frame);
        }
    };

    requestAnimationFrame(frame);
};

if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
        });
    }, { threshold: 0.5 });

    counters.forEach((counter) => counterObserver.observe(counter));
} else {
    counters.forEach((counter) => animateCounter(counter));
}

document.addEventListener("mousemove", (event) => {
    document.documentElement.style.setProperty("--cursor-x", `${event.clientX}px`);
    document.documentElement.style.setProperty("--cursor-y", `${event.clientY}px`);
});