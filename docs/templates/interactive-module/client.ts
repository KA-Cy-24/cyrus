export function mount(container: HTMLElement, props: Record<string, unknown>) {
  const message = document.createElement('p');
  message.textContent = String(props.message ?? 'Your interactive module is mounted.');
  container.replaceChildren(message);

  return () => {
    container.replaceChildren();
  };
}