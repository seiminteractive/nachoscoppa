import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Split por palabras, preservando whitespace y la estructura de nodos hijos (br, spans).
 * Cada palabra queda envuelta en una máscara (.reveal-word-mask) con overflow:hidden y
 * una capa interna (.reveal-word) que será la animada.
 *
 * Idempotente: marca el root con data-reveal-split="1" para no re-procesar.
 */
function splitIntoWords(root) {
  if (!root) return [];
  if (root.dataset && root.dataset.revealSplit === "1") {
    return Array.from(root.querySelectorAll(".reveal-word"));
  }
  const words = [];
  const walk = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.nodeValue;
      if (!text || !text.trim()) return;
      const frag = document.createDocumentFragment();
      text.split(/(\s+)/).forEach((tok) => {
        if (!tok) return;
        if (/^\s+$/.test(tok)) {
          frag.appendChild(document.createTextNode(tok));
        } else {
          const mask = document.createElement("span");
          mask.className = "reveal-word-mask";
          /* clip-path en vez de overflow:hidden: el clip solo aplica arriba (la palabra
             sube desde abajo), pero deja descenders y acentos visibles fuera del box
             sin afectar layout. */
          mask.style.cssText =
            "display:inline-block;vertical-align:baseline;line-height:inherit;clip-path:inset(0 -0.08em -0.35em -0.08em);-webkit-clip-path:inset(0 -0.08em -0.35em -0.08em);";
          const inner = document.createElement("span");
          inner.className = "reveal-word";
          inner.style.cssText = "display:inline-block;line-height:inherit;";
          inner.textContent = tok;
          mask.appendChild(inner);
          frag.appendChild(mask);
          words.push(inner);
        }
      });
      node.parentNode.replaceChild(frag, node);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.classList?.contains("reveal-word")) return;
      /* Permite excluir elementos con contenido dinámico (counters, etc.) */
      if (node.dataset && node.dataset.revealSkip === "1") return;
      Array.from(node.childNodes).forEach(walk);
    }
  };
  walk(root);
  if (root.dataset) root.dataset.revealSplit = "1";
  return words;
}

/**
 * Entrada de texto por scroll con un efecto compuesto:
 *  - Máscara por palabra (overflow:hidden) → cada palabra emerge desde abajo
 *  - rotateX con perspectiva → ligero "flip" 3D editorial
 *  - blur → enfoque progresivo
 *  - stagger fino para que se sienta una cascada (no un bloque)
 *
 * @param {HTMLElement | HTMLElement[]} target  Elemento o array de elementos a animar
 * @param {object} [opts]
 */
export function revealTextOnScroll(target, opts = {}) {
  if (!target || typeof window === "undefined") return null;
  const targets = Array.isArray(target) ? target : [target];
  const validTargets = targets.filter(Boolean);
  if (!validTargets.length) return null;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const allWords = validTargets.flatMap(splitIntoWords);
  if (!allWords.length) return null;

  if (reduced) {
    gsap.set(allWords, { yPercent: 0, rotateX: 0, opacity: 1, filter: "none" });
    return null;
  }

  const {
    duration = 1.15,
    stagger = 0.045,
    ease = "expo.out",
    yPercent = 115,
    rotateX = -55,
    blur = 6,
    start = "top 88%",
    end = "bottom top",
    once = true,
    delay = 0,
    trigger = validTargets[0],
  } = opts;

  gsap.set(allWords, {
    yPercent,
    rotateX,
    opacity: 0,
    transformPerspective: 700,
    transformOrigin: "50% 100% -8px",
    filter: `blur(${blur}px)`,
    willChange: "transform, opacity, filter",
  });

  return gsap
    .timeline({
      scrollTrigger: {
        trigger,
        start,
        end,
        ...(once
          ? { once: true }
          : { toggleActions: "play none none reverse" }),
        invalidateOnRefresh: true,
      },
    })
    .to(allWords, {
      yPercent: 0,
      rotateX: 0,
      opacity: 1,
      filter: "blur(0px)",
      duration,
      ease,
      stagger,
      delay,
      overwrite: "auto",
      onComplete: () => {
        gsap.set(allWords, {
          clearProps:
            "willChange,filter,transformPerspective,transformOrigin,rotateX",
        });
      },
    });
}
