'use-client';
import React, { useCallback, useMemo } from 'react';
import {
  getQaDataAttributes,
  formatClassNames,
  getAriaAttributes,
  getDataAttributes,
  containsSubmenu,
} from '@wix/editor-elements-common-utils';
import type { IMenuItemsPropsSDKActions } from '@wix/editor-elements-corvid-utils';
import type {
  IStylableHorizontalMenuImperativeActions,
  IStylableHorizontalMenuProps,
} from '../StylableHorizontalMenu.types';
import semanticClassNames from '../StylableHorizontalMenu.semanticClassNames';
import { st, classes } from './StylableHorizontalMenu.component.st.css';
import scssStyle from './StylableHorizontalMenu.scss';
import { getCurrentMenuItem } from '../../../common/menu/getCurrentMenuItem';
import { useSafariPolyfill } from './utils/useSafariPolyfill';
import { MenuItem } from './components/MenuItem/MenuItem';

const StylableHorizontalMenu: React.ForwardRefRenderFunction<
  IStylableHorizontalMenuImperativeActions,
  IStylableHorizontalMenuProps
> = (props, ref) => {
  const {
    id,
    items,
    submenuProps,
    menuWrapper: MenuWrapper,
    className,
    customClassNames = [],
    stylableClassName,
    containerRootClassName,
    menuMode,
    submenuMode,
    isContainerStretched,
    style,
    slots,
    isQaMode,
    fullNameCompType,
    currentUrl,
    onMouseEnter,
    onMouseLeave,
    onItemMouseIn,
    onItemMouseOut,
    onItemClick,
    onItemDblClick,
    reportBiOnMenuItemClick,
    ariaAttributes,
    role,
    activeAnchor,
    a11y = {},
    screenReader,
    navigationHint,
    shouldUseMegaMenuMouseLeaveLogic,
    shouldWrapIsShownWithTransiton,
  } = props;

  // TODO: split styles into ui-types
  const wrapperClassName = st(
    classes.root,
    {
      menuMode,
    },
    stylableClassName,
    containerRootClassName,
    formatClassNames(semanticClassNames.root, ...customClassNames),
  );

  const onMenuItemClick: IMenuItemsPropsSDKActions['onItemClick'] = useCallback(
    (...args) => {
      reportBiOnMenuItemClick?.(...args);
      onItemClick?.(...args);
    },
    [reportBiOnMenuItemClick, onItemClick],
  );

  const currentItem = useMemo(
    () => getCurrentMenuItem(items, activeAnchor, currentUrl),
    [items, activeAnchor, currentUrl],
  );

  useSafariPolyfill();

  return (
    <div
      id={id}
      className={st(className, scssStyle.root, scssStyle.minSizeOverrides)}
      style={style as React.CSSProperties}
      {...getDataAttributes(props)}
      {...getQaDataAttributes(isQaMode, fullNameCompType)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <MenuWrapper
        ref={ref}
        items={items}
        className={wrapperClassName}
        currentItem={currentItem}
        screenReaderHintElement={
          screenReader?.hasHint ? (
            <div className={scssStyle.navigationAccessibilityHint}>
              {navigationHint}
            </div>
          ) : null
        }
        {...getAriaAttributes({
          ...a11y,
          label: a11y.label ?? 'Site',
          ...ariaAttributes,
          role,
        })}
      >
        {items.map((item, index) => {
          const mode =
            submenuMode === 'flyout' && !item.slot ? 'flyout' : 'column';
          return (
            <MenuItem
              key={index}
              depth={0}
              item={item}
              currentItem={currentItem}
              className={classes.menuItem}
              isContainerStretched={isContainerStretched}
              isColumnStretched={submenuMode === 'columnStretched'}
              submenuProps={submenuProps[mode]!}
              onItemClick={onMenuItemClick}
              onItemMouseIn={onItemMouseIn}
              onItemMouseOut={onItemMouseOut}
              onItemDblClick={onItemDblClick}
              // is needed only in the column mode
              hasColumnSubSubs={mode === 'column' && containsSubmenu(item)}
              slots={slots}
              shouldUseMegaMenuMouseLeaveLogic={
                shouldUseMegaMenuMouseLeaveLogic
              }
              shouldWrapIsShownWithTransiton={shouldWrapIsShownWithTransiton}
            />
          );
        })}
      </MenuWrapper>
    </div>
  );
};

export default React.forwardRef(StylableHorizontalMenu);
