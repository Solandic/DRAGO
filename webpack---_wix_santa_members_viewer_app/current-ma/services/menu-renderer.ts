import { membersAreaNavigation } from '@wix/bi-logger-members-app-uou/v2';
import type {
  ControllerFlowAPI,
  ViewerScriptFlowAPI,
} from '@wix/yoshi-flow-editor';

import {
  APP_WIDGET_LOGIN_MENU_ID,
  APP_WIDGET_MEMBERS_MENU_ID,
  Experiment,
  LOGIN_DROPDOWN_MENU_ITEMS_STORAGE_KEY,
  LOGIN_MENU_ID,
  MEMBERS_MENU_ID,
  MEMBERS_MENU_ITEMS_STORAGE_KEY,
  USER_NAME_PATTERN,
} from '../../constants';
import { globalAppState } from '../../services/global-app-state';
import type {
  Experiments,
  Member,
  MemoryStorage,
  MenuItem,
  ParsedConfigItem,
  RolesMap,
  RouterConfig,
  W,
  WixCodeApi,
} from '../../types';
import type { MenuEventItem } from '../../types/menu';
import { log, logError } from '../../utils/monitoring';
import type { PermittedPagesMap } from './groups';
import { buildCurrentPath, replaceUuidWithSlug } from './location';

interface BaseParams {
  $w?: W;
  parsedRoutersConfigs: RouterConfig[];
  currentUser: Member;
  appsCounters: any;
  publicRouterPrefix: string;
  permittedPagesMap?: PermittedPagesMap;
  experiments: Experiments;
  isMobile: boolean;
  memoryStorage: MemoryStorage;
  wixCodeApi?: WixCodeApi;
  flowAPI?: ViewerScriptFlowAPI | ControllerFlowAPI;
  currentUserRoles?: string[];
  viewedUserRoles?: string[];
  menu?: MenuItem;
}

interface LoginButtonParams extends BaseParams {}

interface MenuRenderOptions extends BaseParams {
  $w: W;
  flowAPI: ViewerScriptFlowAPI | ControllerFlowAPI;
  parsedConfigItems: ParsedConfigItem[];
  viewedUser: Member;
}

interface GenericParams {
  menuItem: MenuItem;
  publicRouterConfig?: RouterConfig;
  privateRouterConfig?: RouterConfig;
  viewedUser: Member;
  shouldLog?: boolean;
  menuItems?: MenuItem[];
  userRoles?: RolesMap;
}

interface App {
  appDefId: string;
  numbers: Record<string, any>;
}

interface UpdateMenuParams {
  menuItems: MenuItem[];
  publicRouterConfig?: RouterConfig;
  privateRouterConfig?: RouterConfig;
  viewedUser: Member;
  viewedUserRoles?: string[];
  currentUser?: Member;
  appsCounters?: { apps: App[]; numbers: Record<string, any> };
  parsedRoutersConfigs?: RouterConfig[];
  userRoles?: string[];
  permittedPagesMap?: any;
  experiments?: Experiments | null;
  excludedCounters?: string[];
}

interface GetMenuItemDataFromRouterConfigProps {
  item: MenuEventItem;
  viewedUser: Member;
  parsedRoutersConfigs: RouterConfig[];
}

