export function initPagefind() {
  const root = document.querySelector<HTMLElement>('#pagefind-search');
  if (!root) return;
  const base = import.meta.env.BASE_URL;
  const css = document.createElement('link');
  css.rel = 'stylesheet'; css.href = `${base}pagefind/pagefind-ui.css`; document.head.append(css);
  const script = document.createElement('script');
  script.src = `${base}pagefind/pagefind-ui.js`;
  script.onload = () => {
    const PagefindUI = (window as unknown as { PagefindUI?: new (options: Record<string, unknown>) => unknown }).PagefindUI;
    if (PagefindUI) new PagefindUI({ element: '#pagefind-search', showSubResults: true, showImages: false, resetStyles: false, autofocus: false });
  };
  script.onerror = () => { root.innerHTML = '<p class="muted">Search index is not available in this preview. Run <code>npm run build</code> to generate it.</p>'; };
  document.body.append(script);
}