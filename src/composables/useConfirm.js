import { reactive } from "vue";

// Estado global de un único diálogo de confirmación (montado una vez en AdminLayout).
const state = reactive({
  open: false,
  title: "",
  message: "",
  confirmLabel: "Confirmar",
  cancelLabel: "Cancelar",
  tone: "default", // default | danger
  _resolve: null,
});

/**
 * Abre el diálogo y resuelve a true/false.
 * @param {object} opts
 * @returns {Promise<boolean>}
 */
export function confirm(opts = {}) {
  state.title = opts.title || "¿Estás seguro?";
  state.message = opts.message || "";
  state.confirmLabel = opts.confirmLabel || "Confirmar";
  state.cancelLabel = opts.cancelLabel || "Cancelar";
  state.tone = opts.tone || "default";
  state.open = true;
  return new Promise((resolve) => {
    state._resolve = resolve;
  });
}

export function _resolveConfirm(value) {
  state.open = false;
  if (state._resolve) {
    state._resolve(value);
    state._resolve = null;
  }
}

export function useConfirmState() {
  return state;
}
