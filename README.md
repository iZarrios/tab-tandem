<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/readme-logo-dark.png">
    <source media="(prefers-color-scheme: light)" srcset="docs/readme-logo-light.png">
    <img src="docs/readme-logo-light.png" alt="TabTandem logo" width="96">
  </picture>
</p>

<h1 align="center">TabTandem</h1>

<p align="center">
  A Chromium-based extension that toggles between the two most recently visited tabs.
</p>

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

| Binding                       | How it works                                              |
| ----------------------------- | -------------------------------------------------------- |
| <kbd>Ctrl</kbd> + <kbd>`</kbd> (Backquote) | Injected content script captures the key globally |
| <kbd>Ctrl</kbd> + <kbd>.</kbd>  (fallback) | Native manifest command (`commands` API)         |

Click the TabTandem toolbar icon to change the page shortcuts or open
Chrome's extension shortcuts page for the fallback command.

> Chrome's `commands` API does **not** support the backtick (`` ` ``) key
> (only letters, digits, `Comma`, `Period`, `Space`, arrows,
> `Insert`, `Delete`, and media keys). To honor that key, a content
> script injected into every page listens for `Ctrl`/`Cmd` + Backquote
> and messages the background worker to perform the swap. The native
> `Ctrl+.` command remains as a fallback and is remappable.

## Limitations

- The content-script hotkey only fires while a normal web page has focus. It
  cannot trigger from `chrome://` pages (including the New Tab page) or when no
  tab is focused, because content scripts are not injected there.
- It requires host permission for `<all_urls>` so the script can run on every
  page.

## Remap shortcuts

- **Page shortcut** (`Ctrl`/`Cmd` + key): click the TabTandem toolbar icon and
  press **Shortcut** to record a new binding.
- **Fallback command** (`Ctrl+.` by default): click **Change in Chrome…** in the
  popup, or open `chrome://extensions/shortcuts` manually and find
  **TabTandem** → **Swap to the previously active tab in the current window**.

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
