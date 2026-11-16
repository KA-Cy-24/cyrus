# Interactive modules

Interactive functionality is implemented once as a reusable module and embedded in any MDX document by ID.

## Add a module

Create a directory at `src/interactive/<module-id>/` containing:

- `manifest.json`
- `client.ts`

The directory name and manifest `id` must match.

Example `manifest.json`:

```json
{
  "id": "example-counter",
  "name": "Example counter",
  "description": "A minimal interactive module starter.",
  "version": "1.0.0"
}
```

Example `client.ts`:

```ts
export function mount(container: HTMLElement, props: Record<string, unknown>) {
  let count = Number(props.initial ?? 0);
  const output = document.createElement('output');
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = 'Increment';
  output.textContent = String(count);
  const increment = () => {
    count += 1;
    output.textContent = String(count);
  };
  button.addEventListener('click', increment);
  container.replaceChildren(output, button);

  return () => {
    button.removeEventListener('click', increment);
    container.replaceChildren();
  };
}
```

The registry discovers `client.ts` files with Vite's `import.meta.glob()` at build time. There is no central module list to edit.

## Embed in MDX

```mdx
<Interactive id="example-counter" initial={4} label="Counter demonstration" />
```

The component passes attributes as a props object to `mount(container, props)`. It also supplies `props.base` (Astro’s configured base URL) so modules can construct links to public assets safely on GitHub Pages. The module may return a cleanup function. Keep module styles scoped to the module's root class or use a shadow root if strict style isolation is needed.

## Safety and reliability

- Ordinary fenced JavaScript blocks are code examples; they do not execute.
- Do not use `eval`, `new Function`, or remote code loading.
- Validate user input before using it.
- Never embed secrets or private API keys in client-side modules.
- Provide accessible labels and keyboard-operable controls.
- Respect the active theme and reduced-motion preference.
- Return a cleanup function when adding listeners, observers, or timers.