function getMenuItemDataFromRouterPattern({
  menuItem,
  publicRouterConfig = {},
  privateRouterConfig = {},
  viewedUser,
  shouldLog = true,
}: GenericParams) {
  let menuItemLink = menuItem.link!;

  // Sometimes menu items come with slugs already inserted (not sure how yet), we need to handle that to match router patterns
  if (viewedUser && menuItemLink.indexOf(`/${viewedUser.slug}/`) === 0) {
    menuItemLink = menuItemLink.replace(
      `/${viewedUser.slug}/`,
      `/${USER_NAME_PATTERN}/`,
    );
  }

  const linkParts = menuItemLink.split('/');
  const placeholderIndex = linkParts.indexOf(USER_NAME_PATTERN);
  const isPublicLink = placeholderIndex > -1;

  const linkWithoutPrefix = isPublicLink
    ? '/' + linkParts.splice(placeholderIndex, linkParts.length).join('/')
    : '/' + linkParts[linkParts.length - 1];

  const publicPatterns = publicRouterConfig.patterns || {};
  const privatePatterns = privateRouterConfig.patterns || {};
  const patternData =
    publicPatterns[linkWithoutPrefix] || privatePatterns[linkWithoutPrefix];

  if (!patternData && shouldLog) {
    const tags = { menuItemLink: menuItem.link };
    const extraData = {
      menuItem,
      publicRouterConfig,
      privateRouterConfig,
      viewedUser,
    };
    log(
      'Could not find the pattern for menu item in router configs - probably an invalid (or custom) menu item',
      {
        tags,
        extra: { data: JSON.stringify(extraData) },
      },
    );
  }

  return patternData;
}

function getMenuItemDataFromRouterConfig({
  item,
  viewedUser,
  parsedRoutersConfigs,
}: GetMenuItemDataFromRouterConfigProps) {
  const menuItemLink = item.link.replace(
    `/${viewedUser.slug}/`,
    `/${USER_NAME_PATTERN}/`,
  );

  const publicRouterConfig = parsedRoutersConfigs?.find(
    (config: RouterConfig) => config.type === 'public',
  );
  const privateRouterConfig = parsedRoutersConfigs?.find(
    (config: RouterConfig) => config.type === 'private',
  );

  const linkParts = menuItemLink.split('/');
  const placeholderIndex = linkParts.indexOf(USER_NAME_PATTERN);
  const isPublicLink = placeholderIndex > -1;

  const linkWithoutPrefix = isPublicLink
    ? '/' + linkParts.splice(placeholderIndex, linkParts.length).join('/')
    : '/' + linkParts[linkParts.length - 1];

  const publicPatterns = publicRouterConfig?.patterns || {};
  const privatePatterns = privateRouterConfig?.patterns || {};

  return (
    publicPatterns[linkWithoutPrefix] || privatePatterns[linkWithoutPrefix]
  );
}

function hideRoleRequiringMenuItems({
  menuItems,
  publicRouterConfig,
  privateRouterConfig,
  userRoles = [],
  viewedUser,
}: UpdateMenuParams) {
  return menuItems!.filter((menuItem) => {
    if (!menuItem.link) {
      return true;
    }

    const patternData = getMenuItemDataFromRouterPattern({
      menuItem,
      publicRouterConfig,
      privateRouterConfig,
      viewedUser,
    });

    if (
      !patternData ||
      !patternData.appData ||
      !patternData.appData.visibleForRoles ||
      patternData.appData.visibleForRoles.length === 0
    ) {
      return true;
    }

    const { visibleForRoles = [] } = patternData.appData;
    const isUserMissingTheRole = !visibleForRoles.some(
      (value) => userRoles.indexOf(value) > -1,
    );
    return !isUserMissingTheRole;
  });
}

function replaceMenuItemsPatternsWithSlug({
  menuItems,
  viewedUser,
}: UpdateMenuParams) {
  return menuItems.map((item) => {
    if (item.link && item.link.indexOf(USER_NAME_PATTERN) > -1) {
      item.link = item.link.replace(USER_NAME_PATTERN, viewedUser.slug);
    }

    return item;
  });
}

function addCountersToMenuItems({
  menuItems,
  appsCounters,
  publicRouterConfig,
  privateRouterConfig,
  viewedUser,
  excludedCounters,
}: UpdateMenuParams) {
  // We need to set null to trigger render so counts wouldn't stay from previous user render
  menuItems.forEach((menuItem) => {
    menuItem.displayCount = null;
  });

  if (!appsCounters?.apps?.length) {
    return menuItems;
  }

  appsCounters.apps.forEach((app) => {
    menuItems.forEach((menuItem) => {
      if (!menuItem.link) {
        return;
      }

      const patternData = getMenuItemDataFromRouterPattern({
        menuItem,
        publicRouterConfig,
        privateRouterConfig,
        viewedUser,
      });
      if (patternData && patternData.appData.appDefinitionId === app.appDefId) {
        const numbersKey =
          patternData.appData.numbers && patternData.appData.numbers.key;
        if (!numbersKey || excludedCounters?.includes(numbersKey)) {
          return;
        }
        const appNumberData = app.numbers && app.numbers[numbersKey];
        if (appNumberData) {
          menuItem.displayCount = appNumberData.count;
        }
      }
    });
  });

  return menuItems;
}

