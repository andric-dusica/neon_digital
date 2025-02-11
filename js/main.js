// Import neophodnih modula
import "./supabase.js";
import "./logos.js";
import "./photoswipe.js";
import "./home_page_images.js";

// Funkcija za dinamičko učitavanje skripti
function loadScript(src, callback) {
    const script = document.createElement("script");
    script.src = src;
    script.onload = callback;
    document.head.appendChild(script);
}

// Učitavanje jQuery-a i ostalih zavisnosti
loadScript("https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js", () => {
    console.log("jQuery loaded");

    loadScript("https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js", () => {
        console.log("Owl Carousel loaded");
    });

    loadScript("https://cdnjs.cloudflare.com/ajax/libs/magnific-popup.js/1.1.0/jquery.magnific-popup.min.js", () => {
        console.log("Magnific Popup loaded");
    });
});

// Funkcija za podešavanje aktivnog linka u navigaciji i footeru
function setActiveLinks(containerSelector) {
    const links = document.querySelectorAll(`${containerSelector} a`);
    let currentPage = window.location.pathname.split("/").pop();

    if (currentPage === "") {
        currentPage = "index.html"; // Ako je prazno (home page), postavi na index.html
    }

    links.forEach(link => {
        const linkHref = link.getAttribute("href");
        if (currentPage === linkHref || window.location.href.includes(linkHref)) {
            link.classList.add("font-semibold"); // Dodaj bold za aktivni link
        } else {
            link.classList.remove("font-semibold"); // Skloni bold sa neaktivnih
        }
    });
}

// Kada se DOM učita, pokreni funkcije
document.addEventListener("DOMContentLoaded", () => {
    setActiveLinks("nav");     // Postavlja aktivni link u navigaciji
    setActiveLinks("footer");  // Postavlja aktivni link u footeru
});
