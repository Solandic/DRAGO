import HamburgerCloseButtonComponent from '../components/HamburgerMenu/HamburgerCloseButton/viewer/HamburgerCloseButton';
import HamburgerCloseButtonController from '../components/HamburgerMenu/HamburgerCloseButton/viewer/HamburgerCloseButton.controller';
import HamburgerMenuContainerComponent from '../components/HamburgerMenu/HamburgerMenuContainer/viewer/HamburgerMenuContainer';
import HamburgerMenuContainerController from '../.components/HamburgerMenu/HamburgerMenuContainer/viewer/HamburgerMenuContainer.controller';
import HamburgerMenuContentComponent from '../components/HamburgerMenu/HamburgerMenuContent/viewer/HamburgerMenuContent';
import HamburgerMenuRootComponent from '../components/HamburgerMenu/HamburgerMenuRoot/viewer/HamburgerMenuRoot';
import HamburgerMenuRootController from '../.components/HamburgerMenu/HamburgerMenuRoot/viewer/HamburgerMenuRoot.controller';
import HamburgerOpenButtonComponent from '../components/HamburgerMenu/HamburgerOpenButton/viewer/HamburgerOpenButton';
import HamburgerOpenButtonController from '../components/HamburgerMenu/HamburgerOpenButton/viewer/HamburgerOpenButton.controller';
import HamburgerOverlayComponent from '../components/HamburgerMenu/HamburgerOverlay/viewer/HamburgerOverlay';
import HamburgerOverlayController from '../components/HamburgerMenu/HamburgerOverlay/viewer/HamburgerOverlay.controller';
import MegaMenuContainerItem_ClassicComponent from '../components/MegaMenuContainerItem/viewer/skinComps/Classic/Classic.skin';
import MegaMenuContainerItem_DropdownComponent from '../components/MegaMenuContainerItem/viewer/skinComps/Dropdown/Dropdown.skin';
import MegaMenuContainerItem_ResponsiveComponent from '../components/MegaMenuContainerItem/viewer/skinComps/Responsive/Responsive.skin';
import MenuComponent from '../components/Menu/viewer/Menu';
import MenuController from '../components/Menu/viewer/Menu.controller';
import StylableHorizontalMenu_DefaultComponent from '../components/StylableHorizontalMenu/viewer/skinComps/Default/Default.skin';
import StylableHorizontalMenu_DefaultController from '../components/StylableHorizontalMenu/viewer/StylableHorizontalMenu.controller';
import StylableHorizontalMenu_ScrollColumnComponent from '../components/StylableHorizontalMenu/viewer/skinComps/ScrollColumn/ScrollColumn.skin';
import StylableHorizontalMenu_ScrollFlyoutComponent from '../components/StylableHorizontalMenu/viewer/skinComps/ScrollFlyout/ScrollFlyout.skin';
import StylableHorizontalMenu_ScrollFlyoutAndColumnComponent from '../components/StylableHorizontalMenu/viewer/skinComps/ScrollFlyoutAndColumn/ScrollFlyoutAndColumn.skin';
import StylableHorizontalMenu_WrapColumnComponent from '../components/StylableHorizontalMenu/viewer/skinComps/WrapColumn/WrapColumn.skin';
import StylableHorizontalMenu_WrapFlyoutComponent from '../components/StylableHorizontalMenu/viewer/skinComps/WrapFlyout/WrapFlyout.skin';
import StylableHorizontalMenu_WrapFlyoutAndColumnComponent from '../components/StylableHorizontalMenu/viewer/skinComps/WrapFlyoutAndColumn/WrapFlyoutAndColumn.skin';
import StylableHorizontalMenuComponent from '../components/StylableHorizontalMenu/viewer/StylableHorizontalMenu';
import SubmenuComponent from '../components/Submenu/viewer/Submenu';


const HamburgerCloseButton = {
  component: HamburgerCloseButtonComponent,
  controller: HamburgerCloseButtonController
};

const HamburgerMenuContainer = {
  component: HamburgerMenuContainerComponent,
  controller: HamburgerMenuContainerController
};

