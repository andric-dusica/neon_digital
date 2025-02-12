import { toggleMobileMenu, closeMobileMenu } from "./mob_menu.js";

function loadScript(src, callback) {
    const script = document.createElement("script");
    script.src = src;
    script.onload = callback;
    document.head.appendChild(script);
}

loadScript("https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js", () => {
    console.log("jQuery loaded");
    loadScript("https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js", () => {
        console.log("Owl Carousel loaded");
    });
    loadScript("https://cdnjs.cloudflare.com/ajax/libs/magnific-popup.js/1.1.0/jquery.magnific-popup.min.js", () => {
        console.log("Magnific Popup loaded");
    });
});

function setActiveLinks(containerSelector) {
    const links = document.querySelectorAll(`${containerSelector} a`);
    const currentPath = window.location.pathname;

    links.forEach(link => {
        if (!link) return;
        const linkHref = link.getAttribute("href") || "";

        if (linkHref === "/") {
            if (currentPath === "/" || currentPath === "/index.html") {
                link.classList.add("font-semibold");
            } else {
                link.classList.remove("font-semibold");
            }
            return;
        }

        if (
            currentPath === linkHref ||
            currentPath === linkHref.slice(0, -1) ||
            currentPath === linkHref + "index.html" ||
            currentPath === linkHref + "/index.html"
        ) {
            link.classList.add("font-semibold");
        } else {
            link.classList.remove("font-semibold");
        }
    });
}

function setupCharacterCount() {
    const subjectInput = document.getElementById("subject");
    const messageInput = document.getElementById("message");
    const subjectCount = document.getElementById("subject-count");
    const messageCount = document.getElementById("message-count");

    if (subjectInput && subjectCount) {
        subjectInput.addEventListener("input", function () {
            subjectCount.textContent = this.value.length + "/20";
        });
    }

    if (messageInput && messageCount) {
        messageInput.addEventListener("input", function () {
            messageCount.textContent = this.value.length + "/300";
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    setActiveLinks("nav");
    setActiveLinks("footer");

    const menuToggle = document.getElementById("menu-toggle");
    const closeMenu = document.getElementById("close-menu");

    if (window.location.pathname.includes("/contact-us")) {
        setupCharacterCount();
    }

    if (menuToggle) {
        menuToggle.addEventListener("click", toggleMobileMenu);
    }

    if (closeMenu) {
        closeMenu.addEventListener("click", closeMobileMenu);
    }

    const menuLinks = document.querySelectorAll("#mobile-menu a");
    menuLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const targetURL = this.href;

            document.body.classList.add("page-transition");

            setTimeout(() => {
                window.location.href = targetURL;
            }, 500); 
        });
    });

    const pageContent = document.querySelector(".page-content");
    if (pageContent) {
        setTimeout(() => {
            pageContent.classList.add("loaded");
        }, 100);
    }
});
