function normalize(value: string) { return value.trim().toLocaleLowerCase(); }
export function initFilters() {
  document.querySelectorAll<HTMLElement>('[data-filter-root]').forEach((root) => {
    const search = root.querySelector<HTMLInputElement>('[data-filter-search]');
    const category = root.querySelector<HTMLSelectElement>('[data-filter-category]');
    const status = root.querySelector<HTMLSelectElement>('[data-filter-status]');
    const type = root.querySelector<HTMLSelectElement>('[data-filter-type]');
    const year = root.querySelector<HTMLSelectElement>('[data-filter-year]');
    const tag = root.querySelector<HTMLSelectElement>('[data-filter-tag]');
    const list = root.parentElement?.querySelector<HTMLElement>('[data-filter-list]');
    const count = root.parentElement?.querySelector<HTMLElement>('[data-filter-count]');
    const empty = root.parentElement?.querySelector<HTMLElement>('[data-filter-empty]');
    if (!list) return;
    const items = [...list.querySelectorAll<HTMLElement>('[data-filter-item]')];
    const update = () => {
      const q = normalize(search?.value ?? '');
      const c = normalize(category?.value ?? '');
      const s = normalize(status?.value ?? '');
      const ty = normalize(type?.value ?? '');
      const y = normalize(year?.value ?? '');
      const t = normalize(tag?.value ?? '');
      let visible = 0;
      items.forEach((item) => {
        const text = normalize(item.dataset.search ?? '');
        const itemCategory = normalize(item.dataset.category ?? '');
        const itemStatus = normalize(item.dataset.status ?? '');
        const itemType = normalize(item.dataset.type ?? '');
        const itemYear = normalize(item.dataset.year ?? '');
        const itemTags = (item.dataset.tag ?? '').split('|').map(normalize);
        const match = (!q || text.includes(q)) && (!c || itemCategory === c) && (!s || itemStatus === s) && (!ty || itemType === ty) && (!y || itemYear === y) && (!t || itemTags.includes(t));
        item.hidden = !match;
        if (match) visible++;
      });
      if (count) count.textContent = `${visible} of ${items.length} entries`;
      if (empty) empty.hidden = visible > 0;
    };
    [search, category, status, type, year, tag].filter(Boolean).forEach((control) => control!.addEventListener('input', update));
    update();
  });
}
initFilters();