// /js/main.js

// Import drugih modula (po potrebi zadrži/izmeni ako ti trebaju)


// Funkcija za dinamičko učitavanje skripti (npr. jQuery, OwlCarousel, Magnific Popup)
function loadScript(src, callback) {
  const script = document.createElement("script");
  script.src = src;
  script.onload = callback;
  document.head.appendChild(script);
}

// Učitavanje spoljnih zavisnosti
loadScript("https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js", () => {
  console.log("jQuery loaded");
  loadScript("https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js", () => {
    console.log("Owl Carousel loaded");
  });
  loadScript("https://cdnjs.cloudflare.com/ajax/libs/magnific-popup.js/1.1.0/jquery.magnific-popup.min.js", () => {
    console.log("Magnific Popup loaded");
  });
});

// Funkcija koja dodeljuje klasu "font-semibold" aktivnom linku
function setActiveLinks(containerSelector) {
  const links = document.querySelectorAll(`${containerSelector} a`);
  const currentPath = window.location.pathname; 
  // npr. "/", "/services", "/services/", "/services/index.html"

  links.forEach(link => {
    const linkHref = link.getAttribute("href") || "";
    // npr. "/", "/services/", "/our-work/", ...

    // Ako je link za Home ("/"), pogledaj da li smo na root stranici
    if (linkHref === "/") {
      if (currentPath === "/" || currentPath === "/index.html") {
        link.classList.add("font-semibold");
      } else {
        link.classList.remove("font-semibold");
      }
      return; // pređi na sledeći link
    }

    // Za ostale linkove - hoćemo da pokrijemo: "/services", "/services/", "/services/index.html"
    if (
      currentPath === linkHref ||
      currentPath === linkHref.slice(0, -1) || // ukloni "/" na kraju pa uporedi
      currentPath === linkHref + "index.html" ||
      currentPath === linkHref + "/index.html"
    ) {
      link.classList.add("font-semibold");
    } else {
      link.classList.remove("font-semibold");
    }
  });
}

// Kada se DOM učita, pokreni setActiveLinks za <nav> i <footer>
document.addEventListener("DOMContentLoaded", () => {
  setActiveLinks("nav");
  setActiveLinks("footer");
});
