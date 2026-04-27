import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Cuenta de `from` a `to` cuando el trigger entra en vista (una sola vez).
 * Llamar dentro de `gsap.context(() => { ... })` para limpiar con el componente.
 *
 * @param {HTMLElement | null} trigger
 * @param {HTMLElement | null} el - nodo cuyo textContent se actualiza
 * @param {object} opts
 * @param {number} [opts.from=0]
 * @param {number} opts.to
 * @param {(v: number) => string} [opts.format]
 * @param {number} [opts.duration]
 * @param {string} [opts.ease]
 * @param {string} [opts.start]
 */
export function countUpOnScroll(trigger, el, opts = {}) {
  if (!trigger || !el || typeof window === "undefined") return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const from = opts.from ?? 0;
  const to = opts.to;
  if (typeof to !== "number" || Number.isNaN(to)) return;

  const duration = opts.duration ?? 1.45;
  const ease = opts.ease ?? "power2.out";
  const start = opts.start ?? "top 94%";
  const format = opts.format ?? ((v) => String(Math.round(v)));
  /* Priority más bajo = se recalcula después de pins (-10 por defecto). */
  const refreshPriority = opts.refreshPriority ?? -10;

  ScrollTrigger.create({
    trigger,
    start,
    once: true,
    refreshPriority,
    onEnter: () => {
      const obj = { v: from };
      el.textContent = format(from);
      gsap.to(obj, {
        v: to,
        duration,
        ease,
        onUpdate: () => {
          el.textContent = format(obj.v);
        },
      });
    },
  });
}
