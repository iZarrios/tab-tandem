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

| Binding                       | How it works                                              |
| ----------------------------- | -------------------------------------------------------- |
| <kbd>Ctrl</kbd> + <kbd>`</kbd> (Backquote) | Injected content script captures the key globally |
| <kbd>Ctrl</kbd> + <kbd>Escape</kbd>        | Injected content script captures the key globally |
| <kbd>Ctrl</kbd> + <kbd>.</kbd>  (fallback) | Native manifest command (`commands` API)         |

> Chrome's `commands` API does **not** support the backtick (`` ` ``) or
> `Escape` keys (only letters, digits, `Comma`, `Period`, `Space`, arrows,
> `Insert`, `Delete`, and media keys). To honor those exact keys, a content
> script injected into every page listens for `Ctrl`/`Cmd` + Backquote or Escape
> and messages the background worker to perform the swap. The native
> `Ctrl+.` command remains as a fallback and is remappable.

## Limitations

- The content-script hotkey only fires while a normal web page has focus. It
  cannot trigger from `chrome://` pages (including the New Tab page) or when no
  tab is focused, because content scripts are not injected there.
- It requires host permission for `<all_urls>` so the script can run on every
  page.

## Remap the fallback command

The native `Ctrl+.` command can be rebound at `chrome://extensions/shortcuts`
(click the puzzle icon → gear, or navigate directly): find **Tab Swapper** →
**Swap to the previously active tab in the current window** and click the input.

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
