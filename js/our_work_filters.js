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

    // Povlačenje medija iz Supabase
    async function fetchMedia() {
        const { data: homeData, error: homeError } = await supabase
        .from("home_our_work_images_videos")
        .select("media_url, type, category, cover_url, project_name")
        .order("order", { ascending: true });

        const { data: ourWorkData, error: ourWorkError } = await supabase
            .from("our_work_images_videos")
            .select("media_url, type, category, cover_url, project_name")
            .order("id", { ascending: true });

            if (homeError || ourWorkError) {
                console.error("Greška prilikom povlačenja podataka:", homeError || ourWorkError);
                return [];
            }
            
        const combinedData = [...homeData, ...ourWorkData];
        return combinedData;
    }

    const allMedia = await fetchMedia();
    let currentFilteredMedia = [];  
    let currentIndex = 0;         

    // ===== FUNKCIJA ZA CUSTOM MOBILNI MODAL =====
    function openFullscreenModal(index) {
        currentIndex = index;

        // Kreiramo "overlay" kontejner
        const modalContainer = document.createElement("div");
        modalContainer.style.cssText = `
            position: fixed;
            top: 0; 
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        `;

        // Unutrašnji div za prikaz slike/videa
        const contentContainer = document.createElement("div");
        contentContainer.style.cssText = `
            display: flex; 
            align-items: center; 
            justify-content: center;
            width: 100%; 
            height: 100%;
            position: relative;
        `;

        // Funkcija za zatvaranje modala
        function closeModal() {
            if (modalContainer && modalContainer.parentNode === document.body) {
                document.body.removeChild(modalContainer);
              }
        }

        // Funkcija za prikaz tekućeg elementa
        function updateContent() {
            contentContainer.innerHTML = "";
            const item = currentFilteredMedia[currentIndex];
            if (!item) return;

            if (item.type === "image") {
                const img = document.createElement("img");
                img.src = item.media_url;
                img.alt = "Portfolio Image";
                img.style.cssText = "max-width: 90%; max-height: 90%; border-radius: 28px;";
                contentContainer.appendChild(img);
            } else if (item.type === "video") {
                // Kreiramo <video> element
                const video = document.createElement("video");
                video.controls = true;
                video.playsInline = true;
                video.preload = "metadata";
                video.style.cssText = "max-width: 90%; max-height: 90%; border-radius:28px;";
                
                // Učitaj i pusti
                video.src = item.media_url;
                video.load();
                video.play().catch(err => {
                    console.warn("[MOBILE] Autoplay blokiran:", err);
                });

                contentContainer.appendChild(video);
            }
        }

        // X dugme za zatvaranje
        const closeButton = document.createElement("button");
        closeButton.innerHTML = "&times;";
        closeButton.style.cssText = `
            position: absolute; 
            top: 0px; 
            right: 20px; 
            font-size: 30px; 
            color: white; 
            background: none; 
            border: none;
            z-index: 10000;
            cursor: pointer;
        `;
        closeButton.addEventListener("click", closeModal);

        // Swipe left/right/down logika
        let startX = 0, startY = 0;
        contentContainer.addEventListener("touchstart", (e) => {
            if (e.touches.length > 0) {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
            }
        });
        contentContainer.addEventListener("touchmove", (e) => {
            if (e.touches.length > 0) {
                const endX = e.touches[0].clientX;
                const endY = e.touches[0].clientY;
                const deltaX = endX - startX;
                const deltaY = endY - startY;

                // Swipe left
                if (deltaX < -50) {
                    currentIndex = (currentIndex + 1) % currentFilteredMedia.length;
                    updateContent();
                }
                // Swipe right
                else if (deltaX > 50) {
                    currentIndex = (currentIndex - 1 + currentFilteredMedia.length) % currentFilteredMedia.length;
                    updateContent();
                }
                // Swipe down => zatvori modal
                else if (deltaY > 50 && Math.abs(deltaY) > Math.abs(deltaX)) {
                    closeModal();
                }
            }
        });

        // Klik na pozadinu zatvara modal
        modalContainer.addEventListener("click", (e) => {
            if (e.target === modalContainer) {
                closeModal();
            }
        });

        // Inicijalni prikaz
        updateContent();

        modalContainer.appendChild(contentContainer);
        modalContainer.appendChild(closeButton);
        document.body.appendChild(modalContainer);
    }

    // ===== FUNKCIJA ZA PRIKAZ MEDIJA U .GALLERY =====
    function updateGallery(category = "all") {
        gallery.innerHTML = "";

        // 1) Filtracija
        currentFilteredMedia = (category === "all")
            ? allMedia
            : allMedia.filter(item => item.category === category);

        if (!currentFilteredMedia || currentFilteredMedia.length === 0) {
            gallery.innerHTML = `<p class="text-white text-center w-full">Nema dostupnih medija.</p>`;
            return;
        }

        // 2) Generisanje <div> + <a> + (slika/video) za svaku stavku
        currentFilteredMedia.forEach((item, index) => {
            const mediaElement = document.createElement("div");
            mediaElement.classList.add("media-item", "relative");
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
            anchorElement.href = item.media_url;

            // Ako je mobilni => otvaramo custom modal
            if (window.innerWidth <= 768) {
                anchorElement.addEventListener("click", (e) => {
                    e.preventDefault();
                    openFullscreenModal(index); // Koristi custom modal
                });
            } else {
                // Desktop => Fancybox
                anchorElement.setAttribute("data-fancybox", "gallery");
                anchorElement.href = item.media_url; // <a href=...>
      
           if (item.type === "video") {
                    // Kao ranije, postavljaš data-html
                    anchorElement.setAttribute("data-type", "html");
                    anchorElement.setAttribute(
                        "data-html",
                        `
                        <div style="position:relative; display:inline-block; width:100%; max-width:700px; max-height:620px;">
                           <div style="position:relative; display:inline-block; width:100%; max-width:700px; max-height:620px;">
                                <video
                                    class="fancybox-video"
                                    controls
                                    playsinline
                                    preload="preload"
                                    style="border-radius:28px; width:100%; height:auto; max-width:700px; max-height:620px;"
                                    poster="${item.cover_url}"
                                    data-src="${item.media_url}"
                                >
                                    <!-- Nema <source> ovde -->
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        </div>
                        `
                    );
                }
            }

            // 3) U <a> ubacujemo sliku ili thumbnail videa
            if (item.type === "image") {
                const container = document.createElement("div");
                container.style.position = "relative";
                container.style.overflow = "hidden";
                container.style.height = "100%"; 

            
                const img = document.createElement("img");
                img.src = item.media_url;
                img.alt = "Portfolio Image";
                img.classList.add("rounded-xl", "w-full", "object-cover");
                container.appendChild(img);
            
                // Span za naziv projekta
                // const titleSpan = document.createElement("span");
                // titleSpan.textContent = item.project_name || ""; 
                // titleSpan.style.cssText = `
                //     position: absolute;
                //     height: 50px;
                //     width: 100%;
                //     bottom: ${window.innerWidth <= 768 ? "44px" : "125px"};
                //     left: 0;
                //     background: #00002954;
                //     color: white;
                //     padding: 5px 10px;
                //     font-size: 14px;
                //     box-sizing: border-box;
                //     text-align: center;
                //     display: flex;
                //     align-items: center;
                //     justify-content: center;
                //     transition: opacity 0.3s ease-in-out;
                // `;
            
                // // Hover efekat
                // if (window.innerWidth <= 768) {
                //     titleSpan.style.opacity = "1";
                // } else {
                //     titleSpan.style.opacity = "0"; 
                //     container.addEventListener("mouseenter", () => titleSpan.style.opacity = "1");
                //     container.addEventListener("mouseleave", () => titleSpan.style.opacity = "0");
                // }
            
                // container.appendChild(titleSpan); 
                anchorElement.appendChild(container); 
                anchorElement.setAttribute("data-fancybox", "gallery"); 
            }
             else if (item.type === "video") {
                const img = document.createElement("img");
                img.src = item.cover_url || item.media_url;
                img.alt = "Video Thumbnail";
                img.classList.add("rounded-xl", "w-full", "object-cover");

                const playIcon = document.createElement("div");
                playIcon.style.cssText = `
                    position: absolute;
                    top: 50%; left: 50%;
                    transform: translate(-50%, -50%);
                    width: 50px; height: 50px;
                    background: rgba(0,0,0,0.6);
                    border-radius: 50%;
                    display: flex; align-items:center; justify-content:center;
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

                 // **✅ Dodajemo naziv projekta (project_name) kao hover text**
                const titleSpan = document.createElement("span");
                titleSpan.textContent = item.project_name || ""; 
                titleSpan.style.cssText = `
                    position: absolute;
                    height: 55px;
                    align-content: center;
                    width: 100%;
                    bottom: 0;
                    left: 0;
                    background: #18183dad;
                    color: white;
                    padding: 8px 15px;
                    font-size: 14px;
                    font-weight: 500;
                    transition: opacity 0.3s ease-in-out;
                `;
                container.appendChild(titleSpan);
    
                

                // **Hover efekat**
                if (window.innerWidth <= 768) {
                    titleSpan.style.opacity = "1";
                } else {
                    titleSpan.style.opacity = "0";
                    container.addEventListener("mouseenter", () => {
                        titleSpan.style.opacity = "1";
                    });
                    container.addEventListener("mouseleave", () => {
                        titleSpan.style.opacity = "0";
                    });
                }

                anchorElement.appendChild(container);
            }

            mediaElement.appendChild(anchorElement);
            gallery.appendChild(mediaElement);
        });

        // 4) Inicijalizacija Fancybox (ostaje nepromenjeno)
        Fancybox.bind('[data-fancybox="gallery"]', {
            loop: true,
            autoFocus: false,
            trapFocus: false,
            thumbs: { autoStart: true },
            buttons: ['zoom', 'close'],
            preload: 3,
            caption: () => "",

            on: {
                "Carousel.selectSlide": () => {
                    // 1) Pauziramo i uklanjamo src svim fancybox-video
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

                        // Dodelimo src i autoplay
                        const realSrc = videoEl.getAttribute("data-src");
                        videoEl.setAttribute("src", realSrc);
                        videoEl.setAttribute("autoplay", "true");

                        videoEl.load();
                        videoEl.muted = true;
                        videoEl.play()
                            .then(() => {
                                videoEl.removeAttribute("poster");

                                setTimeout(() => {
                                    videoEl.muted = false;
                                    videoEl.volume = 1.0;
                                }, 300);
                            })
                            .catch((err) => {
                                console.warn("[ERROR] Autoplay blokiran:", err);
                            });

                    }, 0);
                },
                "close": () => {
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

    updateGallery("all");

    function applyFilter(selectedButton) {
        const category = selectedButton.dataset.category;
        desktopFilterButtons.forEach(btn => btn.classList.remove("active"));
        mobileFilterButtons.forEach(btn => btn.classList.remove("active"));

        selectedButton.classList.add("active");
        if (filterLabel) {
            filterLabel.textContent = selectedButton.textContent;
        }
        updateGallery(category);
    }

    desktopFilterButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            applyFilter(e.currentTarget);
        });
    });

    if (filterToggle && filterDropdown) {
        filterToggle.addEventListener("click", () => {
            filterDropdown.classList.toggle("hidden");
            filterToggle.querySelector("svg").classList.toggle("rotate-180");
        });

        mobileFilterButtons.forEach(button => {
            button.addEventListener("click", (e) => {
                applyFilter(e.currentTarget);
                filterDropdown.classList.add("hidden");
                filterToggle.querySelector("svg").classList.remove("rotate-180");
            });
        });
    }

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
