export const STORAGE_KEY = 'shortcutSettings';

export interface ShortcutBinding {
  code: string;
  altKey: boolean;
  shiftKey: boolean;
}

export interface ShortcutSettings {
  bindings: ShortcutBinding[];
}

export const DEFAULT_BINDING: ShortcutBinding = {
  code: 'Backquote',
  altKey: false,
  shiftKey: false,
};

export const DEFAULT_SETTINGS: ShortcutSettings = {
  bindings: [DEFAULT_BINDING],
};

const KEY_LABELS: Record<string, string> = {
  Backquote: '`',
  Escape: 'Esc',
  Period: '.',
  Comma: ',',
  Space: 'Space',
  Minus: '-',
  Equal: '=',
  BracketLeft: '[',
  BracketRight: ']',
  Backslash: '\\',
  Semicolon: ';',
  Quote: "'",
  Slash: '/',
};

export function labelKeyCode(code: string): string {
  if (KEY_LABELS[code]) {
    return KEY_LABELS[code];
  }
  if (code.startsWith('Key')) {
    return code.slice(3);
  }
  if (code.startsWith('Digit')) {
    return code.slice(5);
  }
  return code;
}

export function formatBinding(binding: ShortcutBinding): string {
  const isMac = navigator.platform.toLowerCase().includes('mac');
  const parts: string[] = [];

  parts.push(isMac ? '⌘' : 'Ctrl');
  if (binding.altKey) {
    parts.push(isMac ? '⌥' : 'Alt');
  }
  if (binding.shiftKey) {
    parts.push(isMac ? '⇧' : 'Shift');
  }
  parts.push(labelKeyCode(binding.code));

  return isMac ? parts.join('') : parts.join('+');
}

export function matchesBinding(
  event: KeyboardEvent,
  binding: ShortcutBinding,
): boolean {
  if (!(event.ctrlKey || event.metaKey)) {
    return false;
  }
  if (event.altKey !== binding.altKey) {
    return false;
  }
  if (event.shiftKey !== binding.shiftKey) {
    return false;
  }
  return event.code === binding.code;
}

export function bindingFromEvent(event: KeyboardEvent): ShortcutBinding | null {
  if (
    event.key === 'Control' ||
    event.key === 'Meta' ||
    event.key === 'Shift' ||
    event.key === 'Alt'
  ) {
    return null;
  }
  if (!(event.ctrlKey || event.metaKey)) {
    return null;
  }

  return {
    code: event.code,
    altKey: event.altKey,
    shiftKey: event.shiftKey,
  };
}

export async function getShortcutSettings(): Promise<ShortcutSettings> {
  const result = await chrome.storage.sync.get(STORAGE_KEY);
  const stored = result[STORAGE_KEY];
  if (
    stored === undefined ||
    typeof stored !== 'object' ||
    stored === null ||
    !Array.isArray((stored as ShortcutSettings).bindings)
  ) {
    return DEFAULT_SETTINGS;
  }
  return stored as ShortcutSettings;
}

export async function saveShortcutSettings(
  settings: ShortcutSettings,
): Promise<void> {
  await chrome.storage.sync.set({ [STORAGE_KEY]: settings });
}
