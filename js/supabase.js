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


// Pozovi funkciju kada se stranica učita
window.onload = function() {
    getHeroImage();
};
