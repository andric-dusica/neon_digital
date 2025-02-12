function toggleMobileMenu() {
    const mobileMenu = document.getElementById("mobile-menu");
    const menuIcon = document.getElementById("menu-icon");
    const overlay = document.getElementById("menu-overlay");
    const body = document.body;
    const nav = document.querySelector("nav");
    const footer = document.querySelector("footer");

    if (!mobileMenu || !menuIcon || !overlay || !nav || !footer) return;

    const isOpen = mobileMenu.classList.contains("active");

    if (isOpen) {
        closeMobileMenu();
    } else {
        mobileMenu.classList.remove("hidden");
        setTimeout(() => mobileMenu.classList.add("active"), 10); 
        overlay.classList.remove("hidden");
        menuIcon.src = "/images/close_icon.svg"; 

        body.classList.add("no-scroll");
        nav.classList.add("nav_position");
        footer.classList.add("footer_position");
    }
}

function closeMobileMenu(callback) {
    const mobileMenu = document.getElementById("mobile-menu");
    const menuIcon = document.getElementById("menu-icon");
    const overlay = document.getElementById("menu-overlay");
    const body = document.body;
    const nav = document.querySelector("nav");
    const footer = document.querySelector("footer");

    if (!mobileMenu || !menuIcon || !overlay || !nav || !footer) return;

    mobileMenu.classList.remove("active");
    overlay.classList.add("hidden");
    menuIcon.src = "/images/mob_menu_icon.svg";

    body.classList.remove("no-scroll");
    nav.classList.remove("nav_position");
    footer.classList.remove("footer_position");

    setTimeout(() => {
        mobileMenu.classList.add("hidden");
        if (callback) callback(); 
    }, 500); 
}

export { toggleMobileMenu, closeMobileMenu };
