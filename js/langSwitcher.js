document.addEventListener("DOMContentLoaded", () => {
    const defaultLang = "en";
    const storedLang = localStorage.getItem("lang") || defaultLang;
  
    const langEn = document.getElementById("lang-en");
    const langSr = document.getElementById("lang-sr");
    const langEnMob = document.getElementById("lang-en-mob");
    const langSrMob = document.getElementById("lang-sr-mob");
  
    function toggleButtons(lang) {
      if (!langEn || !langSr || !langEnMob || !langSrMob) return;
  
      if (lang === "en") {
        // Desktop
        langEn.classList.add("opacity-0", "pointer-events-none");
        langEn.classList.remove("opacity-100", "pointer-events-auto");
  
        langSr.classList.remove("opacity-0", "pointer-events-none");
        langSr.classList.add("opacity-100", "pointer-events-auto");
  
        // Mobile
        langEnMob.classList.add("opacity-0", "pointer-events-none");
        langEnMob.classList.remove("opacity-100", "pointer-events-auto");
  
        langSrMob.classList.remove("opacity-0", "pointer-events-none");
        langSrMob.classList.add("opacity-100", "pointer-events-auto");
      } else {
        // Desktop
        langEn.classList.remove("opacity-0", "pointer-events-none");
        langEn.classList.add("opacity-100", "pointer-events-auto");
  
        langSr.classList.add("opacity-0", "pointer-events-none");
        langSr.classList.remove("opacity-100", "pointer-events-auto");
  
        // Mobile
        langEnMob.classList.remove("opacity-0", "pointer-events-none");
        langEnMob.classList.add("opacity-100", "pointer-events-auto");
  
        langSrMob.classList.add("opacity-0", "pointer-events-none");
        langSrMob.classList.remove("opacity-100", "pointer-events-auto");
      }
    }
  
    toggleButtons(storedLang);
  
    langEn?.addEventListener("click", () => {
      localStorage.setItem("lang", "en");
      location.reload();
    });
  
    langSr?.addEventListener("click", () => {
      localStorage.setItem("lang", "sr");
      location.reload();
    });
  
    langEnMob?.addEventListener("click", () => {
      localStorage.setItem("lang", "en");
      location.reload();
    });
  
    langSrMob?.addEventListener("click", () => {
      localStorage.setItem("lang", "sr");
      location.reload();
    });
  });
  