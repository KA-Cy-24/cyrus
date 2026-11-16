/** Prefix root-relative Markdown/MDX asset and link URLs with Astro's base path. */
export default function rehypeBasePath(options = {}) {
  const base = String(options.base ?? '').replace(/\/$/, '');
  if (!base) return (tree) => tree;
  const prefix = (value) => {
    if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) return value;
    if (value === base || value.startsWith(`${base}/`)) return value;
    return `${base}${value}`;
  };
  return (tree) => {
    const visit = (node) => {
      if (!node || typeof node !== 'object') return;
      if (node.properties && typeof node.properties === 'object') {
        for (const key of ['src', 'href', 'poster']) {
          if (typeof node.properties[key] === 'string') node.properties[key] = prefix(node.properties[key]);
        }
      }
      if (node.attributes && Array.isArray(node.attributes)) {
        for (const attribute of node.attributes) {
          if (['src', 'href', 'poster'].includes(attribute.name) && typeof attribute.value === 'string') {
            attribute.value = prefix(attribute.value);
          }
        }
      }
      if (Array.isArray(node.children)) node.children.forEach(visit);
    };
    visit(tree);
  };
}
