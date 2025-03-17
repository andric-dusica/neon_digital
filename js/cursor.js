document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener("mousemove", (e) => {
        const trail = document.createElement("div");
        trail.classList.add("cursor-trail");
        document.body.appendChild(trail);

        // Pozicija centriranja
        trail.style.left = `${e.clientX + window.scrollX - 2.5}px`;
        trail.style.top = `${e.clientY + window.scrollY - 2.5}px`;


        // Efekat animacije
        setTimeout(() => {
            trail.style.transform = "scale(2)";
            trail.style.opacity = "0";
        }, 10);

        // Uklanjanje traga posle 700ms
        setTimeout(() => {
            document.body.removeChild(trail);
        }, 700);
    });
});
