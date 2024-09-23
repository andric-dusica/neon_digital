// Kreiraj klijent za Supabase
const { createClient } = window.supabase;
const supabaseUrl = 'https://gwodcdkzxwbepgxpxxvf.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3b2RjZGt6eHdiZXBneHB4eHZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjcwMzY2MTMsImV4cCI6MjA0MjYxMjYxM30.78W4s46xNHSPE22zQ2BiXyuoPVCg4gVUzJ3LEJqe31M';
const supabase = createClient(supabaseUrl, supabaseKey);

// Funkcija za povlačenje hero slike iz PostgreSQL baze
async function getHeroImage() {
    let { data, error } = await supabase
        .from('hero_banner')  
        .select('hero_url')  
        .eq('id', 1); 

    if (error) {
        console.error(error);
        return;
    }

    // Ako je slika pronađena, postavi je kao pozadinsku sliku
    if (data.length > 0) {
        const heroSection = document.querySelector('.hero');
        heroSection.style.backgroundImage = `url('${data[0].hero_url}')`;
    }
}

// Funkcija za povlačenje slike za deo "Services"
async function getServiceImage() {
    let { data, error } = await supabase
    .from('images') 
    .select('image_url')
    .eq('id', 22);  

    if (error) {
    console.error(error);
    return null;
    }

    return data.length > 0 ? data[0].image_url : null;
}

// Funkcija za prikazivanje slike za deo "Services"
async function displayServiceImage() {
    const serviceImageContainer = document.querySelector('.services_img_placeholder');
    const serviceImageUrl = await getServiceImage();

    if (serviceImageUrl) {
    serviceImageContainer.style.backgroundImage = `url(${serviceImageUrl})`;
    serviceImageContainer.style.width = '624px'; 
    serviceImageContainer.style.height = '567px';
    serviceImageContainer.style.backgroundSize = 'cover'; 
    serviceImageContainer.style.backgroundPosition = 'center';
    serviceImageContainer.style.borderRadius = '16px'; 
    }
}


// Funkcija za povlačenje logotipa iz PostgreSQL baze
async function getLogos() {
    let { data, error } = await supabase
      .from('client_logo')  
      .select('client_logo_url')  
      .like('client_logo_url', '%logo%'); 
  
    if (error) {
      console.error('Greška prilikom povlačenja logotipa:', error);
      return [];
    }

    console.log('Povučeni logotipi iz baze:', data);  
    return data;
}
  
// Funkcija za prikazivanje logotipa u Owl Carousel-u
async function displayLogos() {
    const carousel = document.querySelector('.clients_logos');  
    const logos = await getLogos();
  
    // Proveri da li ima logotipa i dodaj ih u carousel
    logos.forEach(logo => {
        console.log('Dodajem logo:', logo.logo_url);  
        const imgElement = document.createElement('img');
        imgElement.src = logo.client_logo_url; 
        imgElement.alt = 'Client Logo';
        carousel.appendChild(imgElement);
    });
  
    // Ponovno inicijalizuj Owl Carousel nakon što dodamo logotipe
    $(".clients_logos").owlCarousel({
      loop: true,
      margin: 10,
      autoplay: true,
      autoplayTimeout: 2000,
      autoplaySpeed: 2000,
      smartSpeed: 2000,
      slideTransition: 'linear',
      autoplayHoverPause: false,
      startPosition: 0,
      responsive: {
        0: {
          items: 1
        },
        600: {
          items: 3
        },
        1000: {
          items: 5
        }
      }
    });
  }

  // Funkcija za povlačenje slika iz PostgreSQL baze
async function getWorkImages() {
    let { data, error } = await supabase
        .from('images')  
        .select('image_url')
        .like('image_url', '%work%');  

    if (error) {
        console.error('Greška prilikom povlačenja slika:', error);
        return [];
    }

    return data;
}

// Funkcija za povlačenje videa iz PostgreSQL baze
async function getWorkVideos() {
    let { data, error } = await supabase
        .from('videos') 
        .select('video_url');

    if (error) {
        console.error('Greška prilikom povlačenja videa:', error);
        return [];
    }

    return data;
}


async function getWorkMedia() {
    let { data: images, error: imageError } = await supabase
      .from('images')  
      .select('image_url')
      .or('image_url.ilike.%webp%,image_url.ilike.%png%'); 

    let { data: videos, error: videoError } = await supabase
      .from('videos')  
      .select('video_url');

    if (imageError || videoError) {
        console.error(imageError || videoError);
        return { images: [], videos: [] };
    }

    return { images, videos };
}

// Funkcija za prikazivanje slika i videa u Owl Carousel-u za "Our Work"
async function displayWorkMedia() {
    const carousel = document.querySelector('.images_videos');  
    const { images, videos } = await getWorkMedia();

    // Prolazak kroz slike i njihovo dodavanje u carousel
    images.forEach(image => {
        const imgElement = document.createElement('img');
        imgElement.src = image.image_url;
        imgElement.alt = 'Work Image';
        const divElement = document.createElement('div');
        divElement.classList.add('item');
        divElement.appendChild(imgElement);
        carousel.appendChild(divElement);
    });

    // Prolazak kroz videe i njihovo dodavanje u carousel
    videos.forEach(video => {
        const videoElement = document.createElement('video');
        videoElement.src = video.video_url;
        videoElement.controls = true;
        const divElement = document.createElement('div');
        divElement.classList.add('item');
        divElement.appendChild(videoElement);
        carousel.appendChild(divElement);
    });

    // Inicijalizacija Owl Carousel-a nakon što se dodaju stavke
    $(".images_videos").owlCarousel({
        loop: false, 
        rewind: true, 
        nav: true,
        dots: false,
        autoplay: false, 
        margin: 24,
        autoWidth: true, 
        smartSpeed: 600, 
        navText: [
            '<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none"><path d="M15.5 18.5L9.5 12.5L15.5 6.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
            '<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none"><path d="M9.5 18.5L15.5 12.5L9.5 6.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
        ]
    });
}

// Funkcija za povlačenje slike Nikše
async function getNiksaImage() {
    let { data, error } = await supabase
      .from('images') 
      .select('image_url')
      .eq('id', 21); 

    if (error) {
      console.error(error);
      return null;
    }

    return data.length > 0 ? data[0].image_url : null;
}

// Funkcija za povlačenje slike Anđele
async function getAndjaImage() {
    let { data, error } = await supabase
      .from('images')  
      .select('image_url')
      .eq('id', 19); 

    if (error) {
      console.error(error);
      return null;
    }

    return data.length > 0 ? data[0].image_url : null;
}

// Funkcija za prikazivanje slika u delu "About Us"
async function displayAboutUsImages() {
    const niksaImage = await getNiksaImage();
    const andjaImage = await getAndjaImage();

    if (niksaImage) {
      const niksaImgElement = document.querySelector('.niksa_andja img[alt="niksa"]');
      niksaImgElement.src = niksaImage;
    }

    if (andjaImage) {
      const andjaImgElement = document.querySelector('.niksa_andja img[alt="andja"]');
      andjaImgElement.src = andjaImage;
    }
}

// Pozovi funkciju kada se stranica učita
window.onload = function() {
    getHeroImage();
    displayServiceImage();
    displayLogos();  
    displayWorkMedia();  
    displayAboutUsImages(); 
};
