import cn from 'clsx';
import type { IMenuItemSDKAction } from '@wix/editor-elements-corvid-utils';
import React, { useState, useEffect, useRef, startTransition } from 'react';
import Link from '@wix/thunderbolt-elements/components/Link';
import { testIds } from '../../testIds';
import type {
  IMenuItemLabelProps,
  MenuItemProps,
} from '../../../StylableHorizontalMenu.types';
import { getIsRTL } from '../../../../../common/menu/getIsRTL';
import { getLabelClasses } from './styles/getLabelClasses';
import { getItemDepthSelector } from '../../../../../common/menu';
import { MegaMenuContextProvider } from '../../../../MegaMenuContainerItem/viewer/MegaMenuContext';

const createEventListeners = (
  setIsHovered: (val: React.SetStateAction<boolean>) => void,
) => {
  const showSubmenu = () => setIsHovered(true);
  const hideSubmenu = () => setIsHovered(false);
  const toggleSubmenu = () => setIsHovered(isHovered => !isHovered);

  return {
    onMouseEnter: showSubmenu,
    onMouseLeave: hideSubmenu,
    onFocus: (e: React.FocusEvent) => {
      const isFromChildToParent = e.target.nextSibling?.contains(
        e.relatedTarget,
      );
      const focusLeavesMenuItem = (e.relatedTarget as HTMLElement)?.dataset
        .itemLabel;

      if (isFromChildToParent && focusLeavesMenuItem) {
        e.stopPropagation();

        hideSubmenu();
      } else {
        showSubmenu();
      }
    },
    onBlur: (e: React.FocusEvent) => {
      if (
        e.relatedTarget &&
        !e.currentTarget.contains(e.relatedTarget) &&
        !e.relatedTarget?.contains(e.currentTarget) // Fixes Mobile Safari blur issue where clicking submenu links closes it, blocking navigation. Details: ECL-8426
      ) {
        hideSubmenu();
      }
    },
    onKeyDown: (e: React.KeyboardEvent) => {
      const { target, currentTarget, key } = e;

      const menuItemLabel = currentTarget.firstChild as HTMLElement;
      if (menuItemLabel !== target) {
        return;
      }

      switch (key) {
        case 'ArrowLeft':
        case 'ArrowRight':
          const isRtl = getIsRTL(currentTarget.parentElement as HTMLElement);

          const arrowToSibling = {
            ArrowLeft: isRtl ? 'nextSibling' : 'previousSibling',
            ArrowRight: isRtl ? 'previousSibling' : 'nextSibling',
          } as const;

          const siblingNavigateTo = currentTarget[arrowToSibling[key]];
          (siblingNavigateTo?.firstChild as HTMLElement)?.focus();
          break;

        case 'Escape':
          hideSubmenu();

          const depth = currentTarget.getAttribute('data-item-depth');

          if (depth !== null) {
            const parentNavigateTo = currentTarget.closest(
              getItemDepthSelector(parseInt(depth, 10) - 1),
            );

            (parentNavigateTo?.firstChild as HTMLElement)?.focus();
          }

          break;

        case 'Enter':
          toggleSubmenu();

          break;

        case ' ':
          e.preventDefault();

          toggleSubmenu();

          break;

        default:
          break;
      }
    },
  };
};

const createSDKAction = (
  item: MenuItemProps,
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

export const MenuItemLabel: React.FC<IMenuItemLabelProps> = ({
  item,
  className,
  withSubItemsClassname,
  isCurrentItem: isCurrentPage,
  depth,
  isStretched,
  hasColumnSubSubs,
  positionUpdaters: positionUpdatersMap,
  positionBoxRef,
  children,
  onItemClick,
  onItemDblClick,
  onItemMouseIn,
  onItemMouseOut,
  shouldUseMegaMenuMouseLeaveLogic,
  shouldWrapIsShownWithTransiton,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isShown, setIsShown] = useState(false);
  const labelRef = useRef<HTMLAnchorElement | HTMLDivElement | null>(null);

  const { label, link, forceHovered = false } = item;
  const eventListeners = createEventListeners(setIsHovered);

  const isHeading = hasColumnSubSubs && depth === 1;
  const classes = getLabelClasses({
    depth,
    isHovered: isHeading ? false : isHovered,
    isCurrentPage,
    className,
  });

  const positionUpdaters = positionUpdatersMap[depth];
  useEffect(() => {
    if (
      !isHovered ||
      !labelRef.current ||
      !positionBoxRef.current ||
      !positionUpdaters
    ) {
      return;
    }

    const { onEnter, onLeave } = positionUpdaters({
      label: labelRef.current,
      positionBox: positionBoxRef.current,
      isStretched,
    });
    onEnter();
    if (shouldWrapIsShownWithTransiton) {
      startTransition(() => setIsShown(true));
    } else {
      setIsShown(true);
    }
    return () => {
      onLeave();
      setIsShown(false);
    };
  }, [
    isHovered,
    isStretched,
    positionBoxRef,
    positionUpdaters,
    item,
    shouldWrapIsShownWithTransiton,
  ]);

  useEffect(() => {
    setIsHovered(forceHovered);
  }, [forceHovered]);

  // TODO: remove after experiment is merged
  const MegaMenuWrapper = shouldUseMegaMenuMouseLeaveLogic
    ? MegaMenuContextProvider
    : React.Fragment;

  return (
    <li
      className={cn(classes.itemWrapper, withSubItemsClassname)}
      data-testid={testIds.menuItem(depth)}
      data-item-depth={depth}
      data-is-current={isCurrentPage}
      aria-current={isCurrentPage}
      {...(isHovered && {
        'data-hovered': true,
      })}
      {...(isShown && {
        'data-shown': true,
      })}
      {...eventListeners}
    >
      <Link
        {...link}
        className={classes.root}
        ref={labelRef}
        activateByKey="Enter"
        onClick={createSDKAction(item, isCurrentPage, onItemClick)}
        onMouseEnter={createSDKAction(item, isCurrentPage, onItemMouseIn)}
        onMouseLeave={createSDKAction(item, isCurrentPage, onItemMouseOut)}
        onDoubleClick={createSDKAction(item, isCurrentPage, onItemDblClick)}
        {...(!!children && {
          'aria-haspopup': true,
          'aria-expanded': isHovered,
        })}
        {...(!!children &&
          !link?.href && {
            role: 'button',
          })}
        tabIndex={0}
        data-item-label
      >
        <div className={classes.container}>
          <span className={classes.label}>{label}</span>
        </div>
      </Link>
      <MegaMenuWrapper
        labelRef={labelRef}
        isOpen={shouldWrapIsShownWithTransiton ? isShown : isHovered}
        setIsOpen={shouldWrapIsShownWithTransiton ? setIsShown : setIsHovered}
      >
        {children}
      </MegaMenuWrapper>
    </li>
  );
};
