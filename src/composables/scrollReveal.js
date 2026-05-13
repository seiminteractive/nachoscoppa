import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Entrada / salida con scroll. `end` por defecto `bottom top`: el reverse al bajar recién cuando el
 * trigger salió por arriba del viewport (no a mitad de pantalla).
 */
export const REVEAL_TOGGLE_ACTIONS = "play reverse play reverse";

/**
 * @param {HTMLElement | null} trigger
 * @param {string | Element | Element[]} targets - selector relativo al trigger, o nodo(s)
 * @param {object} [opts]
 * @returns {gsap.core.Timeline | null}
 */
export function revealOnScroll(trigger, targets, opts = {}) {
  if (!trigger || typeof window === "undefined") return null;

  let list;
  if (typeof targets === "string") {
    list = gsap.utils.toArray(trigger.querySelectorAll(targets));
  } else if (targets instanceof Element) {
    list = [targets];
  } else {
    list = gsap.utils.toArray(targets).filter(Boolean);
  }

  if (!list.length) return null;

  const y = opts.y ?? 22;
  const duration = opts.duration ?? 0.78;
  const stagger = opts.stagger ?? 0.09;
  const ease = opts.ease ?? "power2.inOut";
  const start = opts.start ?? "top 82%";
  const end = opts.end ?? "bottom top";
  const fastScrollEnd = opts.fastScrollEnd ?? false;
  const toggleActions = opts.toggleActions ?? REVEAL_TOGGLE_ACTIONS;
  const once = opts.once ?? false;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    gsap.set(list, { autoAlpha: 1, y: 0, clearProps: "willChange" });
    return null;
  }

  gsap.set(list, { autoAlpha: 0, y, willChange: "transform, opacity" });

  return gsap
    .timeline({
      scrollTrigger: {
        trigger,
        start,
        end,
        ...(once ? { once: true } : { toggleActions }),
        invalidateOnRefresh: true,
        fastScrollEnd,
      },
    })
    .to(list, {
      autoAlpha: 1,
      y: 0,
      duration,
      ease,
      stagger,
      overwrite: "auto",
    });
}
