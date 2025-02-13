import { supabase } from "./supabase.js";
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

document.addEventListener("DOMContentLoaded", async () => {
    const filterToggle = document.getElementById("filter-toggle");
    const filterDropdown = document.getElementById("filter-dropdown");
    const filterLabel = document.getElementById("filter-label");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const gallery = document.querySelector(".gallery");

    if (!gallery) {
        console.error("[ERROR] Gallery element nije pronađen.");
        return;
    }

    // 🔹 Dohvatanje podataka iz baze
    async function fetchMedia() {
        const { data, error } = await supabase
            .from("home_our_work_images_videos")
            .select("media_url, type, category, cover_url")
            .order("id", { ascending: true });

        if (error) {
            console.error("Greška prilikom povlačenja podataka:", error);
            return [];
        }
        return data;
    }

    const allMedia = await fetchMedia();

    // 🔹 Funkcija za prikazivanje sadržaja
    function updateGallery(category) {
        gallery.innerHTML = ""; // Brišemo stari sadržaj

        const filteredMedia = category === "all"
            ? allMedia
            : allMedia.filter(item => item.category === category);

        if (filteredMedia.length === 0) {
            gallery.innerHTML = `<p class="text-white text-center w-full">Nema dostupnih medija.</p>`;
            return;
        }

        filteredMedia.forEach((item, index) => {
            const mediaElement = document.createElement("div");
            mediaElement.classList.add("media-item");
            mediaElement.dataset.category = item.category;

            // 📌 Dodajemo različite dimenzije na osnovu kategorije
            let className = "";
            if (item.category === "reels") {
                className = "reels-item";
            } else if (item.category === "video") {
                className = "video-item";
            } else {
                className = "image-item";
            }

            mediaElement.classList.add(className);

            const anchorElement = document.createElement("a");
            anchorElement.href = item.media_url;
            anchorElement.setAttribute("data-fancybox", "gallery");

            if (item.type === "image") {
                anchorElement.innerHTML = `<img src="${item.media_url}" alt="Image" class="rounded-xl w-full object-cover">`;
            } else if (item.type === "video") {
                anchorElement.setAttribute("data-type", "html");
                anchorElement.setAttribute(
                    "data-html",
                    `
                    <div style="position:relative; display:inline-block; width:100%; max-width:700px; max-height:620px;">
                        <video
                            controls
                            poster="${item.cover_url || item.media_url}"
                            style="border-radius:28px; width:92%; height:auto; max-width:700px; max-height:620px; margin:0 auto;"
                        >
                            <source src="${item.media_url}" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                    `
                );

                const img = document.createElement("img");
                img.src = item.cover_url || item.media_url;
                img.alt = "Video Thumbnail";
                img.classList.add("rounded-xl", "w-full", "object-cover");

                const playIcon = document.createElement("div");
                playIcon.style.cssText = `
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 50px;
                    height: 50px;
                    background: rgba(0,0,0,0.6);
                    border-radius: 50%;
                    display: flex;
                    align-items:center;
                    justify-content:center;
                `;
                playIcon.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30"
                         viewBox="0 0 24 24" fill="white">
                        <path d="M8 5v14l11-7z"></path>
                    </svg>
                `;

                const container = document.createElement("div");
                container.style.position = "relative";
                container.appendChild(img);
                container.appendChild(playIcon);

                anchorElement.appendChild(container);
            }

            mediaElement.appendChild(anchorElement);
            gallery.appendChild(mediaElement);
        });

        // Ponovno inicijalizovanje Fancybox-a nakon ažuriranja galerije
        Fancybox.bind('[data-fancybox="gallery"]', {
            loop: true,
            thumbs: { autoStart: true },
            buttons: ['zoom', 'close'],
        
            on: {
                "Carousel.selectSlide": (fancybox, carousel, slide) => {
                    console.log("[DEBUG] Slide promenjen, tražim video...");
        
                    // ❗ Pauziramo SVE prethodne videe pre nego što pustimo novi
                    document.querySelectorAll("video").forEach(video => {
                        video.pause();
                        video.currentTime = 0;
                    });
        
                    setTimeout(() => {
                        // 🎯 Pravimo bolji selektor da uhvatimo TAČNO AKTIVNI slajd
                        const activeSlide = document.querySelector(".fancybox__slide.is-selected");
                        if (!activeSlide) {
                            console.warn("[WARNING] Aktivan slajd nije pronađen.");
                            return;
                        }
        
                        const videoEl = activeSlide.querySelector("video");
        
                        if (!videoEl) {
                            console.warn("[WARNING] Video nije pronađen u aktivnom slajdu.");
                            return;
                        }
        
                        console.log("[SUCCESS] Video pronađen, pokrećem autoplay...");
                        videoEl.muted = true; // Chrome zahteva mute za autoplay
                        videoEl.play()
                            .then(() => {
                                console.log("[SUCCESS] Video autoplay radi!");
                                setTimeout(() => {
                                    videoEl.muted = false;
                                    videoEl.volume = 1.0;
                                }, 300);
                            })
                            .catch((err) => {
                                console.warn("[ERROR] Autoplay blokiran:", err);
                            });
                    }, 200); // 🚀 Malo kašnjenje kako bismo osigurali da je slajd učitan
                },
        
                // ✅ **Dodajemo custom close dugme kada se Fancybox otvori**
                "Carousel.ready": (fancybox, carousel) => {
                    console.log("[INFO] Fancybox otvoren, dodajem custom close dugme...");
        
                    const fancyboxContainer = document.querySelector(".fancybox__container");
                    if (fancyboxContainer) {
                        const existingCloseButton = fancyboxContainer.querySelector(".custom-close-btn");
                        if (!existingCloseButton) {
                            const closeButton = createCloseButton();
                            closeButton.classList.add("custom-close-btn"); // Sprečavamo dupliranje
                            fancyboxContainer.appendChild(closeButton);
                        }
                    }
        
                    // ✅ **Dodajemo swipe gestove**
                    let startX = 0;
        
                    document.addEventListener("touchstart", (e) => {
                        startX = e.touches[0].clientX;
                    });
        
                    document.addEventListener("touchend", (e) => {
                        const endX = e.changedTouches[0].clientX;
                        if (startX - endX > 50) {
                            console.log("[SWIPE] Swipe left - Sledeći slajd");
                            carousel.slideNext();
                        } else if (endX - startX > 50) {
                            console.log("[SWIPE] Swipe right - Prethodni slajd");
                            carousel.slidePrev();
                        }
                    });
                }
            },
        });
        
        function createCloseButton() {
            const closeButton = document.createElement("div");
            closeButton.classList.add("custom-close-btn");
        
            closeButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path d="M18 6L6 18M6 6l12 12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;
        
            closeButton.addEventListener("click", () => {
                Fancybox.close(); // Zatvaranje Fancybox-a
            });
        
            return closeButton;
        }
        
    }

    // Prvo učitavanje - prikazuje "All Projects"
    updateGallery("all");

    // Aktiviranje filter dugmadi
    function applyFilter(selectedButton) {
        const category = selectedButton.dataset.category;

        // Ažuriranje aktivnog taba
        filterButtons.forEach(btn => btn.classList.remove("active"));
        selectedButton.classList.add("active");

        if (filterLabel) {
            filterLabel.textContent = selectedButton.textContent;
        }

        updateGallery(category);
    }

    // Klik na desktop filtere
    filterButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            applyFilter(e.target);
        });
    });

    // Klik na mobile dropdown filtere
    if (filterToggle && filterDropdown) {
        filterToggle.addEventListener("click", () => {
            filterDropdown.classList.toggle("hidden");
            filterToggle.querySelector("svg").classList.toggle("rotate-180");
        });

        filterDropdown.querySelectorAll(".filter-btn").forEach(button => {
            button.addEventListener("click", (e) => {
                applyFilter(e.target);
                filterDropdown.classList.add("hidden");
                filterToggle.querySelector("svg").classList.remove("rotate-180");
            });
        });
    }
});
