import type { PropsWithChildren } from 'react';
import cn from 'clsx';
import React from 'react';
import { useMenuItemContext } from '../../../../../common/menu/MenuItemContext';
import classes from '../MenuItem/style/MenuItem.scss';
import { MenuParts, INITIAL_DROPDOWN_ANIMATION_STATE } from '../../constants';
import type { MenuOrientationType } from '../../../Menu.types';

type DropdownWrapperProps = PropsWithChildren<{
  id: string;
  menuOrientation?: MenuOrientationType;
  className?: string;
  dataAttributes?: any;
}>;

export const DropdownWrapper: React.FC<DropdownWrapperProps> = ({
  id,
  className,
  dataAttributes,
  children,
  menuOrientation = 'horizontal',
}) => {
  const {
    dropdownAnimationState: animationState = INITIAL_DROPDOWN_ANIMATION_STATE,
    item,
  } = useMenuItemContext();
  const dropdownRootClasses = cn(
    className,
    menuOrientation === 'horizontal'
      ? classes.horizontalDropdown
      : classes.verticalDropdown,
  );

  return (
    <div
      id={id}
      {...dataAttributes}
      className={dropdownRootClasses}
      role="group"
      aria-label={item.label}
      data-animation-name={animationState.name}
      data-animation-state={animationState.phase}
      data-part={MenuParts.DropdownContainer}
    >
      {children}
    </div>
  );
};