function filterHiddenControllerConfigItems({
  menuItems,
  parsedConfigItems,
}: {
  menuItems: MenuItem[];
  parsedConfigItems: ParsedConfigItem[];
}) {
  if (!parsedConfigItems) {
    return;
  }

  return menuItems.filter((item) => {
    const configItem = parsedConfigItems.find(
      (parsedConfigItem) => parsedConfigItem.link === item.link,
    );
    const { isVisibleInMenuBar } = configItem || {};

    return typeof isVisibleInMenuBar === 'boolean' ? isVisibleInMenuBar : true;
  });
}

function filterPrivateItemsForDifferentViewedUser({
  menuItems,
  currentUser,
  viewedUser,
  parsedRoutersConfigs = [],
}: UpdateMenuParams) {
  // In case of no viewedUser id, we treat this case as own menu rendering
  // This happens when the owner drags the menu anywhere else than Members Area pages
  if (!viewedUser.id) {
    return menuItems;
  }

  const isSameUser = currentUser && currentUser.id === viewedUser.id;

  if (isSameUser) {
    return menuItems;
  }

  const privateRouterConfig = parsedRoutersConfigs.find(
    (config: RouterConfig) => config.type === 'private',
  );
  return menuItems.filter((menuItem) => {
    if (!menuItem.link) {
      return true;
    }

    const isItemInPrivateRouter = !!getMenuItemDataFromRouterPattern({
      menuItem,
      viewedUser,
      privateRouterConfig,
      shouldLog: false,
    });
    return !isItemInPrivateRouter;
  });
}

function fixBrokenMenuItems({
  menuItems,
  publicRouterPrefix,
}: {
  menuItems: MenuItem[];
  publicRouterPrefix: string;
}) {
  // Some menu items come without the link property somehow, filtering such ones except for nested items without a link
  const menuItemsWithLinks = menuItems.filter(
    (item) => !!item.link || (item.items && item.items.length > 0),
  );

  // Some menu items come with public prefix of "undefined", resulting in links like "undefined/{userName}/profile", although should be "/profile/{username}/profile"
  // Often these sites MA's are corrupted, but still handling this in order to be more resilient
  // The reason is unclear, but we can fix it with replacing undefined with the public router prefix
  menuItemsWithLinks.forEach((item) => {
    if (
      item.link &&
      item.link.indexOf(`undefined/${USER_NAME_PATTERN}`) === 0
    ) {
      const linkParts = item.link.split('/');
      item.link = `/${publicRouterPrefix}/${USER_NAME_PATTERN}/${linkParts[2]}`;
    }
  });
  // There are cases when menu item comes with a random id already inserted instead of the userName pattern
  // We don't know why yet, so handling this case here
  menuItemsWithLinks.forEach((menuItem) => {
    if (!menuItem.link) {
      return;
    }

    const isPublicLink = menuItem.link.split('/').length === 4;
    if (isPublicLink && menuItem.link.indexOf(USER_NAME_PATTERN) === -1) {
      const linkParts = menuItem.link.split('/');
      // in editorx it's possible to add external links which should be not changed by us
      const isLinkNotExternal =
        linkParts[0] !== 'https:' && linkParts[0] !== 'http:';
      if (isLinkNotExternal) {
        menuItem.link = `/${linkParts[1]}/${USER_NAME_PATTERN}/${linkParts[3]}`;
      }
    }
  });

  return menuItemsWithLinks;
}

