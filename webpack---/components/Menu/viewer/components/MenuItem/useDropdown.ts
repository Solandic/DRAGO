import { useEffect, useState } from 'react';
import {
  resetDropdownDomStyles,
  updateDropdownDomStyles,
} from './updateDropdownDomStyles';
import { useDidUpdate } from '@wix/thunderbolt-elements/providers/useDidUpdate';
import { useAnimationState } from './useAnimationState';
import type {
  DropdownAnimationNameType,
  MenuAnimationNameType,
} from '../../../Menu.types';
import {
  ANIMATION_PACKAGE_CONFIG,
  DROPDOWN_ANIMATION_CONFIG,
  INITIAL_DROPDOWN_ANIMATION_STATE,
} from '../../constants';

type UseDropdownProps = {
  itemRef: React.RefObject<HTMLLIElement>;
  forceOpen: boolean;
  getAnimationPackage: () => MenuAnimationNameType;
};

export const useDropdown = ({
  itemRef,
  forceOpen,
  getAnimationPackage,
}: UseDropdownProps) => {
  const { animationState, initEnterAnimation, initExitAnimation } =
    useAnimationState(
      DROPDOWN_ANIMATION_CONFIG,
      INITIAL_DROPDOWN_ANIMATION_STATE,
    );
  const [isOpen, setIsOpen] = useState(forceOpen);

  const getDropdownAnimationName = (): DropdownAnimationNameType => {
    const animationPackage = getAnimationPackage();
    const dropdownAnimationName =
      ANIMATION_PACKAGE_CONFIG[animationPackage].dropdownAnimationName;

    return dropdownAnimationName;
  };

  const showDropdown = () => {
    const dropdownAnimationName = getDropdownAnimationName();

    updateDropdownDomStyles(itemRef.current!);
    setIsOpen(true);
    initEnterAnimation(dropdownAnimationName);
  };

  const hideDropdown = () => {
    const dropdownAnimationName = getDropdownAnimationName();
    initExitAnimation(dropdownAnimationName, () => setIsOpen(false));
  };

  const toggleDropdown = () => {
    if (isOpen) {
      hideDropdown();
    } else {
      showDropdown();
    }
  };

  useDidUpdate(() => {
    if (!isOpen) {
      resetDropdownDomStyles(itemRef.current!);
    }
  }, [isOpen]);

  useDidUpdate(() => {
    if (forceOpen) {
      showDropdown();
    } else {
      hideDropdown();
    }
  }, [forceOpen]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => resetDropdownDomStyles(itemRef.current!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isOpen,
    dropdownAnimationState: animationState,
    showDropdown,
    hideDropdown,
    toggleDropdown,
  };
};