const HamburgerMenuContent = {
  component: HamburgerMenuContentComponent
};

const HamburgerMenuRoot = {
  component: HamburgerMenuRootComponent,
  controller: HamburgerMenuRootController
};

const HamburgerOpenButton = {
  component: HamburgerOpenButtonComponent,
  controller: HamburgerOpenButtonController
};

const HamburgerOverlay = {
  component: HamburgerOverlayComponent,
  controller: HamburgerOverlayController
};

const MegaMenuContainerItem_Classic = {
  component: MegaMenuContainerItem_ClassicComponent
};

const MegaMenuContainerItem_Dropdown = {
  component: MegaMenuContainerItem_DropdownComponent
};

const MegaMenuContainerItem_Responsive = {
  component: MegaMenuContainerItem_ResponsiveComponent
};

const Menu = {
  component: MenuComponent,
  controller: MenuController
};

const StylableHorizontalMenu_Default = {
  component: StylableHorizontalMenu_DefaultComponent,
  controller: StylableHorizontalMenu_DefaultController
};

const StylableHorizontalMenu_ScrollColumn = {
  component: StylableHorizontalMenu_ScrollColumnComponent,
  controller: StylableHorizontalMenu_DefaultController
};

const StylableHorizontalMenu_ScrollFlyout = {
  component: StylableHorizontalMenu_ScrollFlyoutComponent,
  controller: StylableHorizontalMenu_DefaultController
};

const StylableHorizontalMenu_ScrollFlyoutAndColumn = {
  component: StylableHorizontalMenu_ScrollFlyoutAndColumnComponent,
  controller: StylableHorizontalMenu_DefaultController
};

const StylableHorizontalMenu_WrapColumn = {
  component: StylableHorizontalMenu_WrapColumnComponent,
  controller: StylableHorizontalMenu_DefaultController
};

const StylableHorizontalMenu_WrapFlyout = {
  component: StylableHorizontalMenu_WrapFlyoutComponent,
  controller: StylableHorizontalMenu_DefaultController
};

const StylableHorizontalMenu_WrapFlyoutAndColumn = {
  component: StylableHorizontalMenu_WrapFlyoutAndColumnComponent,
  controller: StylableHorizontalMenu_DefaultController
};

const StylableHorizontalMenu = {
  component: StylableHorizontalMenuComponent,
  controller: StylableHorizontalMenu_DefaultController
};

const Submenu = {
  component: SubmenuComponent
};


export const components = {
  ['HamburgerCloseButton']: HamburgerCloseButton,
  ['HamburgerMenuContainer']: HamburgerMenuContainer,
  ['HamburgerMenuContent']: HamburgerMenuContent,
  ['HamburgerMenuRoot']: HamburgerMenuRoot,
  ['HamburgerOpenButton']: HamburgerOpenButton,
  ['HamburgerOverlay']: HamburgerOverlay,
  ['MegaMenuContainerItem_Classic']: MegaMenuContainerItem_Classic,
  ['MegaMenuContainerItem_Dropdown']: MegaMenuContainerItem_Dropdown,
  ['MegaMenuContainerItem_Responsive']: MegaMenuContainerItem_Responsive,
  ['Menu']: Menu,
  ['StylableHorizontalMenu_Default']: StylableHorizontalMenu_Default,
  ['StylableHorizontalMenu_ScrollColumn']: StylableHorizontalMenu_ScrollColumn,
  ['StylableHorizontalMenu_ScrollFlyout']: StylableHorizontalMenu_ScrollFlyout,
  ['StylableHorizontalMenu_ScrollFlyoutAndColumn']: StylableHorizontalMenu_ScrollFlyoutAndColumn,
  ['StylableHorizontalMenu_WrapColumn']: StylableHorizontalMenu_WrapColumn,
  ['StylableHorizontalMenu_WrapFlyout']: StylableHorizontalMenu_WrapFlyout,
  ['StylableHorizontalMenu_WrapFlyoutAndColumn']: StylableHorizontalMenu_WrapFlyoutAndColumn,
  ['StylableHorizontalMenu']: StylableHorizontalMenu,
  ['Submenu']: Submenu
};

