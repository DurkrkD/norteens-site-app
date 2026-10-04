// Notificações (inspirado no react-hot-toast): um estado global simples, ouvido pelo <Toaster />.
import { useState, useEffect } from "react";

const TOAST_LIMIT = 3; // mais que isso vira uma pilha que cobre a tela
const TOAST_REMOVE_DELAY = 300; // tempo da animação de saída antes de tirar do DOM
export const TOAST_DURACAO = 4500; // some sozinha depois disso (erros ficam um pouco mais)
export const TOAST_DURACAO_ERRO = 7000;

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
};

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

const toastTimeouts = new Map();

const addToRemoveQueue = (toastId) => {
  if (toastTimeouts.has(toastId)) return;

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({ type: actionTypes.REMOVE_TOAST, toastId });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

export const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return { ...state, toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT) };

    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) => (t.id === action.toast.id ? { ...t, ...action.toast } : t)),
      };

    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action;
      // marca como fechada (anima a saída) e agenda a remoção
      if (toastId) addToRemoveQueue(toastId);
      else state.toasts.forEach((t) => addToRemoveQueue(t.id));

      return {
        ...state,
        toasts: state.toasts.map((t) => (t.id === toastId || toastId === undefined ? { ...t, open: false } : t)),
      };
    }

    case actionTypes.REMOVE_TOAST:
      if (action.toastId === undefined) return { ...state, toasts: [] };
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.toastId) };

    default:
      return state;
  }
};

const listeners = [];

let memoryState = { toasts: [] };

function dispatch(action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => listener(memoryState));
}

function dismiss(toastId) {
  dispatch({ type: actionTypes.DISMISS_TOAST, toastId });
}

function toast({ ...props }) {
  const id = genId();

  const update = (novos) => dispatch({ type: actionTypes.UPDATE_TOAST, toast: { ...novos, id } });

  dispatch({ type: actionTypes.ADD_TOAST, toast: { ...props, id, open: true } });

  return { id, dismiss: () => dismiss(id), update };
}

function useToast() {
  const [state, setState] = useState(memoryState);

  useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) listeners.splice(index, 1);
    };
  }, []);

  return { ...state, toast, dismiss };
}

export { useToast, toast };
