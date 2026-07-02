import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { eventTypes } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const addEventListeners = (
  listener: EventListenerOrEventListenerObject,
) => {
  eventTypes.forEach((type) => {
    window.addEventListener(type, listener, false);
  });
};

export const removeEventListeners = (
  listener: EventListenerOrEventListenerObject,
) => {
  if (listener) {
    eventTypes.forEach((type) => {
      window.removeEventListener(type, listener, false);
    });
  }
};

