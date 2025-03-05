import { supabase } from "./supabase.js";
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

document.addEventListener("DOMContentLoaded", async () => {
    const filterToggle   = document.getElementById("filter-toggle");
    const filterDropdown = document.getElementById("filter-dropdown");
    const filterLabel    = document.getElementById("filter-label");
    
    const desktopFilterButtons = document.querySelectorAll("#desktop-filters .filter-btn");
    const mobileFilterButtons  = filterDropdown ? filterDropdown.querySelectorAll(".filter-btn") : [];

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
        gallery.innerHTML = "";
      
        const filteredMedia = (category === "all")
          ? allMedia
          : allMedia.filter(item => item.category === category);
      
        if (filteredMedia.length === 0) {
          gallery.innerHTML = `<p class="text-white text-center w-full">Nema dostupnih medija.</p>`;
          return;
        }
      
        filteredMedia.forEach((item) => {
          const mediaElement = document.createElement("div");
          mediaElement.classList.add("media-item");
          mediaElement.dataset.category = item.category;
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
          anchorElement.setAttribute("data-fancybox", "gallery");
          anchorElement.href = item.media_url; // <a href=...>
      
          if (item.type === "image") {
            // **Za slike normalan <img> + src**
            anchorElement.innerHTML = `
              <img
                src="${item.media_url}"
                alt="Image"
                class="rounded-xl w-full object-cover"
              >
            `;
          } else if (item.type === "video") {
            // **Za video: data-html** + .fancybox-video
            anchorElement.setAttribute("data-type", "html");
            anchorElement.setAttribute(
              "data-html",
              `
              <div style="position:relative; display:inline-block; width:100%; max-width:700px; max-height:620px;">
                  <video
                      class="fancybox-video"
                      controls
                      playsinline
                      style="border-radius:28px; width:100%; height:auto; max-width:700px; max-height:620px; margin:0 auto;"
                      poster="${item.cover_url || item.media_url}"
                      data-src="${item.media_url}"
                  >
                      Your browser does not support the video tag.
                  </video>
              </div>
              `
            );
      
            // Dodaj thumbnail + play icon
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
      
        // Re-inicijalizacija Fancybox
        Fancybox.bind('[data-fancybox="gallery"]', {
          loop: true,
          autoFocus: false,
          trapFocus: false,
          thumbs: { autoStart: true },
          buttons: ['zoom', 'close'],
          preload: 3,
          caption: () => "", // Ovako sklanjaš putanju fajla iz naslova
      
          on: {
            "Carousel.selectSlide": () => {
              // 1) Uklanjamo src i pauziramo SVE videe
              document.querySelectorAll(".fancybox-video").forEach(video => {
                video.pause();
                video.currentTime = 0;
                video.removeAttribute("src");
                video.removeAttribute("autoplay");
                video.load();
              });
      
              setTimeout(() => {
                // 2) Selektujemo aktivni slajd
                const activeSlide = document.querySelector(".fancybox__slide.is-selected");
                if (!activeSlide) return;
      
                const videoEl = activeSlide.querySelector(".fancybox-video");
                if (!videoEl) return;
      
                // Dodelimo src i pustimo video
                const realSrc = videoEl.getAttribute("data-src");
                videoEl.setAttribute("src", realSrc);
                videoEl.setAttribute("autoplay", "true");
      
                videoEl.load();
                videoEl.muted = true;
                videoEl.play()
                  .then(() => {
                    setTimeout(() => {
                      videoEl.muted = false;
                      videoEl.volume = 1.0;
                    }, 300);
                  })
                  .catch(err => console.warn("[ERROR] Autoplay blokiran:", err));
              }, 200);
            },
            "close": () => {
              // Kad se zatvori Fancybox, pauziramo sve
              document.querySelectorAll(".fancybox-video").forEach(video => {
                video.pause();
                video.currentTime = 0;
                video.removeAttribute("src");
                video.removeAttribute("autoplay");
                video.load();
              });
            }
          }
        });
      }
      

    // Pozivamo updateGallery("all") pri prvom učitavanju
    updateGallery("all");

    // 🔹 applyFilter: logika za filtriranje (desktop & mobile)
    function applyFilter(selectedButton) {
        const category = selectedButton.dataset.category;

        desktopFilterButtons.forEach(btn => btn.classList.remove("active"));
        mobileFilterButtons.forEach(btn  => btn.classList.remove("active"));

        selectedButton.classList.add("active");
        if (filterLabel) {
            filterLabel.textContent = selectedButton.textContent;
        }

        updateGallery(category);
    }

    // Klik na desktop dugmad
    desktopFilterButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            applyFilter(e.currentTarget);
        });
    });

    // Klik na mobile dropdown toggle
    if (filterToggle && filterDropdown) {
        filterToggle.addEventListener("click", () => {
            filterDropdown.classList.toggle("hidden");
            filterToggle.querySelector("svg").classList.toggle("rotate-180");
        });

        // Klik na svako mobilno filter-dugme
        mobileFilterButtons.forEach(button => {
            button.addEventListener("click", (e) => {
                applyFilter(e.currentTarget);
                filterDropdown.classList.add("hidden");
                filterToggle.querySelector("svg").classList.remove("rotate-180");
            });
        });
    }

    // da se dropdown zatvori klikom izvan njega:
    document.addEventListener("click", (e) => {
      const isDropdownOpen = !filterDropdown.classList.contains("hidden");
      if (
        isDropdownOpen &&
        !filterToggle.contains(e.target) &&
        !filterDropdown.contains(e.target)
      ) {
        filterDropdown.classList.add("hidden");
        filterToggle.querySelector("svg").classList.remove("rotate-180");
      }
    });
});
