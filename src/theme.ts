export const THEME_STORAGE_KEY = "tabtandem-popup-theme";

export type PopupTheme = "light" | "dark";

export function loadTheme(): PopupTheme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark") {
      return stored;
    }
  } catch {
    /* ignore unavailable storage */
  }
  return "light";
}

export function persistTheme(theme: PopupTheme): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* ignore unavailable storage */
  }
}

export function applyTheme(theme: PopupTheme): void {
  document.documentElement.dataset.theme = theme;
}
