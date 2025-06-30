export function useAnimation() {
  return {
    animate: () => {},
    animating: false
  };
}

export function useRipple() {
  return {
    rippleProps: {},
    triggerRipple: () => {}
  };
}

export function useHover() {
  return {
    hovered: false,
    hoverProps: {}
  };
}

export function useFocus() {
  return {
    focused: false,
    focusProps: {}
  };
}

export const respectsReducedMotion = () => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  return false;
};
