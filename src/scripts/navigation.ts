export function initNavigation() {
  const button = document.querySelector<HTMLButtonElement>('.menu-toggle');
  const nav = document.querySelector<HTMLElement>('#primary-navigation');
  const scrim = document.querySelector<HTMLElement>('[data-nav-scrim]');
  if (!button || !nav || !scrim) return;
  const close = () => {
    nav.classList.remove('is-open'); scrim.classList.remove('is-visible');
    button.setAttribute('aria-expanded', 'false'); button.setAttribute('aria-label', 'Open navigation');
    document.body.classList.remove('nav-open');
  };
  button.addEventListener('click', () => {
    const opening = !nav.classList.contains('is-open');
    nav.classList.toggle('is-open', opening); scrim.classList.toggle('is-visible', opening);
    button.setAttribute('aria-expanded', String(opening)); button.setAttribute('aria-label', opening ? 'Close navigation' : 'Open navigation');
    document.body.classList.toggle('nav-open', opening);
  });
  scrim.addEventListener('click', close);
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', close));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') close(); });
}