function filterEmptySubMenuItems({ menuItems }: { menuItems: MenuItem[] }) {
  return menuItems.filter(
    (item) => !!item.link || (item.items && item.items.length > 0),
  );
}

function getCurrentMenuItemValue({
  slug,
  options,
  wixCodeApi,
}: {
  slug: string;
  options: MenuItem[];
  wixCodeApi: any;
}) {
  const [currentLink] = buildCurrentPath(wixCodeApi).split('?');
  const fixedCurrentLink = replaceUuidWithSlug(currentLink, slug);
  const currentOption = options.find(({ link }) => link === fixedCurrentLink);
  return currentOption ? currentOption.value : null;
}

function registerMenuValueChangeListener({
  menu,
  options,
  wixCodeApi,
}: {
  menu: MenuItem;
  options: MenuItem[];
  wixCodeApi: any;
}) {
  menu.onChange?.(({ target }) => {
    const newValue = target.value;
    const selectedOption = options.find(({ value }) => value === newValue);
    const newLink = (selectedOption || {}).link;

    if (newLink) {
      wixCodeApi.location.to(newLink);
    } else {
      logError('Menu navigation request ignored: ', {
        menu,
        target,
        options,
        newLink,
        api: !!wixCodeApi?.location?.to,
      });
    }
  });
}

function maybeHandleMenuValueChange({
  menu,
  options,
  viewedUser,
  wixCodeApi,
}: {
  menu: MenuItem;
  options: MenuItem[];
  viewedUser: Member;
  wixCodeApi: any;
}) {
  // TODO: Remove feature toggle "specs.thunderbolt.ma_comboboxinputnavigation":
  // 1. We need to handle menu value change only if autoNavigation false.
  // 2. Otherwise, navigation will be handled by the platform.
  const shouldHandleMenuValueChanges = !menu.autoNavigation;
  if (!shouldHandleMenuValueChanges) {
    return;
  }

  const memberSlug = (viewedUser || {}).slug;
  menu.value = getCurrentMenuItemValue({
    slug: memberSlug,
    options,
    wixCodeApi,
  });
  registerMenuValueChangeListener({ menu, options, wixCodeApi });
}

function adjustGenericMenuItems({
  menuItems,
  parsedRoutersConfigs,
  userRoles,
  viewedUser,
  appsCounters,
  excludedCounters,
}: UpdateMenuParams) {
  const publicRouterConfig = parsedRoutersConfigs?.find(
    (config: RouterConfig) => config.type === 'public',
  );
  const privateRouterConfig = parsedRoutersConfigs?.find(
    (config: RouterConfig) => config.type === 'private',
  );

  const roleFilteredMenuItems = hideRoleRequiringMenuItems({
    menuItems,
    publicRouterConfig,
    privateRouterConfig,
    userRoles,
    viewedUser,
  });
  const menuItemsWithCounters = addCountersToMenuItems({
    menuItems: roleFilteredMenuItems,
    appsCounters,
    publicRouterConfig,
    privateRouterConfig,
    viewedUser,
    excludedCounters,
  });

  return replaceMenuItemsPatternsWithSlug({
    menuItems: menuItemsWithCounters,
    viewedUser,
  });
}

function removeNotPermittedMenuItems({
  menuItems,
  parsedRoutersConfigs,
  viewedUser,
  permittedPagesMap,
  experiments,
}: UpdateMenuParams) {
  if (
    experiments &&
    experiments.enabled(Experiment.RestrictedMemberPagePermissions)
  ) {
    const publicRouterConfig = parsedRoutersConfigs?.find(
      (config: RouterConfig) => config.type === 'public',
    );
    const privateRouterConfig = parsedRoutersConfigs?.find(
      (config: RouterConfig) => config.type === 'private',
    );
    return menuItems.filter((menuItem) => {
      const patternData = getMenuItemDataFromRouterPattern({
        menuItem,
        publicRouterConfig,
        privateRouterConfig,
        viewedUser,
      });
      if (!patternData) {
        return true;
      }
      return permittedPagesMap[patternData.page] ?? true;
    });
  }

  return menuItems;
}

