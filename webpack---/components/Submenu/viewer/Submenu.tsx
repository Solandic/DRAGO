'use-client';
import * as React from 'react';
import cn from 'clsx';
import {
  formatClassNames,
  getDataAttributes,
} from '@wix/editor-elements-common-utils';
import type { MenuItemProps } from '@wix/editor-elements-definitions';
import type { FC } from 'react';
import type { SubmenuPreviewMapperProps, SubmenuProps } from '../types';
import { useMenuItemContext } from '../../../common/menu/MenuItemContext';
import { isCurrentItem } from '../../../common/menu/getCurrentMenuItem';
import styles from './Submenu.scss';
import menuItemStyles from '../../Menu/viewer/components/MenuItem/style/MenuItem.scss';
import Link from '@wix/thunderbolt-elements/src/components/Link/viewer/Link';
import { TestIds } from './constants';
import {
  getItemDepthSelector,
  subItemDepthLevel,
  subSubItemDepthLevel,
} from '../../../common/menu';
import { semanticClassNames as dropdownSemanticClassNames } from '../Submenu.semanticClassNames';
import { DataHooks } from '../constants';
import { MenuParts } from '../../Menu/viewer/constants';

type ItemListProps = SubmenuPreviewMapperProps & {
  items: Array<MenuItemProps>;
  currentItem?: MenuItemProps;
  isRootLevel?: boolean;
  onEscKeyDown?: () => void;
  customClassNames?: Array<string>;
};

const ItemList: FC<ItemListProps> = ({
  items,
  currentItem,
  isRootLevel = true,
  partToPreviewStateMap,
  onEscKeyDown,
  customClassNames = [],
}) => {
  const subMenuContainerClasses = cn(
    isRootLevel ? styles.list : styles.subList,
    menuItemStyles.dropdownMenu,
    {
      [formatClassNames(dropdownSemanticClassNames.root, ...customClassNames)]:
        isRootLevel,
    },
  );

  const submenuItemLinkClasses = (isCurrent: boolean) => {
    return cn(
      isRootLevel ? styles.item : styles.subItem,

      {
        [styles.selected]: isCurrent,
      },
      isRootLevel
        ? {
            [formatClassNames(dropdownSemanticClassNames.dropdownItem)]: true,
          }
        : {
            [formatClassNames(dropdownSemanticClassNames.dropdownSubItem)]:
              true,
          },
    );
  };

  const submenuItemLabelClasses = cn(
    isRootLevel ? styles.itemLabel : styles.subItemLabel,
    isRootLevel
      ? formatClassNames(dropdownSemanticClassNames.dropdownItemLabel)
      : formatClassNames(dropdownSemanticClassNames.dropdownSubItemLabel),
  );

  return (
    <ul
      className={subMenuContainerClasses}
      style={
        {
          '--items-number': items.length,
        } as React.CSSProperties
      }
      onKeyDown={e => {
        if (e.key === 'Escape') {
          if (onEscKeyDown) {
            onEscKeyDown();

            return;
          }

          const target = e.target as HTMLElement;
          const parentListItem = target.closest('li') as HTMLElement;

          const parentNavigateTo = parentListItem.closest(
            getItemDepthSelector(0),
          );

          (parentNavigateTo?.firstChild as HTMLElement)?.focus();
        }
      }}
    >
      {items.map((item, i) => {
        const { items: subItems, link, label } = item;
        const isCurrent = isCurrentItem(item, currentItem);

        return (
          <li
            className={cn({ [styles.listItem]: !isRootLevel })}
            key={i}
            data-item-depth={
              // FYI: For submenu root level is sub item level
              isRootLevel ? subItemDepthLevel : subSubItemDepthLevel
            }
          >
            <Link
              {...link}
              className={submenuItemLinkClasses(isCurrent)}
              dataPart={
                isRootLevel ? MenuParts.DropdownItem : MenuParts.DropdownSubItem
              }
              dataPreview={
                partToPreviewStateMap?.[isRootLevel ? 'item' : 'sub-item']
              }
              onFocus={e => {
                e.stopPropagation();
              }}
              {...(isCurrent && {
                'aria-current': 'page',
              })}
            >
              <span
                className={submenuItemLabelClasses}
                data-selected={isCurrent ? 'true' : undefined}
                data-part={
                  isRootLevel
                    ? MenuParts.DropdownItemLabel
                    : MenuParts.DropdownSubItemLabel
                }
                data-testid={
                  isRootLevel ? TestIds.itemLabel : TestIds.subItemLabel
                }
              >
                {label}
              </span>
            </Link>

            {!!subItems?.length && (
              <ItemList
                partToPreviewStateMap={partToPreviewStateMap}
                items={subItems}
                isRootLevel={false}
                currentItem={currentItem}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
};

const Submenu: React.FC<SubmenuProps> = props => {
  const { id, partToPreviewStateMap, customClassNames = [] } = props;
  const { item, currentItem, onEscKeyDown } = useMenuItemContext();

  return (
    <div
      id={id}
      {...getDataAttributes(props)}
      className={styles.root}
      data-hook={DataHooks.submenu}
    >
      <ItemList
        partToPreviewStateMap={partToPreviewStateMap}
        items={item.items || []}
        currentItem={currentItem}
        onEscKeyDown={onEscKeyDown}
        customClassNames={customClassNames}
      />
    </div>
  );
};

export default Submenu;
