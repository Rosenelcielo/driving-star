"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

const TARGET_SELECTOR = ".game-button, .star-home-primary, .star-home-secondary, .journey-setup-count-control button";
const SPARKLE_COLORS = ["#D9F874", "#FF7AC8", "#68E1FD", "#FFD166", "#8B5CF6", "#34D399", "#FF8A65"];
const SPARKLE_LIFETIME = 900;

type Sparkle = {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  size: number;
  rotate: number;
  duration: number;
  color: string;
};

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function getSparkleOrigin(event: MouseEvent, target: Element) {
  if (event.detail > 0 && (event.clientX !== 0 || event.clientY !== 0)) {
    return { x: event.clientX, y: event.clientY };
  }

  const rect = target.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}

function isDisabledTarget(target: Element) {
  return (
    target.getAttribute("aria-disabled") === "true" ||
    (target instanceof HTMLButtonElement && target.disabled)
  );
}

export function ClickSparkles() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const nextId = useRef(0);
  const cleanupTimers = useRef<number[]>([]);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const eventTarget = event.target;

      if (!(eventTarget instanceof Element)) {
        return;
      }

      const target = eventTarget.closest(TARGET_SELECTOR);

      if (!target || isDisabledTarget(target)) {
        return;
      }

      const origin = getSparkleOrigin(event, target);
      const count = Math.floor(randomBetween(6, 9));
      const burst = Array.from({ length: count }, (_, index) => {
        const id = nextId.current;
        nextId.current += 1;

        return {
          id,
          x: origin.x,
          y: origin.y,
          dx: randomBetween(-48, 48),
          dy: randomBetween(54, 118),
          size: randomBetween(8, 15),
          rotate: randomBetween(-50, 50),
          duration: randomBetween(650, SPARKLE_LIFETIME),
          color: SPARKLE_COLORS[(id + index) % SPARKLE_COLORS.length],
        };
      });

      setSparkles((current) => [...current, ...burst]);

      const timer = window.setTimeout(() => {
        const ids = new Set(burst.map((sparkle) => sparkle.id));
        setSparkles((current) => current.filter((sparkle) => !ids.has(sparkle.id)));
        cleanupTimers.current = cleanupTimers.current.filter((cleanupTimer) => cleanupTimer !== timer);
      }, SPARKLE_LIFETIME);

      cleanupTimers.current.push(timer);
    }

    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
      cleanupTimers.current.forEach((timer) => window.clearTimeout(timer));
      cleanupTimers.current = [];
    };
  }, []);

  if (sparkles.length === 0) {
    return null;
  }

  return (
    <div className="click-sparkle-layer" aria-hidden="true">
      {sparkles.map((sparkle) => (
        <span
          className="click-sparkle"
          key={sparkle.id}
          style={
            {
              "--sparkle-x": `${sparkle.x}px`,
              "--sparkle-y": `${sparkle.y}px`,
              "--sparkle-dx": `${sparkle.dx}px`,
              "--sparkle-dy": `${sparkle.dy}px`,
              "--sparkle-size": `${sparkle.size}px`,
              "--sparkle-rotate": `${sparkle.rotate}deg`,
              "--sparkle-duration": `${sparkle.duration}ms`,
              "--sparkle-color": sparkle.color,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