function adjustMembersMenuItems({
  menuItems,
  parsedRoutersConfigs = [],
  viewedUserRoles,
  viewedUser,
  currentUser,
  appsCounters,
  parsedConfigItems,
  publicRouterPrefix,
  permittedPagesMap,
  experiments,
}: UpdateMenuParams & {
  parsedConfigItems: ParsedConfigItem[];
  publicRouterPrefix: string;
}) {
  const menuUser = !viewedUser.id && currentUser ? currentUser : viewedUser;
  const fixedMenuItems = fixBrokenMenuItems({
    menuItems,
    publicRouterPrefix,
  });
  // Previously we had controller configurations which were hiding the menu items
  // This is for backwards compatibility and only members menu
  const filteredMenuItems = filterHiddenControllerConfigItems({
    menuItems: fixedMenuItems,
    parsedConfigItems,
  });
  const userAdjustedMenuItems = filterPrivateItemsForDifferentViewedUser({
    menuItems: filteredMenuItems || [],
    currentUser,
    viewedUser,
    parsedRoutersConfigs,
  });
  const permittedMenuItems = removeNotPermittedMenuItems({
    menuItems: userAdjustedMenuItems,
    parsedRoutersConfigs,
    permittedPagesMap,
    viewedUser,
    experiments,
  });
  const newMenuItems = adjustGenericMenuItems({
    menuItems: permittedMenuItems,
    parsedRoutersConfigs,
    userRoles: viewedUserRoles,
    viewedUser: menuUser,
    appsCounters,
    excludedCounters: getExcludedCounters({ experiments }),
  });

  // Recursively iterate through nested items
  newMenuItems.forEach((menuItem) => {
    if (menuItem.items && menuItem.items.length > 0) {
      menuItem.items = adjustMembersMenuItems({
        menuItems: menuItem.items,
        parsedRoutersConfigs,
        viewedUserRoles,
        viewedUser,
        currentUser,
        appsCounters,
        parsedConfigItems,
        publicRouterPrefix,
      });
    }
  });

  return filterEmptySubMenuItems({
    menuItems: newMenuItems,
  });
}

function adjustLoginMenuItems({
  menuItems,
  parsedRoutersConfigs,
  userRoles,
  viewedUser,
  appsCounters,
  publicRouterPrefix,
  permittedPagesMap,
  experiments,
  excludedCounters,
}: UpdateMenuParams & {
  publicRouterPrefix: string;
}) {
  const fixedMenuItems = fixBrokenMenuItems({
    menuItems,
    publicRouterPrefix,
  });
  const permittedMenuItems = removeNotPermittedMenuItems({
    menuItems: fixedMenuItems,
    parsedRoutersConfigs,
    permittedPagesMap,
    viewedUser,
    experiments,
  });
  return adjustGenericMenuItems({
    menuItems: permittedMenuItems,
    parsedRoutersConfigs,
    userRoles,
    viewedUser,
    appsCounters,
    excludedCounters,
  });
}

