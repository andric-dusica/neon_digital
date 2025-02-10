// Učitavanje Supabase konekcije
import "./supabase.js";

// Učitavanje logotipa i animacija
import "./logos.js";

// Učitavanje galerije slika (PhotoSwipe)
import "./photoswipe.js";

// Učitavanje slika za home page
import "./home_page_images.js";


function loadScript(src, callback) {
    const script = document.createElement("script");
    script.src = src;
    script.onload = callback;
    document.head.appendChild(script);
  }
  
  // Učitavanje jQuery-a
  loadScript("https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js", () => {
    console.log("jQuery loaded");
  
    // Kada se jQuery učita, onda učitavamo OwlCarousel i Magnific Popup
    loadScript("https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js", () => {
      console.log("Owl Carousel loaded");
    });
  
    loadScript("https://cdnjs.cloudflare.com/ajax/libs/magnific-popup.js/1.1.0/jquery.magnific-popup.min.js", () => {
      console.log("Magnific Popup loaded");
    });
  });
  