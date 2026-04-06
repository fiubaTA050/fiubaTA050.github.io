(() => {
    const STORAGE_KEY = "ta050.theme";
    const THEMES = ["light", "dark"];
    const mediaQuery = window.matchMedia?.("(prefers-color-scheme: dark)");
  
    function getStoredTheme() {
      try {
        const value = localStorage.getItem(STORAGE_KEY);
        return THEMES.includes(value) ? value : null;
      } catch {
        return null;
      }
    }
  
    function getSystemTheme() {
      return mediaQuery?.matches ? "dark" : "light";
    }
  
    function setTheme(theme, { persist } = { persist: false }) {
      if (!THEMES.includes(theme)) return;
  
      document.documentElement.dataset.theme = theme;
      document.documentElement.style.colorScheme = theme;
  
      if (persist) {
        try {
          localStorage.setItem(STORAGE_KEY, theme);
        } catch {
          // ignore
        }
      }
  
      const btn = document.getElementById("theme-toggle");
      if (btn) renderButton(btn, theme);
    }
  
    function renderButton(btn, theme) {
      const isDark = theme === "dark";
      btn.setAttribute("aria-pressed", String(isDark));
      btn.setAttribute("aria-label", isDark ? "Activar modo día" : "Activar modo noche");
      btn.title = isDark ? "Activar modo día" : "Activar modo noche";
      btn.innerHTML = isDark
        ? `
          <svg class="theme-toggle__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
        `
        : `
          <svg class="theme-toggle__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"></circle>
            <path d="M12 2v2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
            <path d="M12 20v2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
            <path d="M4.93 4.93l1.41 1.41" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
            <path d="M17.66 17.66l1.41 1.41" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
            <path d="M2 12h2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
            <path d="M20 12h2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
            <path d="M4.93 19.07l1.41-1.41" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
            <path d="M17.66 6.34l1.41-1.41" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
          </svg>
        `;
    }
  
    function ensureToggleStyles() {
      if (document.getElementById("theme-toggle-styles")) return;
  
      const style = document.createElement("style");
      style.id = "theme-toggle-styles";
      style.textContent = `
        .theme-toggle {
          position: fixed;
          right: 16px;
          bottom: 16px;
          z-index: 9999;
          width: 44px;
          height: 44px;
          padding: 0;
          border-radius: 999px;
          border: 1px solid var(--border, #e8e8e8);
          background: var(--surface, #fff);
          color: var(--text, #111);
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
          font: inherit;
          line-height: 1;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          -webkit-tap-highlight-color: transparent;
        }
        .theme-toggle__icon {
          width: 22px;
          height: 22px;
          display: block;
        }
        .theme-toggle:hover {
          transform: translateY(-1px);
        }
        .theme-toggle:active {
          transform: translateY(0);
        }
        .theme-toggle:focus-visible {
          outline: 3px solid var(--focus, #2a7ae2);
          outline-offset: 2px;
        }
      `;
      document.head.appendChild(style);
    }
  
    function ensureToggleButton() {
      if (document.getElementById("theme-toggle")) return;
  
      const btn = document.createElement("button");
      btn.type = "button";
      btn.id = "theme-toggle";
      btn.className = "theme-toggle";
  
      const initialTheme = document.documentElement.dataset.theme || getStoredTheme() || getSystemTheme();
      renderButton(btn, initialTheme);
  
      btn.addEventListener("click", () => {
        const current = document.documentElement.dataset.theme || getSystemTheme();
        const next = current === "dark" ? "light" : "dark";
        setTheme(next, { persist: true });
      });
  
      document.body.appendChild(btn);
    }
  
    function init() {
      const stored = getStoredTheme();
      setTheme(stored || getSystemTheme(), { persist: false });
  
      ensureToggleStyles();
      ensureToggleButton();
  
      // If user didn't choose explicitly, follow OS changes.
      if (!mediaQuery) return;
      const onChange = () => {
        const storedNow = getStoredTheme();
        if (!storedNow) setTheme(getSystemTheme(), { persist: false });
      };
      if (typeof mediaQuery.addEventListener === "function") {
        mediaQuery.addEventListener("change", onChange);
      } else if (typeof mediaQuery.addListener === "function") {
        mediaQuery.addListener(onChange);
      }
    }
  
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
      init();
    }
  })();
  