// Inicijalizacija Supabase klijenta
import { supabase } from './supabase.js';

// Funkcija za povlačenje logotipa iz baze
async function fetchLogos() {
  try {
    const { data, error } = await supabase
      .from("client_logo")
      .select("client_logo_url");

    if (error) {
      console.error("Greška prilikom povlačenja logotipa:", error);
      return [];
    }

    return data;
  } catch (err) {
    console.error("Greška u komunikaciji sa Supabase:", err);
    return [];
  }
}

// Funkcija za prikazivanje logotipa u HTML-u
async function displayLogos() {
  const container = document.querySelector(".clients_logos");

  if (!container) {
    console.error("Element .clients_logos nije pronađen!");
    return;
  }

  const logos = await fetchLogos();

  if (logos.length === 0) {
    console.warn("Nema logotipa za prikazivanje.");
    container.innerHTML = "<p style='color: white;'>No logos found.</p>";
    return;
  }

  // Dodavanje logotipa u HTML i dupliranje x10
  for (let i = 0; i < 10; i++) {
    logos.forEach((logo) => {
      const img = document.createElement("img");
      img.src = logo.client_logo_url;
      img.alt = "Client Logo";
      img.classList.add("client-logo");
      container.appendChild(img);
    });
  }

  startInfiniteScroll(container);
}

// Funkcija za beskonačnu animaciju logotipa
function startInfiniteScroll(container) {
  const totalWidth = container.scrollWidth; // Ukupna širina logotipa
  const step = 0.5; // Korak pomeranja
  let scrollPosition = 0;

  function animate() {
    scrollPosition -= step;

    // Resetuj poziciju bez prekida
    if (Math.abs(scrollPosition) >= totalWidth / 2) {
      scrollPosition = 0;
    }

    container.style.transform = `translateX(${scrollPosition}px)`;
    requestAnimationFrame(animate);
  }

  // Pokreni animaciju
  requestAnimationFrame(animate);
}

// Pozovi funkciju kada se stranica učita
window.addEventListener("DOMContentLoaded", displayLogos);
