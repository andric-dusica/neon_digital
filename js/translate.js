document.addEventListener("DOMContentLoaded", async () => {
    const lang = localStorage.getItem("lang") || "en";
    
    try {
      const response = await fetch(`locales/${lang}.json`);
      const translations = await response.json();
    
      document.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.getAttribute("data-i18n");
        const value = key.split(".").reduce((acc, part) => acc?.[part], translations);
        if (value) {
          if (el.tagName.toLowerCase() === 'input' || el.tagName.toLowerCase() === 'textarea') {
            el.setAttribute("placeholder", value); 
          } else {
            el.innerHTML = value; 
          }
        }
      });
    } catch (error) {
      console.error("Failed to load translations:", error);
    }
});
