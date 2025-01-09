import type { RefObject } from 'react';
import React, { useRef } from 'react';
import classNames from 'clsx';
import Link from '@wix/thunderbolt-elements/components/Link';
import {
  formatClassNames,
  isEmptyObject,
} from '@wix/editor-elements-common-utils';
import type {
  DropdownAnimationNameType,
  IMenuItemProps,
} from '../../../Menu.types';
import { createSDKAction } from './utils';
import classes from './style/MenuItem.scss';
import { MenuParts } from '../../constants';
import { isCurrentItem } from '../../../../../common/menu/getCurrentMenuItem';
import { semanticClassNames as menuSemanticClassNames } from '../../../Menu.semanticClassNames';
import shmSemanticClassNames from '../../../../StylableHorizontalMenu/StylableHorizontalMenu.semanticClassNames';
import DropdownIcon from '../../assets/dropdownIcon.svg';
import { AnimationPhase, type AnimationState } from './useAnimationState';

const itemLabelClassNames = classNames(
  classes.label,
  formatClassNames(shmSemanticClassNames.menuItemLabel),
  formatClassNames(menuSemanticClassNames.itemLabel),
);

export const MenuItemLabel: React.FC<
  IMenuItemProps & {
    hasDropdownMenu: boolean;
    hasSubItems: boolean;
    chevronButtonRef: any;
    toggleDropdown: () => void;
    isOpen: boolean;
    dropdownAnimationState: AnimationState<DropdownAnimationNameType>;
  }
> = props => {
  const {
    item,
    currentItem,
    hasDropdownMenu,
    hasSubItems,
    onItemClick,
    onItemDblClick,
    onItemMouseIn,
    onItemMouseOut,
    partToPreviewStateMap,
    translations,
    chevronButtonRef,
    toggleDropdown,
    isOpen,
    dropdownAnimationState,
  } = props;

  const isCurrentPage = isCurrentItem(item, currentItem);
  const { label, link } = item;
  const hasLink = !isEmptyObject(link);
  const linkRef: RefObject<HTMLAnchorElement> = useRef<HTMLAnchorElement>(null);

  const labelContainerClassNames = classNames(
    classes.labelContainer,
    formatClassNames(shmSemanticClassNames.menuItemWrapper),
    formatClassNames(menuSemanticClassNames.item),
  );

  const isInteractive = (hasSubItems || hasLink) && !isCurrentPage;

  const isDropdownIconOpen =
    isOpen && dropdownAnimationState.phase !== AnimationPhase.ExitActive;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { children, ...itemData } = item;

  return (
    <div
      className={labelContainerClassNames}
      data-selected={isCurrentPage ? true : undefined}
      data-part={MenuParts.MenuItemContent}
      data-preview={partToPreviewStateMap?.item}
      data-interactive={isInteractive}
      onClick={createSDKAction(itemData, isCurrentPage, onItemClick)}
      onMouseEnter={createSDKAction(itemData, isCurrentPage, onItemMouseIn)}
      onMouseLeave={createSDKAction(itemData, isCurrentPage, onItemMouseOut)}
      onDoubleClick={createSDKAction(itemData, isCurrentPage, onItemDblClick)}
    >
      <Link
        ref={linkRef}
        {...link}
        dataPart={MenuParts.MenuItemLink}
        activateByKey="Enter"
        {...(isCurrentPage && {
          'aria-current': 'page',
        })}
      >
        <div className={itemLabelClassNames} data-part={MenuParts.Label}>
          {label}
        </div>
      </Link>
      {hasDropdownMenu && (
        <button
          aria-label={translations.dropdownButtonAriaLabel?.replace(
            '<%= itemName %>',
            label,
          )}
          ref={chevronButtonRef}
          className={classNames(
            classes.dropdownToggleButton,
            !hasSubItems && classes.noDropdownItems,
            !hasLink && classes.coverAllSpace,
          )}
          onClick={toggleDropdown}
          aria-expanded={isOpen}
          aria-haspopup={true}
        >
          <DropdownIcon
            data-part={MenuParts.DropdownIcon}
            data-open={isDropdownIconOpen ? 'true' : undefined}
            className={classNames(
              classes.dropdownIcon,
              formatClassNames(menuSemanticClassNames.itemIcon),
            )}
          />
        </button>
      )}
    </div>
  );
};
