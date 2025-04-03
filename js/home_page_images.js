import { supabase } from './supabase.js';

// Funkcija za povlačenje slike po ID-u iz baze
async function fetchImageById(id) {
    const { data, error } = await supabase
        .from('home_page')
        .select('*')
        .eq('id', id) 
        .single(); 

    if (error) {
        console.error(`Error fetching image with ID ${id}:`, error);
        return null;
    }

    return data; 
}

// Funkcija za postavljanje slike na osnovu ID-a iz baze i HTML ID-a elementa
async function updateImage(imageId, elementId) {
    const imageData = await fetchImageById(imageId);

    if (imageData) {
        const imgElement = document.getElementById(elementId);

        if (imgElement) {
            imgElement.src = imageData.image_url; 
            imgElement.alt = imageData.description || 'Image'; 

            if (elementId === 'niksa_about_img' || elementId === 'niksa_about_img_desktop') {
                imgElement.style.objectFit = 'cover';
            }
        } else {
            console.error(`Element with ID ${elementId} not found.`);
        }
    }
}

updateImage(1, 'niksa_about_img');          
updateImage(1, 'niksa_about_img_desktop');  
updateImage(2, 'niksa_img');                
updateImage(3, 'andja_img');               
