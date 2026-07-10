# Tab Swapper

A Manifest V3 Chrome extension that toggles between your two most recently
visited tabs in the **current window** using a keyboard shortcut.

## Install (load unpacked)

1. `npm install`
2. `npm run build` (outputs `dist/background.js`)
3. Open `chrome://extensions`
4. Enable **Developer mode** (top-right)
5. Click **Load unpacked** and select this project folder (the one containing
   `manifest.json`).

## Usage

Press the shortcut to jump back to the previous tab in the current window, and
press it again to jump forward. History is scoped per window, internal pages
(`chrome://`, `chrome-extension://`, `about:`) are ignored, and closed tabs are
handled gracefully.

## Default shortcut

| Platform | Key                                |
| -------- | ---------------------------------- |
| macOS    | <kbd>Command</kbd> + <kbd>.</kbd>  |
| Others   | <kbd>Ctrl</kbd> + <kbd>.</kbd>     |

> Note: Chrome's `commands` API does **not** support the backtick (`` ` ``) or
> `Escape` keys as shortcuts (only letters, digits, `Comma`, `Period`, `Space`,
> arrows, `Insert`, `Delete`, and media keys). `Ctrl` is automatically mapped to
> `Command` on macOS, so a single `Ctrl+Period` default works on every platform.

## Remap the shortcut

Chrome lets you rebind command shortcuts at `chrome://extensions/shortcuts`
(click the puzzle icon → gear, or navigate directly). Common alternatives that
the API supports:

- <kbd>Ctrl</kbd> + <kbd>,</kbd> (Ctrl + Comma)
- <kbd>Ctrl</kbd> + <kbd>Space</kbd>

Simply find **Tab Swapper** → **Swap to the previously active tab in the current
window** and click the input to set a new binding.

## How it works

- Background service worker (`src/background.ts`) tracks the current and previous
  tab id for each window in `chrome.storage.session` (survives worker
  suspension).
- `chrome.tabs.onActivated` keeps the per-window history up to date.
- `chrome.commands.onCommand` performs the swap after verifying the target tab
  still exists.
- `chrome.windows.onRemoved` garbage-collects stored history for closed windows.

## Build

```bash
npm install
npm run build
```
