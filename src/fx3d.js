const SPOT =
  ".data-card, .subcard, .sub-card, .staff-group-card, .pick-subcard, .barcode-subcard, .shift-subcard";

const SVG_NS = "http://www.w3.org/2000/svg";

const FIRE_COLORS = ["#fff3c4", "#ffd24a", "#ff9a1f", "#ff5a1f", "#ff2d2d"];
const STORM_COLORS = ["#ffffff", "#dbe6ff", "#a9c2ff", "#7d9dff"];
const SPARKLE_COLORS = ["#ffffff", "#ffd6f0", "#ff9ad5", "#e0b8ff", "#fff0a8"];
const XMAS_COLORS = ["#ff3b3b", "#ffd24a", "#30c46c", "#ffffff", "#6fa8ff"];

const isOn = (attribute) =>
  document.documentElement.getAttribute(attribute) === "on";

const place = (element, x, y, lifetime) => {
  element.style.left = `${x}px`;
  element.style.top = `${y}px`;
  document.body.appendChild(element);
  window.setTimeout(() => element.remove(), lifetime);
};

const spawnFlash = (x, y, modifier = "") => {
  const flash = document.createElement("span");
  flash.className = `fx-flash ${modifier}`.trim();
  place(flash, x, y, 500);
};

/* ---------- Underwater: bubbles ---------- */

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

/* ---------- Fire: firecracker ---------- */

const spawnFirecracker = (x, y) => {
  spawnFlash(x, y);

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

/* ---------- Thunderstorm: lightning strike ---------- */

const jaggedPoints = (x1, y1, x2, y2, segments, jitter) => {
  const points = [[x1, y1]];

  for (let i = 1; i < segments; i += 1) {
    const t = i / segments;

    points.push([
      x1 + (x2 - x1) * t + (Math.random() - 0.5) * jitter,
      y1 + (y2 - y1) * t + (Math.random() - 0.5) * jitter * 0.3,
    ]);
  }

  points.push([x2, y2]);

  return points;
};

const toPath = (points) =>
  points
    .map(
      ([px, py], index) =>
        `${index ? "L" : "M"}${px.toFixed(1)} ${py.toFixed(1)}`
    )
    .join(" ");

const spawnLightning = (x, y) => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("class", "fx-lightning");
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("preserveAspectRatio", "none");

  const main = jaggedPoints(
    x + (Math.random() - 0.5) * 220,
    0,
    x,
    y,
    Math.max(8, Math.round(y / 40)),
    50
  );

  const bolts = [main];

  for (let i = 0; i < 2; i += 1) {
    const start = main[Math.floor(main.length * (0.25 + Math.random() * 0.5))];
    const direction = Math.random() < 0.5 ? -1 : 1;

    bolts.push(
      jaggedPoints(
        start[0],
        start[1],
        start[0] + direction * (40 + Math.random() * 90),
        start[1] + 60 + Math.random() * 100,
        5,
        24
      )
    );
  }

  bolts.forEach((points, index) => {
    const d = toPath(points);
    const isMain = index === 0;

    const glow = document.createElementNS(SVG_NS, "path");
    glow.setAttribute("d", d);
    glow.setAttribute("fill", "none");
    glow.setAttribute("stroke", "rgba(140, 170, 255, 0.55)");
    glow.setAttribute("stroke-width", isMain ? "8" : "5");
    glow.setAttribute("stroke-linejoin", "round");
    glow.setAttribute("stroke-linecap", "round");

    const core = document.createElementNS(SVG_NS, "path");
    core.setAttribute("d", d);
    core.setAttribute("fill", "none");
    core.setAttribute("stroke", "#ffffff");
    core.setAttribute("stroke-width", isMain ? "2.5" : "1.5");
    core.setAttribute("stroke-linejoin", "round");
    core.setAttribute("stroke-linecap", "round");

    svg.appendChild(glow);
    svg.appendChild(core);
  });

  document.body.appendChild(svg);
  window.setTimeout(() => svg.remove(), 800);

  const screen = document.createElement("div");
  screen.className = "fx-storm-flash";
  document.body.appendChild(screen);
  window.setTimeout(() => screen.remove(), 450);

  spawnFlash(x, y, "fx-flash--storm");

  for (let i = 0; i < 10; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const distance = 20 + Math.random() * 50;
    const size = 2 + Math.random() * 3;
    const color = STORM_COLORS[Math.floor(Math.random() * STORM_COLORS.length)];
    const spark = document.createElement("span");

    spark.className = "fx-spark";
    spark.style.width = `${size}px`;
    spark.style.height = `${size}px`;
    spark.style.marginLeft = `${-size / 2}px`;
    spark.style.marginTop = `${-size / 2}px`;
    spark.style.background = color;
    spark.style.boxShadow = `0 0 8px ${color}`;
    spark.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
    spark.style.setProperty("--dy", `${Math.sin(angle) * distance}px`);
    spark.style.setProperty("--fall", `${10 + Math.random() * 20}px`);
    spark.style.animationDuration = `${0.4 + Math.random() * 0.4}s`;

    place(spark, x, y, 1000);
  }
};

