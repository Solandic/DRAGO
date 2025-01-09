import type { Experiments } from '@wix/yoshi-flow-editor';
import { action, makeObservable } from 'mobx';

import MenuServiceBase from '../../../../services/menu-service-base';
import type {
  I$WWrapper,
  MenuContextWithMAPrefix,
  MenuItem,
  MenuServiceBase as IMenuServiceBase,
  MenuServiceWithMAPrefix as IMenuServiceWithMAPrefix,
  StateServiceWithMAPrefix,
} from '../../../../types';

const SLUG_PLACEHOLDERS = ['{userName}', 'my'];
const SLUG_INDEX = 1;

export class MenuService
  extends MenuServiceBase<MenuContextWithMAPrefix, StateServiceWithMAPrefix>
  implements IMenuServiceWithMAPrefix
{
  constructor(
    $w: I$WWrapper,
    stateService: StateServiceWithMAPrefix,
    experiments: Experiments,
  ) {
    super($w, stateService, experiments);

    makeObservable<
      this,
      Exclude<keyof IMenuServiceWithMAPrefix, keyof IMenuServiceBase>
    >(this, {
      initializeMenuItems: action,
    });
  }

  initializeMenuItems(menuContext: MenuContextWithMAPrefix) {
    this.menuContext = menuContext;

    if (this.menuContext.cacheService.hasLoginMenuItems()) {
      this.menuItems = this.menuContext.cacheService.getLoginMenuItems();
      this.bindMenuItems();
      return;
    }

    this.filterMenuItemsVisibleForRoles();
    this.fillMenuItemsWithSlugs();
    this.setNotificationsCount();
    this.menuContext.cacheService.setLoginMenuItems(this.menuItems);
    this.bindMenuItems();
  }

  private fillMenuItemsWithSlugs() {
    const { currentUser } = this.menuContext;
    const slugOrId = currentUser?.profile?.slug ?? currentUser?.id;

    if (!slugOrId) {
      return;
    }

    this.menuItems = this.menuItems.map((item) =>
      this.updateMenuItemWithMemberSlug(item, slugOrId),
    );
  }

  private updateMenuItemWithMemberSlug(item: MenuItem, slugOrId: string) {
    const slugPlaceholder = this.getSlugPlaceholderFromMenuItem(item);

    if (this.isValidSlugPlaceholder(slugPlaceholder)) {
      return this.replaceLinkInMenuItem(item, slugOrId);
    }

    return item;
  }

  private isValidSlugPlaceholder(slugPlaceholder: string): boolean {
    return SLUG_PLACEHOLDERS.includes(slugPlaceholder);
  }

  private replaceLinkInMenuItem(item: MenuItem, replacementSlug: string) {
    const memberPageRelativePathItems =
      this.getMemberPageRelativePathItemsFromMenuItem(item);

    if (!memberPageRelativePathItems.length) {
      return item;
    }

    const link = item.link.replace(
      memberPageRelativePathItems.join('/'),
      this.getMemberPageRelativePathWithMemberSlug(
        memberPageRelativePathItems,
        replacementSlug,
      ),
    );

    return { ...item, link };
  }

  private getMemberPageRelativePathWithMemberSlug(
    membersAreaPageRelativePathItems: string[],
    replacementSlug: string,
  ) {
    return membersAreaPageRelativePathItems
      .map((item, index) => (index === SLUG_INDEX ? replacementSlug : item))
      .join('/');
  }

  private getSlugPlaceholderFromMenuItem(item: MenuItem) {
    const membersAreaPageRelativePathItems =
      this.getMemberPageRelativePathItemsFromMenuItem(item);

    return membersAreaPageRelativePathItems[SLUG_INDEX] ?? '';
  }

  private getMemberPageRelativePathItemsFromMenuItem(item: MenuItem) {
    const { membersAreaPagePrefix } = this.menuContext;
    const indexOfMembersAreaPagePrefix = item.link.indexOf(
      membersAreaPagePrefix,
    );

    return item.link.slice(indexOfMembersAreaPagePrefix).split('/');
  }
}
