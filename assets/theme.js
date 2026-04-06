(() => {
  const KEY = "ta050.theme";
  const html = document.documentElement;
  const mq = matchMedia("(prefers-color-scheme: dark)");

  const SUN_SVG = `<svg class="theme-toggle__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"></circle>
    <path d="M12 2v2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
    <path d="M12 20v2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
    <path d="M4.93 4.93l1.41 1.41" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
    <path d="M17.66 17.66l1.41 1.41" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
    <path d="M2 12h2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
    <path d="M20 12h2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
    <path d="M4.93 19.07l1.41-1.41" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
    <path d="M17.66 6.34l1.41-1.41" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
  </svg>`;

  const MOON_SVG = `<svg class="theme-toggle__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
  </svg>`;

  function apply(theme) {
    html.dataset.theme = theme;
    html.style.colorScheme = theme;
    const btn = document.getElementById("theme-toggle");
    if (btn) {
      btn.innerHTML = theme === "dark" ? MOON_SVG : SUN_SVG;
      btn.setAttribute("aria-label",
        theme === "dark" ? "Activar modo día" : "Activar modo noche");
    }
  }

  function stored() {
    try { return localStorage.getItem(KEY); } catch { return null; }
  }

  function toggle() {
    const next = (html.dataset.theme || "light") === "dark" ? "light" : "dark";
    try { localStorage.setItem(KEY, next); } catch {}
    apply(next);
  }

  function ensureToggleButton() {
    if (document.getElementById("theme-toggle")) return;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.id = "theme-toggle";
    btn.className = "theme-toggle";
    btn.addEventListener("click", toggle);
    document.body.appendChild(btn);
    apply(html.dataset.theme || "light");
  }

  apply(stored() || "light");

  mq.addEventListener("change", () => {
    if (!stored()) apply(mq.matches ? "dark" : "light");
  });

  document.addEventListener("DOMContentLoaded", ensureToggleButton);
})();
