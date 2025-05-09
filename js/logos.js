import { supabase } from './supabase.js';

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

async function displayLogos() {
  const container = document.querySelector(".clients_logos");

  if (!container) {
    console.error("Element .clients_logos nije pronađen!");
    return;
  }

  const logos = await fetchLogos();

  if (logos.length === 0) {
    container.innerHTML = "<p style='color: white;'>No logos found.</p>";
    return;
  }

  container.innerHTML = "";

  const wrapper = document.createElement("div");
  wrapper.classList.add("logos_wrapper");

  for (let i = 0; i < 3; i++) {
    logos.forEach((logo) => {
      const img = document.createElement("img");
      img.src = logo.client_logo_url;
      img.alt = "Client Logo";
      img.classList.add("client-logo");
      wrapper.appendChild(img);
    });
  }

  container.appendChild(wrapper);

  startInfiniteScroll(wrapper);
}

function startInfiniteScroll(wrapper) {
  let scrollPosition = 0;
  const speed = 1;

  function animate() {
    scrollPosition -= speed;

    if (Math.abs(scrollPosition) >= wrapper.scrollWidth / 3) {
      scrollPosition = 0;
    }

    wrapper.style.transform = `translateX(${scrollPosition}px)`;
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

window.addEventListener("DOMContentLoaded", displayLogos);

document.addEventListener("DOMContentLoaded", () => {
  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  if (isMobile) {
    const observer = new MutationObserver(() => {
      document.querySelectorAll(".owl-stage-outer").forEach(el => {
        el.style.overflow = "visible";
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }
});
