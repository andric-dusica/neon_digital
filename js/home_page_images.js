
import { supabase } from './supabase.js';

// Funkcija za povlačenje slike po ID-u iz baze
async function fetchImageById(id) {
    const { data, error } = await supabase
        .from('home_page')
        .select('*')
        .eq('id', id) // Filtriramo po ID-u
        .single(); // Vraća samo jedan rezultat

    if (error) {
        console.error(`Error fetching image with ID ${id}:`, error);
        return null;
    }

    return data; // Vraća podatke o slici
}

// Funkcija za postavljanje slike na osnovu ID-a iz baze i HTML ID-a elementa
async function updateImage(imageId, elementId) {
    const imageData = await fetchImageById(imageId);

    if (imageData) {
        const imgElement = document.getElementById(elementId);

        if (imgElement) {
            imgElement.src = imageData.image_url; // Postavlja URL slike
            imgElement.alt = imageData.description || 'Image'; // Postavlja ALT tekst

            // Dodajemo stilove kroz JS
            if (elementId === 'niksa_img' || elementId === 'andja_img') {
                imgElement.style.height = '344px'; // Postavljamo visinu
                imgElement.style.objectFit = 'cover'; // Osiguravamo ispravan fit
            }
        } else {
            console.error(`Element with ID ${elementId} not found.`);
            return;
        }
    }
}

// Postavljanje svih slika
updateImage(1, 'niksa_about_img'); // Prva slika sa ID 1
updateImage(2, 'niksa_img');       // Druga slika sa ID 2
updateImage(3, 'andja_img');       // Treća slika sa ID 3
