import type * as React from 'react';

export const handleButtonKeyDown = (
  event: KeyboardEvent,
  toggleZoom: () => void,
  resetZoom: () => void,
) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    toggleZoom();
  } else if (event.key === 'Escape') {
    resetZoom();
  }
};

export const handleKeyDown = (
  // @ts-expect-error
  event: ReactKeyboardEvent<HTMLDivElement>,
  isZoomedByKeyboard: boolean,
  setPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>,
  containerRef: React.RefObject<HTMLDivElement>,
  zoomImageMeasures: { width: number; height: number },
) => {
  if (!isZoomedByKeyboard) {
    return;
  }

  type ArrowKeys = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight';
  if (['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
    event.preventDefault();
  }

  const measurements = containerRef.current!.getBoundingClientRect();

  const containerWidth = measurements.width;
  const containerHeight = measurements.height;

  const scaledWidth = zoomImageMeasures.width;
  const scaledHeight = zoomImageMeasures.height;

  const heightMoveStep = scaledHeight / 20;
  const widthMoveStep = scaledWidth / 20;

  const key = event.key as ArrowKeys;

  setPosition(prev => {
    const { x, y } = prev;
    const actions = {
      ArrowUp: { x, y: Math.min(y + heightMoveStep, 0) },
      ArrowDown: {
        x,
        y: Math.max(y - heightMoveStep, containerHeight - scaledHeight),
      },
      ArrowLeft: { x: Math.min(x + widthMoveStep, 0), y },
      ArrowRight: {
        x: Math.max(x - widthMoveStep, containerWidth - scaledWidth),
        y,
      },
    } as const;
    const action = actions[key];
    return action ?? prev;
  });
};

export const toggleKeyboardZoom = (
  isZoomedByKeyboard: boolean,
  setIsZoomedByKeyboard: React.Dispatch<React.SetStateAction<boolean>>,
  setPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>,
) => {
  setIsZoomedByKeyboard(!isZoomedByKeyboard);
  if (!isZoomedByKeyboard) {
    setPosition({ x: 0, y: 0 });
  }
};
