export function ariaAssertiveMessage(message) {
  const ariaAssertiveRegion = document.getElementById("aria-assertive");
  const el = document.createElement("p");
  el.textContent = message;
  ariaAssertiveRegion.appendChild(el);

  setTimeout(() => {
    el.remove();
  }, 100);
}

export function ariaPoliteMessage(message) {
  const ariaPoliteRegion = document.getElementById("aria-polite");
  const el = document.createElement("p");
  el.textContent = message;
  ariaPoliteRegion.appendChild(el);

  setTimeout(() => {
    el.remove();
  }, 100);
}
