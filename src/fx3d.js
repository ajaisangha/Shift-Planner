const SPOT =
  ".data-card, .subcard, .sub-card, .staff-group-card, .pick-subcard, .barcode-subcard, .shift-subcard";

export function initFx3d() {
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
    return () => {};
  }

  const root = document.documentElement;
  let frame = 0;

  const onMove = (event) => {
    if (frame) return;

    const { clientX, clientY, target } = event;

    frame = requestAnimationFrame(() => {
      frame = 0;

      root.style.setProperty(
        "--fx-x",
        `${(clientX / window.innerWidth) * 100}%`
      );
      root.style.setProperty(
        "--fx-y",
        `${(clientY / window.innerHeight) * 100}%`
      );

      let element = target instanceof Element ? target.closest(SPOT) : null;

      while (element) {
        const rect = element.getBoundingClientRect();
        element.style.setProperty("--mx", `${clientX - rect.left}px`);
        element.style.setProperty("--my", `${clientY - rect.top}px`);
        element = element.parentElement?.closest(SPOT) ?? null;
      }
    });
  };

const spawnBubbles = (x, y) => {
  if (document.documentElement.getAttribute("data-water") !== "on") return;

  for (let i = 0; i < 7; i += 1) {

const spawnBubbles = (x, y) => {
  for (let i = 0; i < 7; i += 1) {
    const bubble = document.createElement("span");
    const size = 5 + Math.random() * 9;

    bubble.className = "fx-bubble";
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${x + (Math.random() - 0.5) * 36}px`;
    bubble.style.top = `${y + (Math.random() - 0.5) * 12}px`;
    bubble.style.setProperty("--drift", `${(Math.random() - 0.5) * 50}px`);
    bubble.style.animationDuration = `${0.9 + Math.random() * 0.8}s`;

    document.body.appendChild(bubble);
    window.setTimeout(() => bubble.remove(), 1800);
  }
};

  const onDown = (event) => {
    const button =
      event.target instanceof Element ? event.target.closest("button") : null;

    if (!button || button.disabled) return;

    const rect = button.getBoundingClientRect();
    button.style.setProperty("--rx", `${event.clientX - rect.left}px`);
    button.style.setProperty("--ry", `${event.clientY - rect.top}px`);

    button.classList.remove("fx-ripple");
    void button.offsetWidth;
    button.classList.add("fx-ripple");
    window.setTimeout(() => button.classList.remove("fx-ripple"), 700);

    const ring = document.createElement("div");
    ring.className = "fx-shockwave";
    ring.style.left = `${event.clientX}px`;
    ring.style.top = `${event.clientY}px`;
    document.body.appendChild(ring);
    spawnBubbles(event.clientX, event.clientY);
    window.setTimeout(() => ring.remove(), 750);
  };

  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("pointerdown", onDown, { passive: true });

  return () => {
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerdown", onDown);
    if (frame) cancelAnimationFrame(frame);
  };
}