// TODO: Check the flow when menu is not available
function renderLoginMenu({
  menu,
  parsedRoutersConfigs,
  currentUserRoles,
  currentUser: viewedUser,
  appsCounters,
  memoryStorage,
  publicRouterPrefix,
  permittedPagesMap,
  experiments,
  isMobile,
}: LoginButtonParams & { menu: MenuItem }) {
  const isMobileTinyMenu = Boolean(
    menu?.accountNavBar &&
      menu.accountNavBar.navBarItems &&
      menu.accountNavBar.menuItems &&
      isMobile,
  );
  // lots of assumptions in the next 3 lines
  const navigationBarMenuItems = isMobileTinyMenu
    ? menu.accountNavBar.navBarItems
    : menu.navBarItems || [];
  const dropdownMenuItems = isMobileTinyMenu
    ? menu?.accountNavBar.menuItems
    : menu.menuItems || [];
  const menuKey = `${LOGIN_DROPDOWN_MENU_ITEMS_STORAGE_KEY}-${menu.id}`;

  let defaultItemsFromStorage = JSON.parse(memoryStorage.getItem(menuKey));

  if (!defaultItemsFromStorage) {
    const stringifiedMenuItems = JSON.stringify(dropdownMenuItems);
    memoryStorage.setItem(menuKey, stringifiedMenuItems);
    defaultItemsFromStorage = dropdownMenuItems;
  }

  const adjustedNavigationBarMenuItems = adjustLoginMenuItems({
    menuItems: navigationBarMenuItems as MenuItem[], // crosscheck this one
    parsedRoutersConfigs,
    userRoles: currentUserRoles,
    viewedUser,
    appsCounters,
    publicRouterPrefix,
    permittedPagesMap,
    experiments,
  });
  const adjustedDropdownMenuItems = adjustLoginMenuItems({
    menuItems: defaultItemsFromStorage,
    parsedRoutersConfigs,
    userRoles: currentUserRoles,
    viewedUser,
    appsCounters,
    publicRouterPrefix,
    permittedPagesMap,
    experiments,
    excludedCounters: getExcludedCounters({ experiments }),
  });

  if (isMobileTinyMenu) {
    menu.accountNavBar.navBarItems = adjustedNavigationBarMenuItems;
    menu.accountNavBar.menuItems = adjustedDropdownMenuItems;
  } else {
    menu.navBarItems = adjustedNavigationBarMenuItems;
    menu.menuItems = adjustedDropdownMenuItems;
  }
}

const addOnMenuItemClickHandler = ({
  menu,
  parsedRoutersConfigs,
  viewedUser,
  flowAPI,
}: {
  flowAPI: ViewerScriptFlowAPI | ControllerFlowAPI;
  viewedUser: Member;
  parsedRoutersConfigs: RouterConfig[];
  menu: MenuItem;
}) => {
  return menu.onItemClick(({ item }) => {
    const patternData = getMenuItemDataFromRouterConfig({
      item,
      parsedRoutersConfigs,
      viewedUser,
    });
    const { appDefinitionId, appPageId } = patternData.appData;
    flowAPI.bi?.report(
      membersAreaNavigation({
        pageName: appPageId,
        component: 'ma-navigation',
        originAppId: appDefinitionId,
        action: 'menu-item-click',
      }),
    );
  });
};

function renderMembersMenu({
  wixCodeApi,
  menu,
  parsedRoutersConfigs,
  viewedUserRoles,
  currentUser,
  viewedUser,
  appsCounters,
  parsedConfigItems,
  memoryStorage,
  publicRouterPrefix,
  permittedPagesMap,
  experiments,
  isMobile,
  flowAPI,
}: BaseParams & {
  flowAPI: ViewerScriptFlowAPI | ControllerFlowAPI;
  viewedUser: Member;
  parsedConfigItems: ParsedConfigItem[];
  menu: MenuItem;
}) {
  // Workaround: Mobile ComboBoxInput in Thunderbolt has its items in "options" property instead of in "items"
  // This was needed to comply with the change of how components are rendered in Thunderbolt
  const isMobileThunderboltComboBoxInput =
    isMobile && menu.options !== undefined && menu.items === undefined;
  const menuItems = isMobileThunderboltComboBoxInput
    ? menu.options || []
    : menu.items || [];
  const menuKey = `${MEMBERS_MENU_ITEMS_STORAGE_KEY}-${menu.id}`;

  let defaultItemsFromStorage = JSON.parse(memoryStorage.getItem(menuKey));

  if (!defaultItemsFromStorage) {
    const stringifiedMenuItems = JSON.stringify(menuItems);
    memoryStorage.setItem(menuKey, stringifiedMenuItems);
    defaultItemsFromStorage = menuItems;
  }

  const adjustedMenuItems = adjustMembersMenuItems({
    menuItems: defaultItemsFromStorage,
    parsedRoutersConfigs,
    viewedUserRoles,
    currentUser,
    viewedUser,
    appsCounters,
    parsedConfigItems,
    publicRouterPrefix,
    permittedPagesMap,
    experiments,
  });

  addOnMenuItemClickHandler({
    menu,
    parsedRoutersConfigs,
    flowAPI,
    viewedUser,
  });

  if (isMobileThunderboltComboBoxInput) {
    menu.options = adjustedMenuItems;
    maybeHandleMenuValueChange({
      menu,
      options: adjustedMenuItems,
      viewedUser,
      wixCodeApi,
    });
  } else {
    menu.items = adjustedMenuItems;
  }
}

