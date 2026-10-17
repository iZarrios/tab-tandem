import { THEME_STORAGE_KEY } from '@/lib/theme';

export default defineUnlistedScript(() => {
  try {
    const theme = localStorage.getItem(THEME_STORAGE_KEY);
    if (theme === 'dark') {
      document.documentElement.dataset.theme = 'dark';
    }
  } catch {
    /* ignore unavailable storage */
  }
});
