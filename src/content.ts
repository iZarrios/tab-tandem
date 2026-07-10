const TARGET_KEYS = ["Backquote", "Escape"];

document.addEventListener(
  "keydown",
  (event) => {
    if (event.altKey || event.shiftKey) {
      return;
    }
    if (!(event.ctrlKey || event.metaKey)) {
      return;
    }
    if (!TARGET_KEYS.includes(event.code)) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    chrome.runtime.sendMessage({ type: "swap-last-tab" });
  },
  true,
);
