console.log("JavaScript datoteka je učitana!");

// Uvoz Fancybox CSS i JS
import '@fancyapps/ui/dist/fancybox/fancybox.css';
import { Fancybox } from '@fancyapps/ui';

// Supabase inicijalizacija
import { supabase } from './supabase.js';

let prevScrollY = 0;

// Funkcija za povlačenje medija iz baze
async function getWorkMedia() {
  const { data, error } = await supabase
    .from('home_our_work_images_videos')
    .select('media_url, type, cover_url')
    .order('id', { ascending: true });

  if (error) {
    console.error('Greška prilikom povlačenja medija:', error);
    return [];
  }
  return data;
}

async function displayWorkMedia() {
  const carousel = document.querySelector('.images_videos');
  if (!carousel) {
    return;
  }

  const media = await getWorkMedia();
  if (media.length === 0) {
    console.log('[INFO] Nema medija za prikazivanje.');
    return;
  }

  let currentIndex = 0;  // Indeks za mobilni swipe
  const isMobile = window.innerWidth <= 768;

  // === (1) Funkcija za mobilni modal (ostaje nepromenjeno) ===
  const openFullscreenModal = (index) => {
    currentIndex = index;

    prevScrollY = window.scrollY || window.pageYOffset;

    document.body.style.position = 'fixed';
    document.body.style.top = `-${prevScrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    // Širina se često postavi da ne bi došlo do horizontalnog pomeranja
    document.body.style.width = '100%';

    const modalContainer = document.createElement('div');
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

    const contentContainer = document.createElement('div');
    contentContainer.style.cssText = `
      display: flex; align-items: center; justify-content: center;
      width: 100%; height: 100%;
    `;

    const closeModal = () => {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';

    window.scrollTo(0, prevScrollY);

    document.body.removeChild(modalContainer);
  };

  const updateContent = () => {
    const allVideos = document.querySelectorAll('video');
    allVideos.forEach((vid) => {
      vid.pause();
      vid.currentTime = 0;
    });

    contentContainer.innerHTML = '';
    const currentItem = media[currentIndex];

    if (currentItem.type === 'image') {
      const img = document.createElement('img');
      img.src = currentItem.media_url;
      img.alt = 'Portfolio Image';
      img.style.cssText = 'max-width: 90%; max-height: 90%; border-radius: 28px';
      contentContainer.appendChild(img);
    } else if (currentItem.type === 'video') {
      const video = document.createElement('video');
      video.controls = true;
      video.autoplay = true; 
      video.style.cssText = 'max-width: 90%; max-height: 90%; border-radius:28px;';
      video.innerHTML = `
        <source src="${currentItem.media_url}" type="video/mp4">
        Your browser does not support the video tag.
      `;
      contentContainer.appendChild(video);
    }
  };

    // X dugme
    const closeButton = document.createElement('button');
    closeButton.style.cssText = `
      position: absolute; top: -5px; right: 20px;
      background: none; border: none; color: white;
      font-size: 30px; cursor: pointer;
    `;
    closeButton.innerHTML = '&times;';
    closeButton.addEventListener('click', closeModal);

    // Swipe navigacija (mobilni)
    let startX = 0;
    contentContainer.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    });
    contentContainer.addEventListener('touchmove', (e) => {
      const endX = e.touches[0].clientX;
      if (startX - endX > 50) {
        // sledeci
        currentIndex = (currentIndex + 1) % media.length;
        updateContent();
      } else if (endX - startX > 50) {
        // prethodni
        currentIndex = (currentIndex - 1 + media.length) % media.length;
        updateContent();
      }
    });

    updateContent();
    modalContainer.appendChild(contentContainer);
    modalContainer.appendChild(closeButton);

    modalContainer.addEventListener('click', (e) => {
      if (e.target === modalContainer) {
        closeModal();
      }
    });

    document.body.appendChild(modalContainer);
  };

  // === (2) Generisanje sličica/item-a za Owl + linkove za Fancybox ===
  media.forEach((item, index) => {
    const anchorElement = document.createElement('a');
    anchorElement.href = item.media_url;

    if (isMobile) {
      // Mobilni -> custom modal
      anchorElement.addEventListener('click', (e) => {
        e.preventDefault();
        openFullscreenModal(index);
      });
    } else {
      // Desktop -> Fancybox
      anchorElement.setAttribute('data-fancybox', 'gallery');

      if (item.type === 'video') {
        // *** UMESTO čistog <video>, stavljamo DIV s posterom i play overlay
        anchorElement.setAttribute('data-type', 'html');
        anchorElement.setAttribute(
          "data-html",
        `
        <div style="position:relative; display:inline-block; width:100%; max-width:700px; max-height:620px;">
            <video
                controls
                autoplay
                playsinline
                poster="${item.cover_url}"
                style="border-radius:28px; width:100%; height:auto; max-width:700px; max-height:620px;"
            >
                <source src="${item.media_url}" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
        `
        );
      }
    }

    // Thumbnail (ako je slika)
    if (item.type === 'image') {
      const img = document.createElement('img');
      img.src = item.media_url;
      img.alt = 'Portfolio Image';
      img.style.maxWidth = '100%';
      anchorElement.appendChild(img);
    } 
    // Thumbnail (ako je video)
    else if (item.type === 'video') {
      const img = document.createElement('img');
      img.src = item.cover_url;
      img.alt = 'Video Thumbnail';
      img.style.maxWidth = '100%';

      // Ista "play" ikonica na malom thumbnailu
      const playIcon = document.createElement('div');
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

      const container = document.createElement('div');
      container.style.position = 'relative';
      container.style.display = 'inline-block';
      container.style.width = '100%';
      container.style.height = '100%';


      container.appendChild(img);
      container.appendChild(playIcon);

      anchorElement.appendChild(container);
    }

    // Umotamo u div.item (Owl)
    const divElement = document.createElement('div');
    divElement.classList.add('item');
    divElement.appendChild(anchorElement);
    carousel.appendChild(divElement);
  });

  // === (3) Owl Carousel inicijalizacija ===
  $(".images_videos").owlCarousel({
    loop: false,
    margin: 10,
    rewind: true,
    nav: true,
    dots: true,
    autoHeight: true,
    startPosition: 0,
    navText: [
      '<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25"'
    + ' viewBox="0 0 25 25" fill="none"><path d="M15.5 18.5L9.5 12.5L15.5 6.5"'
    + ' stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      '<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25"'
    + ' viewBox="0 0 25 25" fill="none"><path d="M9.5 18.5L15.5 12.5L9.5 6.5"'
    + ' stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    ],
    responsive: {
      0:    { items: 1, margin: 10 },
      768:  { items: 2, margin: 20 },
      1024: { items: 3, margin: 24 },
      1280: { items: 4, margin: 24 },
    }
  });

  // === (4) Fancybox Desktop event => pauziranje starih videa ===
  Fancybox.bind('[data-fancybox="gallery"]', {
      Hash: false,
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
                  videoEl.muted = true; 
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
              }, 200); 
          }
      },
  });
}

// Na kraju
document.addEventListener('DOMContentLoaded', displayWorkMedia);
