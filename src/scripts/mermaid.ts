export async function initMermaid() {
  const blocks = [...document.querySelectorAll<HTMLElement>('pre code.language-mermaid')];
  if (!blocks.length) return;
  const { default: mermaid } = await import('mermaid');
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'strict',
    theme: document.documentElement.dataset.theme === 'dark' ? 'dark' : 'neutral',
    fontFamily: 'Consolas, monospace'
  });
  blocks.forEach((code, index) => {
    const pre = code.closest('pre');
    if (!pre) return;
    const diagram = document.createElement('div');
    diagram.className = 'mermaid-diagram';
    diagram.id = `mermaid-${index + 1}`;
    diagram.textContent = code.textContent ?? '';
    pre.replaceWith(diagram);
  });
  await mermaid.run({ querySelector: '.mermaid-diagram' });
}