/* ---------- Fairy land: sparkles ---------- */

const spawnSparkles = (x, y) => {
  spawnFlash(x, y, "fx-flash--fairy");

  for (let i = 0; i < 18; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const distance = 30 + Math.random() * 80;
    const size = 8 + Math.random() * 14;
    const color =
      SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)];
    const star = document.createElement("span");

    star.className = "fx-sparkle";
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.marginLeft = `${-size / 2}px`;
    star.style.marginTop = `${-size / 2}px`;
    star.style.background = color;
    star.style.filter = `drop-shadow(0 0 4px ${color})`;
    star.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
    star.style.setProperty("--dy", `${Math.sin(angle) * distance - 24}px`);
    star.style.setProperty("--spin", `${(Math.random() - 0.5) * 360}deg`);
    star.style.animationDuration = `${0.8 + Math.random() * 0.7}s`;

    place(star, x, y, 1700);
  }
};

/* ---------- Christmas: pop-up gift box ---------- */

const GIFT_COLORS = [
  { gift: "#d32f2f", ribbon: "#ffd24a" },
  { gift: "#2e8b57", ribbon: "#ff4d4d" },
  { gift: "#1e6fd9", ribbon: "#ffffff" },
  { gift: "#ffffff", ribbon: "#d32f2f" },
  { gift: "#8e44ad", ribbon: "#ffd24a" },
];

const CONFETTI_COLORS = [
  "#ff4d4d",
  "#ffd24a",
  "#2ecc71",
  "#4da3ff",
  "#ffffff",
  "#ff9ad5",
];

