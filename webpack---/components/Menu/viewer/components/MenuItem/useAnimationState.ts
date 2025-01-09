import type React from 'react';
import { useRef, useState, useEffect } from 'react';

export const DISABLED_ANIMATION_NAME = 'none';

export const AnimationPhase = {
  Enter: 'enter',
  EnterActive: 'enterActive',
  EnterDone: 'enterDone',
  Exit: 'exit',
  ExitActive: 'exitActive',
  ExitDone: 'exitDone',
} as const;

export type AnimationPhaseType =
  (typeof AnimationPhase)[keyof typeof AnimationPhase];

export type AnimationState<AnimationNameType extends string> = {
  name: AnimationNameType;
  phase?: AnimationPhaseType;
};

type AnimationConfig = {
  duration: number;
};

export const useAnimationState = <AnimationNameType extends string>(
  animationConfigMap: Record<AnimationNameType, AnimationConfig>,
  initialAnimationState: AnimationState<AnimationNameType>,
) => {
  const afterAnimationInitRef: React.MutableRefObject<(() => void) | null> =
    useRef(null);
  const afterAnimationActiveRef: React.MutableRefObject<(() => void) | null> =
    useRef(null);
  const [animationState, setAnimationState] = useState(initialAnimationState);

  const abortAnimationCallbacks = () => {
    afterAnimationInitRef.current = null;
    afterAnimationActiveRef.current = null;
  };

  const initEnterAnimation = (
    animationName: AnimationNameType,
    onAnimationDone?: () => void,
  ) => {
    abortAnimationCallbacks();

    if (animationName === DISABLED_ANIMATION_NAME) {
      return onAnimationDone?.();
    }

    setAnimationState({
      name: animationName,
      phase: AnimationPhase.Enter,
    });

    afterAnimationInitRef.current = () => {
      setAnimationState({
        name: animationName,
        phase: AnimationPhase.EnterActive,
      });
    };

    afterAnimationActiveRef.current = () => {
      setAnimationState({
        name: animationName,
        phase: AnimationPhase.EnterDone,
      });
      onAnimationDone?.();
    };
  };

  const initExitAnimation = (
    animationName: AnimationNameType,
    onAnimationDone?: () => void,
  ) => {
    abortAnimationCallbacks();

    if (animationName === DISABLED_ANIMATION_NAME) {
      return onAnimationDone?.();
    }

    setAnimationState({
      name: animationName,
      phase: AnimationPhase.Exit,
    });

    afterAnimationInitRef.current = () => {
      setAnimationState({
        name: animationName,
        phase: AnimationPhase.ExitActive,
      });
    };

    afterAnimationActiveRef.current = () => {
      setAnimationState({
        name: animationName,
        phase: AnimationPhase.ExitDone,
      });
      onAnimationDone?.();
    };
  };

  useEffect(() => {
    const { name } = animationState;
    const { duration: animationDuration } = animationConfigMap[name];

    const isInitPhase =
      animationState.phase === AnimationPhase.Enter ||
      animationState.phase === AnimationPhase.Exit;
    const isActivePhase =
      animationState.phase === AnimationPhase.EnterActive ||
      animationState.phase === AnimationPhase.ExitActive;

    if (isInitPhase) {
      window.requestAnimationFrame(() => {
        afterAnimationInitRef.current?.();
        afterAnimationInitRef.current = null;
      });
    } else if (isActivePhase) {
      setTimeout(() => {
        afterAnimationActiveRef.current?.();
        afterAnimationActiveRef.current = null;
      }, animationDuration);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animationState.phase]);

  return {
    animationState,
    initEnterAnimation,
    initExitAnimation,
  };
};
