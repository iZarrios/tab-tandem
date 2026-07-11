import {
  DEFAULT_SETTINGS,
  STORAGE_KEY,
  matchesBinding,
  type ShortcutSettings,
} from "./shortcuts.js";

let settings: ShortcutSettings = DEFAULT_SETTINGS;

async function loadSettings(): Promise<void> {
  const result = await chrome.storage.sync.get(STORAGE_KEY);
  const stored = result[STORAGE_KEY];
  if (
    stored !== undefined &&
    typeof stored === "object" &&
    stored !== null &&
    Array.isArray((stored as ShortcutSettings).bindings)
  ) {
    settings = stored as ShortcutSettings;
  }
}

void loadSettings();

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "sync" || changes[STORAGE_KEY] === undefined) {
    return;
  }
  const next = changes[STORAGE_KEY].newValue;
  settings =
    next !== undefined &&
    typeof next === "object" &&
    next !== null &&
    Array.isArray((next as ShortcutSettings).bindings)
      ? (next as ShortcutSettings)
      : DEFAULT_SETTINGS;
});

document.addEventListener(
  "keydown",
  (event) => {
    if (!settings.bindings.some((binding) => matchesBinding(event, binding))) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    chrome.runtime.sendMessage({ type: "swap-last-tab" });
  },
  true,
);