const spawnGift = (x, y) => {
  const palette = GIFT_COLORS[Math.floor(Math.random() * GIFT_COLORS.length)];
  const duration = 1500;

  const ribbonBand = (ribbon, base) =>
    `linear-gradient(90deg, transparent 42%, ${ribbon} 42%, ${ribbon} 58%, transparent 58%), ${base}`;

  /* Gift container */
  const gift = document.createElement("div");
  Object.assign(gift.style, {
    position: "fixed",
    zIndex: "4500",
    width: "44px",
    height: "44px",
    margin: "-22px 0 0 -22px",
    pointerEvents: "none",
    transformOrigin: "50% 100%",
  });

  /* Box */
  const box = document.createElement("span");
  Object.assign(box.style, {
    position: "absolute",
    display: "block",
    left: "4px",
    right: "4px",
    bottom: "0",
    height: "28px",
    borderRadius: "3px",
    background: ribbonBand(palette.ribbon, palette.gift),
    boxShadow:
      "inset 0 -5px 0 rgba(0,0,0,0.18), 0 4px 8px rgba(0,0,0,0.25)",
  });

  /* Lid */
  const lid = document.createElement("span");
  Object.assign(lid.style, {
    position: "absolute",
    display: "block",
    left: "0",
    right: "0",
    bottom: "26px",
    height: "12px",
    borderRadius: "3px",
    background: ribbonBand(palette.ribbon, palette.gift),
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    transformOrigin: "0 100%",
  });

  /* Bow on the lid */
  const bow = document.createElement("span");
  Object.assign(bow.style, {
    position: "absolute",
    display: "block",
    left: "50%",
    top: "-9px",
    width: "20px",
    height: "11px",
    marginLeft: "-10px",
    background: `radial-gradient(circle at 25% 65%, ${palette.ribbon} 0 5px, transparent 5.5px), radial-gradient(circle at 75% 65%, ${palette.ribbon} 0 5px, transparent 5.5px)`,
  });

  lid.appendChild(bow);
  gift.appendChild(lid);
  gift.appendChild(box);
  place(gift, x, y, duration + 300);

  /* Pop up, hold, float up and fade */
  gift.animate(
    [
      { opacity: 1, transform: "translateY(10px) scale(0)", offset: 0 },
      { opacity: 1, transform: "translateY(-6px) scale(1.25)", offset: 0.2 },
      { opacity: 1, transform: "translateY(0) scale(1)", offset: 0.32 },
      { opacity: 1, transform: "translateY(-4px) scale(1)", offset: 0.75 },
      { opacity: 0, transform: "translateY(-28px) scale(0.9)", offset: 1 },
    ],
    { duration, easing: "ease-out", fill: "forwards" }
  );

  /* Lid flips open */
  lid.animate(
    [
      { transform: "translate(0px, 0px) rotate(0deg)", offset: 0 },
      { transform: "translate(0px, 0px) rotate(0deg)", offset: 0.3 },
      { transform: "translate(-6px, -22px) rotate(-28deg)", offset: 0.48 },
      { transform: "translate(-12px, -34px) rotate(-42deg)", offset: 1 },
    ],
    { duration, easing: "ease-out", fill: "forwards" }
  );

  /* Confetti bursts out when the lid opens */
  for (let i = 0; i < 18; i += 1) {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.3;
    const distance = 40 + Math.random() * 80;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;
    const spin = (Math.random() - 0.5) * 720;
    const color =
      CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];

    const piece = document.createElement("span");
    Object.assign(piece.style, {
      position: "fixed",
      zIndex: "4500",
      display: "block",
      width: `${4 + Math.random() * 4}px`,
      height: `${8 + Math.random() * 5}px`,
      borderRadius: "1px",
      background: color,
      pointerEvents: "none",
      opacity: "0",
    });

    place(piece, x, y - 12, 2400);

    piece.animate(
      [
        { opacity: 0, transform: "translate(0px, 0px) rotate(0deg)", offset: 0 },
        { opacity: 1, transform: "translate(0px, 0px) rotate(0deg)", offset: 0.1 },
        {
          opacity: 1,
          transform: `translate(${dx}px, ${dy}px) rotate(${spin * 0.6}deg)`,
          offset: 0.55,
        },
        {
          opacity: 0,
          transform: `translate(${dx}px, ${dy + 60}px) rotate(${spin}deg)`,
          offset: 1,
        },
      ],
      {
        duration: 900 + Math.random() * 600,
        delay: 350,
        easing: "ease-out",
        fill: "both",
      }
    );
  }
};

/* ---------- Setup ---------- */

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

        // Only one effect is active at a time, shown at the pointer.
    if (isOn("data-fire")) {
      spawnFirecracker(x, y);
    } else if (isOn("data-storm")) {
      spawnLightning(x, y);
    } else if (isOn("data-fairy")) {
      spawnSparkles(x, y);
    } else if (isOn("data-christmas")) {
      spawnGift(x, y);
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