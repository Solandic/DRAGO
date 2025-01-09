import React, { useMemo } from 'react';
import type { MenuItemProps } from '@wix/editor-elements-definitions';
import Submenu from '../../../../Submenu/viewer/Submenu';
import DropdownMMCI from '../../../../MegaMenuContainerItem/viewer/skinComps/Dropdown/Dropdown.skin';
import classes from './Dropdown.scss';
import { dropdownMenuSkinParams } from '../../../skinParams/dropdownMenuSkinParams';
import type {
  MenuOrientationType,
  MenuPreviewStateMap,
} from '../../../Menu.types';
import type {
  SubmenuItemState,
  SubmenuPreviewStateMap,
} from '../../../../Submenu/types';
import { prefixes } from '../../../skinParams/common';

type VirtualDropdownProps = {
  item: MenuItemProps;
  menuOrientation: MenuOrientationType;
  className?: string;
  children?: React.ReactNode;
  partToPreviewStateMap?: MenuPreviewStateMap;
};

const cssVarNames = [...Object.keys(dropdownMenuSkinParams), 'direction'];
const attachedDropdownMenuCssVariables = Object.fromEntries(
  cssVarNames.map(param => [`--${param}`, 'initial']),
);

export const menuToSubmenuPreviewStateMap = (
  menuPreviewStateMap: MenuPreviewStateMap | undefined,
): SubmenuPreviewStateMap => {
  if (!menuPreviewStateMap) {
    return {};
  }

  const prefix = `${prefixes.dropdownMenu}-`;
  return Object.entries(menuPreviewStateMap).reduce((acc, [key, value]) => {
    if (key.startsWith(prefix)) {
      const newKey = key.slice(prefix.length) as keyof SubmenuPreviewStateMap;
      acc[newKey] = value as SubmenuItemState;
    }

    return acc;
  }, {} as SubmenuPreviewStateMap);
};

export const Dropdown = ({
  item,
  menuOrientation,
  className,
  children,
  partToPreviewStateMap,
}: VirtualDropdownProps) => {
  const submenuPartToPreviewStateMap = useMemo(
    () => menuToSubmenuPreviewStateMap(partToPreviewStateMap),
    [partToPreviewStateMap],
  );

  return (
    <div style={attachedDropdownMenuCssVariables} className={className}>
      {children ?? (
        <DropdownMMCI
          id={`${item.id}-dropdown`}
          containerRootClassName={classes.virtualDropdown}
          menuOrientation={menuOrientation}
          parentType="wixui.Menu"
          parentStylableClassName=""
          containerProps={{
            containerLayoutClassName: `${item.id}-container`,
            hasOverflow: false,
            overlowWrapperClassName: `${item.id}-overflow-wrapper`,
          }}
        >
          {() => {
            return (
              <Submenu
                id={`${item.id}-submenu`}
                partToPreviewStateMap={submenuPartToPreviewStateMap}
              />
            );
          }}
        </DropdownMMCI>
      )}
    </div>
  );
};
