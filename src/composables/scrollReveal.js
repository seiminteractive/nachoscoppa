import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Entrada y salida suaves; al volver a pasar por la sección se reproduce de nuevo. */
export const REVEAL_TOGGLE = "play reverse play reverse";

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

  const y = opts.y ?? 40;
  const duration = opts.duration ?? 0.72;
  const stagger = opts.stagger ?? 0.07;
  const ease = opts.ease ?? "power2.out";
  const start = opts.start ?? "top 88%";
  const end = opts.end ?? "bottom 15%";

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
        toggleActions: REVEAL_TOGGLE,
        invalidateOnRefresh: true,
        fastScrollEnd: true,
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
