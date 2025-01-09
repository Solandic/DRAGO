'use-client';
import React, { useCallback, useMemo } from 'react';
import type { IMenuProps } from '../Menu.types';
import { MenuContextProvider } from './MenuContext';
import MenuContent from '../MenuContent/viewer/MenuContent';
import classes from './style/Menu.scss';
import ResponsiveContainer from '@wix/thunderbolt-elements/components/ResponsiveContainer';
import { MENU_CONTENT_ID_PREFIX } from './constants';
import { getAnimationPackage as _getAnimationPackage } from './utils/animationUtils';

const Menu: React.FC<IMenuProps> = props => {
  const {
    id,
    containerRootClassName,
    containerProps,
    customClassNames = [],
    children,
    slots,
    items,
    partToPreviewStateMap,
    currentUrl,
    activeAnchor,
    onItemMouseIn,
    onItemMouseOut,
    onItemClick,
    onItemDblClick,
    onMouseEnter,
    onMouseLeave,
    translations,
    navAriaLabel,
  } = props;

  const itemsWithChildren = useMemo(
    () =>
      slots
        ? items.map(item => ({
            ...item,
            children: item.slot && slots[item.slot],
          }))
        : items,
    [items, slots],
  );

  const getAnimationPackage = useCallback(() => _getAnimationPackage(id), [id]);

  return (
    <div
      id={id}
      className={containerRootClassName}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <MenuContextProvider
        items={itemsWithChildren}
        partToPreviewStateMap={partToPreviewStateMap}
        currentUrl={currentUrl}
        activeAnchor={activeAnchor}
        translations={translations}
        menuStyleId={`${MENU_CONTENT_ID_PREFIX}${id}`}
        customClassNames={customClassNames}
        getAnimationPackage={getAnimationPackage}
        navAriaLabel={navAriaLabel}
      >
        <ResponsiveContainer {...containerProps}>
          {(...args: Parameters<typeof children>) => (
            <>
              <MenuContent
                id={`${id}-menu-content`}
                className={classes.navbar}
                onItemMouseIn={onItemMouseIn}
                onItemMouseOut={onItemMouseOut}
                onItemClick={onItemClick}
                onItemDblClick={onItemDblClick}
              />
              {children(...args)}
            </>
          )}
        </ResponsiveContainer>
      </MenuContextProvider>
    </div>
  );
};

export default Menu;
