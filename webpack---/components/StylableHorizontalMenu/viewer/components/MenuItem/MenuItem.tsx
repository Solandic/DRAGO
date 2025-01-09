import React, { memo, useRef } from 'react';
import type { IMenuItemProps } from '../../../StylableHorizontalMenu.types';
import { MenuItemContext } from '../../../../../common/menu/MenuItemContext';
import { testIds } from '../../testIds';
import { isCurrentItem } from '../../../../../common/menu/getCurrentMenuItem';
import { MenuItemLabel } from './MenuItemLabel';

export const MenuItem: React.FC<IMenuItemProps> = memo(props => {
  const {
    item,
    depth = 0,
    currentItem,
    className,
    submenuProps: { positionUpdaters, getClasses, injectCssVars },
    slots,
    isColumnStretched,
    isContainerStretched,
    hasColumnSubSubs,
    onItemClick,
    onItemMouseIn,
    onItemMouseOut,
    onItemDblClick,
    shouldUseMegaMenuMouseLeaveLogic,
    shouldWrapIsShownWithTransiton,
  } = props;

  const { label, items, slot } = item;
  const children = slot && slots[slot];
  const positionBoxRef = useRef<HTMLDivElement | null>(null);
  const isStretched = children ? isContainerStretched : isColumnStretched;

  const submenuClasses = getClasses({
    depth,
    isStretched,
    containsChildren: !!children,
    hasColumnSubSubs,
  });
  // inject CSS vars from stylable panel
  const cssVars = injectCssVars?.(depth);

  return (
    <MenuItemLabel
      className={className}
      item={item}
      isCurrentItem={isCurrentItem(item, currentItem)}
      depth={depth}
      isStretched={isStretched}
      hasColumnSubSubs={hasColumnSubSubs}
      withSubItemsClassname={items?.length ? submenuClasses.hasSubItems : ''}
      positionUpdaters={positionUpdaters}
      positionBoxRef={positionBoxRef}
      onItemClick={onItemClick}
      onItemDblClick={onItemDblClick}
      onItemMouseIn={onItemMouseIn}
      onItemMouseOut={onItemMouseOut}
      shouldUseMegaMenuMouseLeaveLogic={shouldUseMegaMenuMouseLeaveLogic}
      shouldWrapIsShownWithTransiton={shouldWrapIsShownWithTransiton}
    >
      {(items?.length || children) && (
        <div
          className={submenuClasses.positionBox}
          ref={positionBoxRef}
          role="group"
          aria-label={label}
          data-testid={testIds.positionBox}
        >
          <div
            className={submenuClasses.animationBox}
            style={cssVars?.animationBox}
          >
            <div className={submenuClasses.alignBox}>
              {children ? (
                <MenuItemContext.Provider value={{ item, currentItem }}>
                  {children}
                </MenuItemContext.Provider>
              ) : (
                <ul className={submenuClasses.list} style={cssVars?.list}>
                  {items!.map((subItem, i) => (
                    <MenuItem
                      {...props}
                      key={i}
                      item={subItem}
                      depth={depth + 1}
                      className={submenuClasses.subItem!}
                      slots={slots}
                    />
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </MenuItemLabel>
  );
});
