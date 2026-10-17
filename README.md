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

## Install

Download `tab-tandem-<version>-chrome.zip` from the latest
[GitHub release](https://github.com/iZarrios/tab-tandem/releases) and unzip it,
or build it yourself (see [Development](#development)). Then:

1. Open `chrome://extensions`
2. Enable **Developer mode** (top-right)
3. Click **Load unpacked** and select the unzipped folder (or
   `.output/chrome-mv3` when building locally).

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

## How it works

- Background service worker (`src/entrypoints/background.ts`) tracks the current and previous
  tab id for each window in `chrome.storage.session` (survives worker
  suspension).
- `chrome.tabs.onActivated` keeps the per-window history up to date.
- `chrome.commands.onCommand` performs the swap after verifying the target tab
  still exists.
- `chrome.windows.onRemoved` garbage-collects stored history for closed windows.

## Development

Requirements: Node.js 24+, Corepack, and a Chromium-based browser.

```bash
corepack enable
pnpm install
pnpm dev
```

Load `.output/chrome-mv3-dev` when running `pnpm dev`, and keep that process
running so WXT rebuilds it as files change.

Build and package:

```bash
pnpm build   # .output/chrome-mv3
pnpm zip     # .output/tab-tandem-<version>-chrome.zip
```

## Testing

```bash
pnpm check
```

`pnpm check` runs type checking, linting, unit tests, and creates the production
extension ZIP.
