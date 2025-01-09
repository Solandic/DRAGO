import {cartAppCommonModule} from '../common/cartAppCommonModule';
import {cartPopup} from './components/cartPopup/cartPopup';
import {focusOnWidgetOpen} from './directives/focusOnWidgetOpen';
import {CartWidgetPopupService} from './services/CartWidgetPopupService';
import {CartDataService} from '../common/services/CartDataService';
import {CartItemService} from '../common/services/CartItemService';
import {PublicDataSettingsService} from '../common/services/PublicDataSettingsService';
import {cartItemImage} from '../common/directives/CartItemImage';
import {BIEventsList} from '../common/constants/biEventsList';
import {numbersOnly} from './directives/numberOnlyInputDirective';
import {escKey} from './directives/escKey';
import {onSwipe} from './directives/onSwipe';

import 'ng-a11y/dist/nga11yannounce.min.js';
import 'angular-touch/angular-touch.js';
import '!wix-tpa-style-loader?mode=inline!sass-loader?{"includePaths": [".", "node_modules"]}!./mini-cart.scss';
import './mini-cart.scss';
import {successIcon} from '../common/directives/successIcon';
import {quantityComponent} from './components/quantity/quantity';

angular
  .module('cartPopupApp', ['wixAngular', 'fm', 'ngA11y', 'ngTouch', 'rt.debounce', cartAppCommonModule])
  .constant('CART_WIDGET_WIDTH', '100%')
  .constant('BIEventsList', BIEventsList)
  .constant('cartWidgetConstants', {
    EVENT_VIEW_CLOSE: 'Cart.CloseViewCart',
  })
  .component('cartPopup', cartPopup)
  .component('quantityComponent', quantityComponent)
  .component('cartItemImage', cartItemImage)
  .component('successIcon', successIcon)
  .directive('focusOnWidgetOpen', ['$document', focusOnWidgetOpen])
  .directive('escKey', escKey)
  .directive('onSwipe', ['$swipe', onSwipe])
  .directive('numbersOnly', numbersOnly)
  .service('cartWidgetPopupService', CartWidgetPopupService)
  .service('cartDataService', CartDataService)
  .service('cartItemService', CartItemService)
  .service('publicDataSettingsService', PublicDataSettingsService);