function getExcludedCounters({
  experiments,
}: {
  experiments: UpdateMenuParams['experiments'];
}) {
  const shouldHideNotifications = experiments?.enabled(
    Experiment.HideNotificationsCounterInDropdownAndMemberMenus,
  );
  if (shouldHideNotifications) {
    return ['notificationsCount'];
  }
  return [];
}

export function renderLoginMenus({
  $w,
  parsedRoutersConfigs = [],
  currentUserRoles,
  currentUser,
  appsCounters,
  memoryStorage,
  publicRouterPrefix,
  permittedPagesMap = {},
  experiments,
  isMobile,
}: BaseParams) {
  if (currentUser.loggedIn) {
    const loginMenus = $w!(LOGIN_MENU_ID);
    const appWidgetsLoginMenus = $w!(APP_WIDGET_LOGIN_MENU_ID);
    loginMenus.forEach((menu) =>
      renderLoginMenu({
        menu,
        parsedRoutersConfigs,
        currentUserRoles,
        currentUser,
        appsCounters,
        memoryStorage,
        publicRouterPrefix,
        permittedPagesMap,
        experiments,
        isMobile,
      }),
    );
    appWidgetsLoginMenus.forEach((menu) =>
      renderLoginMenu({
        menu,
        parsedRoutersConfigs,
        currentUserRoles,
        currentUser,
        appsCounters,
        memoryStorage,
        publicRouterPrefix,
        permittedPagesMap,
        experiments,
        isMobile,
      }),
    );
    globalAppState.setMembersLoginWidgets([
      ...globalAppState.getMembersLoginWidgets(),
      ...loginMenus,
      ...appWidgetsLoginMenus,
    ]);
  }
}

export function renderMembersMenus({
  $w,
  wixCodeApi,
  parsedRoutersConfigs = [],
  viewedUserRoles = [],
  currentUser,
  viewedUser,
  appsCounters,
  parsedConfigItems,
  memoryStorage,
  publicRouterPrefix,
  permittedPagesMap = {},
  experiments,
  isMobile,
  flowAPI,
}: MenuRenderOptions) {
  const membersMenus = $w!(MEMBERS_MENU_ID);
  const appWidgetsMembersMenus = $w!(APP_WIDGET_MEMBERS_MENU_ID);
  membersMenus.forEach((menu) =>
    renderMembersMenu({
      wixCodeApi,
      menu,
      parsedRoutersConfigs,
      viewedUserRoles,
      currentUser,
      viewedUser,
      appsCounters,
      parsedConfigItems,
      memoryStorage,
      publicRouterPrefix,
      permittedPagesMap,
      experiments,
      isMobile,
      flowAPI,
    }),
  );
  appWidgetsMembersMenus.forEach((menu) =>
    renderMembersMenu({
      wixCodeApi,
      menu,
      parsedRoutersConfigs,
      viewedUserRoles,
      currentUser,
      viewedUser,
      appsCounters,
      parsedConfigItems,
      memoryStorage,
      publicRouterPrefix,
      permittedPagesMap,
      experiments,
      isMobile,
      flowAPI,
    }),
  );
}

export function renderEmptyMemberMenus($w: W) {
  const membersMenus = $w(MEMBERS_MENU_ID);
  const appWidgetsMembersMenus = $w(APP_WIDGET_MEMBERS_MENU_ID);
  membersMenus.forEach((menu) => {
    menu.items = [];
  });
  appWidgetsMembersMenus.forEach((menu) => {
    menu.items = [];
  });
}
