// Kreiraj klijent za Supabase
const { createClient } = window.supabase;
const supabaseUrl = 'https://gwodcdkzxwbepgxpxxvf.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3b2RjZGt6eHdiZXBneHB4eHZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjcwMzY2MTMsImV4cCI6MjA0MjYxMjYxM30.78W4s46xNHSPE22zQ2BiXyuoPVCg4gVUzJ3LEJqe31M';
export const supabase = createClient(supabaseUrl, supabaseKey);
// Funkcija za povlačenje hero slike iz PostgreSQL baze
async function getHeroImage() {
    try {
        let { data, error } = await supabase
            .from('hero_banner')  
            .select('hero_url')  
            .eq('id', 1) 
            .single(); // Očekujemo samo jedan rezultat, pojednostavljuje kod

        if (error) {
            console.error("Greška prilikom učitavanja hero slike:", error);
            return;
        }

        if (!data) {
            console.warn("Nema hero slike pronađene u bazi.");
            return;
        }

        
    } catch (err) {
        console.error("Došlo je do greške u komunikaciji sa Supabase:", err);
    }
}

// Pokreni funkciju kada se DOM učita
document.addEventListener("DOMContentLoaded", getHeroImage);
