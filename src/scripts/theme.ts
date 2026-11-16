export function initTheme() {
  const root = document.documentElement;
  const buttons = document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]');
  const setTheme = (theme: 'light' | 'dark') => {
    root.dataset.theme = theme;
    try { localStorage.setItem('kl-theme', theme); } catch { /* storage may be unavailable */ }
    buttons.forEach((button) => button.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'));
  };
  const initial = root.dataset.theme === 'dark' ? 'dark' : 'light';
  setTheme(initial);
  buttons.forEach((button) => button.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark')));
}