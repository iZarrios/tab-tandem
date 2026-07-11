import {
  DEFAULT_SETTINGS,
  bindingFromEvent,
  formatBinding,
  getShortcutSettings,
  saveShortcutSettings,
  type ShortcutBinding,
  type ShortcutSettings,
} from "./shortcuts.js";
import {
  applyTheme,
  loadTheme,
  persistTheme,
  type PopupTheme,
} from "./theme.js";

const primaryInput = document.getElementById("primary-shortcut") as HTMLButtonElement;
const fallbackShortcut = document.getElementById("fallback-shortcut") as HTMLElement;
const openShortcutsButton = document.getElementById(
  "open-shortcuts",
) as HTMLButtonElement;
const status = document.getElementById("status") as HTMLElement;
const themeToggle = document.getElementById("theme-toggle") as HTMLButtonElement;

let settings: ShortcutSettings = DEFAULT_SETTINGS;
let recording = false;

function updateThemeToggle(theme: PopupTheme): void {
  const isDark = theme === "dark";
  themeToggle.setAttribute(
    "aria-label",
    isDark ? "Switch to light mode" : "Switch to dark mode",
  );
  themeToggle.title = isDark ? "Switch to light mode" : "Switch to dark mode";
}

function primaryBinding(): ShortcutBinding {
  return settings.bindings[0] ?? DEFAULT_SETTINGS.bindings[0];
}

function setStatus(message: string): void {
  status.textContent = message;
}

function renderShortcut(): void {
  primaryInput.textContent = formatBinding(primaryBinding());
}

async function renderFallback(): Promise<void> {
  const commands = await chrome.commands.getAll();
  const command = commands.find((entry) => entry.name === "toggle-last-tab");
  fallbackShortcut.textContent = command?.shortcut?.trim() || "Not set";
}

async function persist(): Promise<void> {
  await saveShortcutSettings(settings);
  setStatus("Saved");
}

async function init(): Promise<void> {
  const theme = loadTheme();
  applyTheme(theme);
  updateThemeToggle(theme);
  settings = await getShortcutSettings();
  renderShortcut();
  await renderFallback();
}

themeToggle.addEventListener("click", () => {
  const next: PopupTheme = loadTheme() === "light" ? "dark" : "light";
  applyTheme(next);
  updateThemeToggle(next);
  persistTheme(next);
});

primaryInput.addEventListener("click", () => {
  recording = true;
  primaryInput.classList.add("recording");
  primaryInput.textContent = "Press shortcut…";
  setStatus("Press the keys you want to use");
});

openShortcutsButton.addEventListener("click", () => {
  chrome.tabs.create({ url: "chrome://extensions/shortcuts" });
});

document.addEventListener("keydown", async (event) => {
  if (!recording) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();

  if (event.key === "Escape") {
    recording = false;
    primaryInput.classList.remove("recording");
    renderShortcut();
    setStatus("");
    return;
  }

  const binding = bindingFromEvent(event);
  if (binding === null) {
    return;
  }

  recording = false;
  primaryInput.classList.remove("recording");
  settings = { bindings: [binding] };
  renderShortcut();
  await persist();
});

void init();
