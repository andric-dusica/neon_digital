import '@fancyapps/ui/dist/fancybox/fancybox.css'; // Fancybox CSS
import { Fancybox } from '@fancyapps/ui'; // Fancybox JS

// Supabase inicijalizacija
const { createClient } = window.supabase;
const supabaseUrl = 'https://gwodcdkzxwbepgxpxxvf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3b2RjZGt6eHdiZXBneHB4eHZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjcwMzY2MTMsImV4cCI6MjA0MjYxMjYxM30.78W4s46xNHSPE22zQ2BiXyuoPVCg4gVUzJ3LEJqe31M';
const supabase = createClient(supabaseUrl, supabaseKey);


// Funkcija za povlačenje medija iz baze
async function getWorkMedia() {
    const { data, error } = await supabase
        .from('home_our_work_images_videos')
        .select('media_url, type, cover_url')
        .order('id', { ascending: true });

    if (error) {
        console.error('[ERROR] Greška prilikom povlačenja medija:', error);
        return [];
    }

    return data;
}

// Funkcija za prikazivanje medija u galeriji
async function displayWorkMedia() {
    const carousel = document.querySelector('.images_videos');
    if (!carousel) {
        console.error('[ERROR] Carousel element nije pronađen!');
        return;
    }

    const media = await getWorkMedia();

    if (media.length === 0) {
        console.log('[INFO] Nema medija za prikazivanje.');
        return;
    }

    let currentIndex = 0; // Trenutni indeks za swipe navigaciju
    const isMobile = window.innerWidth <= 768;

    const openFullscreenModal = (index) => {
        currentIndex = index;

        // Blokiraj scroll na pozadini
        document.body.style.overflow = 'hidden';
        document.body.style.height = '100vh'; // Sprečava vertikalni scroll

        const modalContainer = document.createElement('div');
        modalContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        `;

        const contentContainer = document.createElement('div');
        contentContainer.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
        `;

        const closeModal = () => {
            document.body.style.overflow = ''; // Omogući scroll na pozadini
            document.body.style.height = ''; // Resetuj visinu
            document.body.removeChild(modalContainer);
        };

        const updateContent = () => {
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
                video.style.cssText = 'max-width: 90%; max-height: 90%; border-radius: 28px';
                video.innerHTML = `
                    <source src="${currentItem.media_url}" type="video/mp4">
                    Your browser does not support the video tag.
                `;

                let isPaused = video.paused; // Praćenje statusa

                video.addEventListener('touchstart', () => {
                    // Pauza ili pokretanje videa
                    if (isPaused) {
                        video.play();
                    } else {
                        video.pause();
                    }
                    isPaused = !isPaused; // Menjaj status
                });

                contentContainer.appendChild(video);
            }
        };

        // Dodaj "X" dugme za zatvaranje
        const closeButton = document.createElement('button');
        closeButton.style.cssText = `
            position: absolute;
            top: -5px;
            right: 20px;
            background: none;
            border: none;
            color: white;
            font-size: 30px;
            cursor: pointer;
        `;
        closeButton.innerHTML = '&times;';
        closeButton.addEventListener('click', closeModal);

        // Swipe navigacija
        let startX = 0;
        contentContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        contentContainer.addEventListener('touchmove', (e) => {
            const endX = e.touches[0].clientX;
            if (startX - endX > 50) {
                // Swipe left
                currentIndex = (currentIndex + 1) % media.length;
                updateContent();
            } else if (endX - startX > 50) {
                // Swipe right
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

    media.forEach((item, index) => {
        const anchorElement = document.createElement('a');
        anchorElement.href = item.media_url;

        if (isMobile) {
            anchorElement.addEventListener('click', (e) => {
                e.preventDefault();
                openFullscreenModal(index);
            });
        } else {
            anchorElement.setAttribute('data-fancybox', 'gallery');
            if (item.type === 'video') {
                anchorElement.setAttribute('data-type', 'html');
                anchorElement.setAttribute(
                    'data-html',
                    `
                    <video controls style="border-radius:28px; width:100%; height:auto; max-width:700px; max-height:620px;">
                        <source src="${item.media_url}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                    `
                );
            }
        }

        if (item.type === 'image') {
            const img = document.createElement('img');
            img.src = item.media_url;
            img.alt = 'Portfolio Image';
            img.style.maxWidth = '100%';
            anchorElement.appendChild(img);
        } else if (item.type === 'video') {
            const img = document.createElement('img');
            img.src = item.cover_url;
            img.alt = 'Video Thumbnail';
            img.style.maxWidth = '100%';

            const playIcon = document.createElement('div');
            playIcon.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 50px;
                height: 50px;
                background: rgba(0, 0, 0, 0.6);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            playIcon.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="white">
                    <path d="M8 5v14l11-7z"></path>
                </svg>
            `;

            const container = document.createElement('div');
            container.style.position = 'relative';
            container.style.display = 'inline-block';
            container.style.width = '100%';
            container.appendChild(img);
            container.appendChild(playIcon);
            anchorElement.appendChild(container);
        }

        const divElement = document.createElement('div');
        divElement.classList.add('item');
        divElement.appendChild(anchorElement);

        carousel.appendChild(divElement);
    });

    // Owl Carousel inicijalizacija
    $(".images_videos").owlCarousel({
        loop: false,
        margin: 10,
        rewind: true,
        nav: true,
        dots: true,
        startPosition: 0,
        navText: [
            '<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none"><path d="M15.5 18.5L9.5 12.5L15.5 6.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
            '<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none"><path d="M9.5 18.5L15.5 12.5L9.5 6.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
        ],
        responsive: {
            0: { items: 1, margin: 10 },
            768: { items: 2, margin: 20 },
            1024: { items: 3, margin: 24 },
            1280: { items: 4, margin: 24 },
        }
    });

    if (!isMobile) {
        Fancybox.bind('[data-fancybox="gallery"]', {
            loop: true,
            thumbs: { autoStart: true },
            buttons: ['zoom', 'close'],
        });
    }
}

// Poziv funkcije kada je DOM učitan
document.addEventListener('DOMContentLoaded', displayWorkMedia);