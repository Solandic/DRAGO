import type {
  LinkProps,
  MenuItemProps,
  ActiveAnchor,
} from '@wix/editor-elements-definitions';

const removeQueryFromUrl = (url: string): string => url.split('?')[0];

const isDefaultAnchor = (activeAnchor: ActiveAnchor) => {
  return (
    activeAnchor.dataId === 'SCROLL_TO_TOP' ||
    activeAnchor.dataId === 'SCROLL_TO_BOTTOM'
  );
};

const isCurrentAnchor = (activeAnchor: ActiveAnchor, link?: LinkProps) => {
  if (!link || link.type !== 'AnchorLink') {
    return false;
  }

  const isSameCompId =
    link.anchorCompId && link.anchorCompId === activeAnchor.compId;

  const isSameDataId =
    link.anchorDataId && link.anchorDataId === activeAnchor.dataId;

  return Boolean(isSameCompId || isSameDataId);
};

const flattenMenuItems = (items: Array<MenuItemProps>) => {
  const result = [] as Array<MenuItemProps>;

  items.forEach(item => {
    result.push(item);

    if (item.items) {
      result.push(...item.items);

      item.items.forEach(nestedItem => {
        result.push(...(nestedItem.items || []));
      });
    }
  });

  return result;
};

export const getCurrentMenuItem = (
  items: Array<MenuItemProps>,
  activeAnchor?: ActiveAnchor,
  currentPageHref?: string,
): MenuItemProps | undefined => {
  const flatItems = flattenMenuItems(items);
  // Provided by Velo API to force the current page to be highlighted/unhighlighted
  const selectedFromVelo = flatItems.find(item => item.selected);

  if (selectedFromVelo) {
    return selectedFromVelo;
  }

  if (activeAnchor && !isDefaultAnchor(activeAnchor)) {
    const currentItem = flatItems.find(menuItem =>
      isCurrentAnchor(activeAnchor, menuItem.link),
    );

    if (currentItem) {
      return currentItem;
    }
  }

  return flatItems.find(({ link }) => {
    if (!link) {
      return false;
    }

    return (
      link.type !== 'AnchorLink' &&
      decodeURIComponent(removeQueryFromUrl(link.href || '')) ===
        currentPageHref
    );
  });
};

const isSameAnchorLinks = (first: LinkProps, second: LinkProps) => {
  return (
    first.anchorCompId === second.anchorCompId &&
    first.anchorDataId === second.anchorDataId
  );
};

const isSameVeloSelectedItem = (
  item: MenuItemProps,
  currentItem: MenuItemProps,
) => {
  return item.selected === true && item.label === currentItem.label;
};

export const isCurrentItem = (
  item: MenuItemProps,
  currentItem?: MenuItemProps,
) => {
  if (!currentItem) {
    return false;
  }

  if (currentItem.selected === true) {
    return isSameVeloSelectedItem(item, currentItem);
  }

  if (!item.link || !currentItem.link) {
    return false;
  }

  const { link: firstLink } = item;
  const { link: secondLink } = currentItem;

  if (firstLink.type !== secondLink.type) {
    return false;
  }

  if (firstLink.type === 'AnchorLink') {
    return isSameAnchorLinks(firstLink, secondLink);
  }

  return firstLink.href === secondLink.href;
};
