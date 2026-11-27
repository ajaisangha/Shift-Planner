const SPOT =
  ".data-card, .subcard, .sub-card, .staff-group-card, .pick-subcard, .barcode-subcard, .shift-subcard";

const FIRE_COLORS = ["#fff3c4", "#ffd24a", "#ff9a1f", "#ff5a1f", "#ff2d2d"];

const isOn = (attribute) =>
  document.documentElement.getAttribute(attribute) === "on";

const place = (element, x, y, lifetime) => {
  element.style.left = `${x}px`;
  element.style.top = `${y}px`;
  document.body.appendChild(element);
  window.setTimeout(() => element.remove(), lifetime);
};

const spawnBubbles = (x, y) => {
  for (let i = 0; i < 14; i += 1) {
    const size = 6 + Math.random() * 18;
    const bubble = document.createElement("span");

    bubble.className = "fx-bubble";
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.marginLeft = `${-size / 2}px`;
    bubble.style.marginTop = `${-size / 2}px`;
    bubble.style.setProperty("--drift", `${(Math.random() - 0.5) * 90}px`);
    bubble.style.setProperty("--rise", `${90 + Math.random() * 110}px`);
    bubble.style.animationDuration = `${1.1 + Math.random() * 1.1}s`;
    bubble.style.animationDelay = `${Math.random() * 0.15}s`;

    place(
      bubble,
      x + (Math.random() - 0.5) * 30,
      y + (Math.random() - 0.5) * 10,
      2600
    );
  }
};

const spawnFirecracker = (x, y) => {
  const flash = document.createElement("span");
  flash.className = "fx-flash";
  place(flash, x, y, 500);

  for (let i = 0; i < 10; i += 1) {
    const streak = document.createElement("span");
    streak.className = "fx-streak";
    streak.style.setProperty(
      "--ang",
      `${(360 / 10) * i + Math.random() * 20}deg`
    );
    streak.style.setProperty("--len", `${45 + Math.random() * 45}px`);
    place(streak, x, y, 700);
  }

  for (let i = 0; i < 28; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const distance = 40 + Math.random() * 90;
    const size = 2 + Math.random() * 4;
    const color = FIRE_COLORS[Math.floor(Math.random() * FIRE_COLORS.length)];
    const spark = document.createElement("span");

    spark.className = "fx-spark";
    spark.style.width = `${size}px`;
    spark.style.height = `${size}px`;
    spark.style.marginLeft = `${-size / 2}px`;
    spark.style.marginTop = `${-size / 2}px`;
    spark.style.background = color;
    spark.style.boxShadow = `0 0 6px ${color}`;
    spark.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
    spark.style.setProperty("--dy", `${Math.sin(angle) * distance}px`);
    spark.style.setProperty("--fall", `${30 + Math.random() * 40}px`);
    spark.style.animationDuration = `${0.6 + Math.random() * 0.6}s`;

    place(spark, x, y, 1400);
  }
};

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

  const onDown = (event) => {
    const x = event.clientX;
    const y = event.clientY;

    // Click effects appear at the pointer, anywhere on the page.
        // Fire always wins, so bubbles can never appear in fire mode.
    if (isOn("data-fire")) {
      spawnFirecracker(x, y);
    } else if (isOn("data-water")) {
      spawnBubbles(x, y);
    }

    // Ripple + ring only when a button is pressed.
    const button =
      event.target instanceof Element ? event.target.closest("button") : null;

    if (!button || button.disabled) return;

    const rect = button.getBoundingClientRect();
    button.style.setProperty("--rx", `${x - rect.left}px`);
    button.style.setProperty("--ry", `${y - rect.top}px`);

    button.classList.remove("fx-ripple");
    void button.offsetWidth;
    button.classList.add("fx-ripple");
    window.setTimeout(() => button.classList.remove("fx-ripple"), 700);

    const ring = document.createElement("div");
    ring.className = "fx-shockwave";
    place(ring, x, y, 750);
  };

  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("pointerdown", onDown, { passive: true });

  return () => {
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerdown", onDown);
    if (frame) cancelAnimationFrame(frame);
  };
}