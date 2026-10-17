import { describe, expect, it } from 'vitest';
import {
  bindingFromEvent,
  formatBinding,
  labelKeyCode,
  matchesBinding,
  type ShortcutBinding,
} from '@/lib/shortcuts';

const backquote: ShortcutBinding = {
  code: 'Backquote',
  altKey: false,
  shiftKey: false,
};

function keydown(init: KeyboardEventInit): KeyboardEvent {
  return new KeyboardEvent('keydown', init);
}

describe('labelKeyCode', () => {
  it('maps punctuation, letters and digits', () => {
    expect(labelKeyCode('Backquote')).toBe('`');
    expect(labelKeyCode('KeyA')).toBe('A');
    expect(labelKeyCode('Digit7')).toBe('7');
    expect(labelKeyCode('F5')).toBe('F5');
  });
});

describe('formatBinding', () => {
  it('joins modifiers with + on non-mac platforms', () => {
    expect(formatBinding({ code: 'KeyK', altKey: true, shiftKey: true })).toBe(
      'Ctrl+Alt+Shift+K',
    );
  });
});

describe('matchesBinding', () => {
  it('matches with Ctrl or Meta', () => {
    expect(
      matchesBinding(keydown({ code: 'Backquote', ctrlKey: true }), backquote),
    ).toBe(true);
    expect(
      matchesBinding(keydown({ code: 'Backquote', metaKey: true }), backquote),
    ).toBe(true);
  });

  it('rejects missing Ctrl/Meta or mismatched modifiers', () => {
    expect(matchesBinding(keydown({ code: 'Backquote' }), backquote)).toBe(
      false,
    );
    expect(
      matchesBinding(
        keydown({ code: 'Backquote', ctrlKey: true, shiftKey: true }),
        backquote,
      ),
    ).toBe(false);
    expect(
      matchesBinding(keydown({ code: 'Period', ctrlKey: true }), backquote),
    ).toBe(false);
  });
});

describe('bindingFromEvent', () => {
  it('ignores lone modifier presses', () => {
    expect(
      bindingFromEvent(keydown({ key: 'Control', ctrlKey: true })),
    ).toBeNull();
  });

  it('requires Ctrl or Meta', () => {
    expect(bindingFromEvent(keydown({ key: 'a', code: 'KeyA' }))).toBeNull();
  });

  it('captures code and modifiers', () => {
    expect(
      bindingFromEvent(
        keydown({ key: 'K', code: 'KeyK', ctrlKey: true, shiftKey: true }),
      ),
    ).toEqual({ code: 'KeyK', altKey: false, shiftKey: true });
  });
});
