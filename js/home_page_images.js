import { supabase } from './supabase.js';

// 📌 Funkcija za dohvaćanje slike iz baze
async function fetchImageById(id) {
    const cacheKey = `image-${id}`;
    const cachedImage = localStorage.getItem(cacheKey);

    // Ako slika postoji u cache-u, koristi je
    if (cachedImage) {
        return JSON.parse(cachedImage);
    }

    const { data, error } = await supabase
        .from('home_page')
        .select('image_url')
        .eq('id', id)
        .single();

    if (error) {
        console.error(`Error fetching image with ID ${id}:`, error);
        return null;
    }

    if (data) {
        // 🌟 WebP optimizacija
        const optimizedUrl = `${data.image_url}?format=webp&width=800`;

        // Keširanje slike u localStorage
        localStorage.setItem(cacheKey, JSON.stringify(optimizedUrl));

        return optimizedUrl;
    }

    return null;
}

// 📌 Funkcija za postavljanje slike u HTML
async function updateImage(imageId, elementId) {
    const imgElement = document.getElementById(elementId);
    if (!imgElement) return;

    const imageUrl = await fetchImageById(imageId);
    if (imageUrl) {
        imgElement.setAttribute("data-src", imageUrl); // Čuvamo URL u `data-src`
    }
}

// 📌 Lazy loading funkcija
function lazyLoadImages() {
    const images = document.querySelectorAll("img[data-src]");

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute("data-src"); // Učitaj stvarni URL slike
                img.removeAttribute("data-src"); // Očisti `data-src`
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => observer.observe(img));
}

// 📌 Učitaj slike i pokreni lazy load
(async function () {
    await updateImage(1, 'niksa_about_img_desktop');  
    await updateImage(2, 'niksa_img');                
    await updateImage(3, 'andja_img');                

    lazyLoadImages(); // Pokreni lazy loading
})();
