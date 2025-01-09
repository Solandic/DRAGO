import type { IMenuItemSDKAction } from '@wix/editor-elements-corvid-utils';
import type {
  DropdownAnimationNameType,
  IMenuItemProps,
  MenuAnimationNameType,
  MenuOrientationType,
  MenuVerticalDropdownDisplayType,
} from '../../../Menu.types';
import { MenuOrientation, VerticalDropdownDisplay } from '../../../constants';
import type { AnimationPhaseType, AnimationState } from './useAnimationState';
import { AnimationPhase } from './useAnimationState';

export const createSDKAction = (
  item: Omit<IMenuItemProps['item'], 'children'>,
  selected: boolean,
  sdkAction?: IMenuItemSDKAction,
) =>
  sdkAction &&
  ((e: React.MouseEvent) => {
    sdkAction?.(e, {
      ...item,
      selected,
    });
  });

export const getMenuOrientation = (itemRef: React.RefObject<HTMLLIElement>) => {
  if (!itemRef?.current) {
    return;
  }

  const orientation = getComputedStyle(itemRef.current).getPropertyValue(
    '--orientation',
  ) as MenuOrientationType;

  return orientation;
};

export const getVerticalDropdownDispaly = (
  itemRef: React.RefObject<HTMLLIElement>,
) => {
  if (!itemRef?.current) {
    return;
  }

  const verticalDropdownDisplay = getComputedStyle(
    itemRef.current,
  ).getPropertyValue(
    '--vertical-dropdown-display',
  ) as MenuVerticalDropdownDisplayType;

  return verticalDropdownDisplay;
};

export const getIsAlwaysOpen = (itemRef: React.RefObject<HTMLLIElement>) => {
  const isVertical = getMenuOrientation(itemRef) === MenuOrientation.Vertical;
  const verticalDropdownDisplay = getVerticalDropdownDispaly(itemRef);
  const isAlwaysOpen =
    isVertical &&
    verticalDropdownDisplay === VerticalDropdownDisplay.AlwaysOpen;

  return isAlwaysOpen;
};

type CreateEventListenersOptions = {
  showDropdown: () => void;
  hideDropdown: () => void;
  itemRef: React.RefObject<HTMLLIElement>;
  getMenuItemAnimationName: () => MenuAnimationNameType;
  initEnterAnimation: (animationName: MenuAnimationNameType) => void;
  initExitAnimation: (
    animationName: MenuAnimationNameType,
    onAnimationDone?: () => void,
  ) => void;
  isOpen: boolean;
  hasLink: boolean;
  dropdownAnimationState: AnimationState<DropdownAnimationNameType>;
};

const getIsVerticalExpanded = (
  isHorizontal: boolean,
  isOpen: boolean,
  dropdownAnimationState: AnimationState<DropdownAnimationNameType>,
) => {
  const isVertical = !isHorizontal;
  const isDropdownAnimationExiting = (
    [
      AnimationPhase.Exit,
      AnimationPhase.ExitActive,
    ] as Array<AnimationPhaseType>
  ).includes(dropdownAnimationState.phase!);

  return isVertical && isOpen && !isDropdownAnimationExiting;
};

export const createEventListeners = ({
  showDropdown,
  hideDropdown,
  itemRef,
  getMenuItemAnimationName,
  initEnterAnimation,
  initExitAnimation,
  isOpen,
  hasLink,
  dropdownAnimationState,
}: CreateEventListenersOptions) => {
  return {
    onMouseEnter: () => {
      const isHorizontal =
        getMenuOrientation(itemRef) === MenuOrientation.Horizontal;
      const isAlwaysOpen = getIsAlwaysOpen(itemRef);
      const isVerticalExpanded = getIsVerticalExpanded(
        isHorizontal,
        isOpen,
        dropdownAnimationState,
      );
      if (!hasLink && (isAlwaysOpen || isVerticalExpanded)) {
        return;
      }

      const animationName = getMenuItemAnimationName();

      if (isHorizontal) {
        showDropdown();
      }
      initEnterAnimation(animationName);
    },
    onMouseLeave: () => {
      const isHorizontal =
        getMenuOrientation(itemRef) === MenuOrientation.Horizontal;
      const isAlwaysOpen = getIsAlwaysOpen(itemRef);
      const isVerticalExpanded = getIsVerticalExpanded(
        isHorizontal,
        isOpen,
        dropdownAnimationState,
      );

      if (!hasLink && (isAlwaysOpen || isVerticalExpanded)) {
        return;
      }

      const animationName = getMenuItemAnimationName();

      if (isHorizontal) {
        hideDropdown();
      }
      initExitAnimation(animationName);
    },
  };
};
