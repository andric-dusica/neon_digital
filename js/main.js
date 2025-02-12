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

// Funkcija koja dodeljuje klasu "font-semibold" aktivnom linku u meniju
function setActiveLinks(containerSelector) {
  const links = document.querySelectorAll(`${containerSelector} a`);
  const currentPath = window.location.pathname; 

  links.forEach(link => {
    const linkHref = link.getAttribute("href") || "";

    // Ako je link za Home ("/"), proveri da li smo na root stranici
    if (linkHref === "/") {
      if (currentPath === "/" || currentPath === "/index.html") {
        link.classList.add("font-semibold");
      } else {
        link.classList.remove("font-semibold");
      }
      return;
    }

    // Za ostale linkove - pokrivamo: "/services", "/services/", "/services/index.html"
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

// Funkcija za brojanje karaktera u subject i message poljima (samo na Contact Us stranici)
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

// Kada se DOM učita, pokreni funkcije
document.addEventListener("DOMContentLoaded", () => {
  setActiveLinks("nav");
  setActiveLinks("footer");

  // Pokreni brojanje karaktera samo na Contact Us stranici
  if (window.location.pathname.includes("/contact-us")) {
    setupCharacterCount();
  }
});
