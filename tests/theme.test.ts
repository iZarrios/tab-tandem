import { beforeEach, describe, expect, it } from 'vitest';
import {
  applyTheme,
  loadTheme,
  persistTheme,
  THEME_STORAGE_KEY,
} from '@/lib/theme';

describe('theme', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('defaults to light', () => {
    expect(loadTheme()).toBe('light');
  });

  it('ignores unknown stored values', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'sepia');
    expect(loadTheme()).toBe('light');
  });

  it('round-trips a persisted theme', () => {
    persistTheme('dark');
    expect(loadTheme()).toBe('dark');
  });

  it('applies the theme to the root element', () => {
    applyTheme('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
  });
});
