type InteractiveModule = {
  mount: (container: HTMLElement, props: Record<string, unknown>) => void | (() => void) | Promise<void | (() => void)>;
};

const loaders = import.meta.glob<InteractiveModule>('../interactive/*/client.ts');
const mounted = new WeakSet<HTMLElement>();
const cleanups = new WeakMap<HTMLElement, () => void>();

export async function initInteractiveModules(root: ParentNode = document) {
  const hosts = new Set<HTMLElement>();
  if (root instanceof HTMLElement && root.matches('[data-interactive-id]')) hosts.add(root);
  root.querySelectorAll<HTMLElement>('[data-interactive-id]').forEach((host) => hosts.add(host));
  for (const host of hosts) {
    if (mounted.has(host)) continue;
    mounted.add(host);
    const id = host.dataset.interactiveId ?? '';
    const loader = loaders[`../interactive/${id}/client.ts`];
    if (!loader) {
      host.classList.add('interactive-error');
      host.textContent = `Interactive module "${id}" is not registered in src/interactive/.`;
      continue;
    }
    try {
      const module = await loader();
      if (typeof module.mount !== 'function') throw new Error('Module must export a mount(container, props) function.');
      const props = JSON.parse(host.dataset.interactiveProps ?? '{}') as Record<string, unknown>;
      const cleanup = await module.mount(host, props);
      if (typeof cleanup === 'function') cleanups.set(host, cleanup);
      host.classList.add('interactive-ready');
    } catch (error) {
      host.classList.add('interactive-error');
      host.textContent = error instanceof Error ? `Could not load interactive module: ${error.message}` : 'Could not load interactive module.';
    }
  }
}

if (typeof document !== 'undefined') {
  const run = () => void initInteractiveModules();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run, { once: true });
  else run();
  const observer = new MutationObserver((records) => records.forEach((record) => {
    record.addedNodes.forEach((node) => { if (node instanceof HTMLElement) void initInteractiveModules(node); });
    record.removedNodes.forEach((node) => {
      if (!(node instanceof HTMLElement)) return;
      const removed = node.matches('[data-interactive-id]') ? [node] : [...node.querySelectorAll<HTMLElement>('[data-interactive-id]')];
      removed.forEach((host) => { cleanups.get(host)?.(); cleanups.delete(host); mounted.delete(host); });
    });
  }));
  observer.observe(document.documentElement, { childList: true, subtree: true });
}
