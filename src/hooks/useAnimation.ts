import * as React from 'react';

export function useAnimation() {
  return {
    animate: () => {},
    animating: false
  };
}

export function useRipple() {
  return {
    createRipple: (event: React.MouseEvent) => {},
    rippleElements: null
  };
}

export function useHover() {
  return {
    isHovered: false,
    hoverProps: {},
    getHoverStyle: (baseStyle: React.CSSProperties, hoverStyle: React.CSSProperties) => baseStyle
  };
}

export function useFocus() {
  return {
    isFocused: false,
    focusProps: {
      onFocus: () => {},
      onBlur: () => {}
    },
    getFocusStyle: (baseStyle: React.CSSProperties) => baseStyle
  };
}

export const respectsReducedMotion = () => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  return false;
};
