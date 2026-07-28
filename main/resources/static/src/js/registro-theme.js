/**
 * ==========================================================
 * AbrazaMente
 * Registro — Theme Toggle
 * ==========================================================
 */

class ThemeManager {

    constructor() {

        this.html = document.documentElement;
        this.button = document.getElementById("theme-toggle");
        this.storageKey = "theme";
        this.defaultTheme = "light";

    }

    init() {

        if (!this.button) {
            return;
        }

        this.loadTheme();

        this.button.addEventListener(
            "click",
            () => this.toggleTheme()
        );

    }

    getSavedTheme() {
        return localStorage.getItem(this.storageKey);
    }

    saveTheme(theme) {
        localStorage.setItem(this.storageKey, theme);
    }

    getSystemTheme() {
        return window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
    }

    applyTheme(theme) {
        this.html.setAttribute("data-theme", theme);
    }

    loadTheme() {

        const theme =
            this.getSavedTheme()
            ?? this.getSystemTheme()
            ?? this.defaultTheme;

        this.applyTheme(theme);

    }

    toggleTheme() {

        const current = this.html.getAttribute("data-theme");
        const next = current === "dark" ? "light" : "dark";

        this.applyTheme(next);
        this.saveTheme(next);

    }

}

document.addEventListener(
    "DOMContentLoaded",
    () => {
        const theme = new ThemeManager();
        theme.init();
    }
);
