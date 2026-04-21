const ThemeSwitcher = (() => {
    const STORAGE_KEY = "reservation_theme";
    const THEMES = ["moderna", "elegante"];
    const DEFAULT = "moderna";
 
    function apply(theme) {
        if (!THEMES.includes(theme)) theme = DEFAULT;
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem(STORAGE_KEY, theme);
        // Aggiorna eventuali indicatori UI
        document.querySelectorAll("[data-theme-indicator]").forEach(el => {
            el.textContent = theme.charAt(0).toUpperCase() + theme.slice(1);
        });
    }
 
    function get() {
        return localStorage.getItem(STORAGE_KEY) || DEFAULT;
    }
 
    function toggle() {
        const current = get();
        const next = THEMES[(THEMES.indexOf(current) + 1) % THEMES.length];
        apply(next);
    }
 
    function set(theme) {
        apply(theme);
    }
 
    function createToggleBtn() {
        const btn = document.createElement("button");
        btn.id = "theme-toggle-btn";
        btn.setAttribute("aria-label", "Cambia tema");
        btn.style.cssText = `
            background: transparent;
            border: 1px solid var(--color-border);
            border-radius: 50%;
            width: 36px;
            height: 36px;
            cursor: pointer;
            font-size: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
            padding: 0;
            color: var(--color-text);
        `;
        btn.addEventListener("mouseenter", () => {
            btn.style.background = "var(--color-bg)";
            btn.style.transform = "scale(1.1)";
        });
        btn.addEventListener("mouseleave", () => {
            btn.style.background = "transparent";
            btn.style.transform = "scale(1)";
        });
        btn.addEventListener("click", toggle);
        updateIcon(btn, get());
        return btn;
    }
 
    function updateIcon(btn, theme) {
        btn.textContent = theme === "elegante" ? "🌙" : "☀️";
        btn.title = theme === "elegante" ? "Passa a Moderna" : "Passa a Elegante";
    }
 
    function applyWithIcon(theme) {
        apply(theme);
        const btn = document.getElementById("theme-toggle-btn");
        if (btn) updateIcon(btn, theme);
    }
 
    // Inietta il bottone nell'header appena il DOM è pronto
    function injectBtn() {
        const userArea = document.querySelector(".header-user-area");
        if (userArea && !document.getElementById("theme-toggle-btn")) {
            const btn = createToggleBtn();
            userArea.prepend(btn);
        }
    }
 
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", injectBtn);
    } else {
        injectBtn();
    }
 
    // Applica il tema salvato appena lo script viene caricato
    apply(get());
 
    return { toggle: () => { const n = THEMES[(THEMES.indexOf(get()) + 1) % THEMES.length]; applyWithIcon(n); }, set: applyWithIcon, get };
})();