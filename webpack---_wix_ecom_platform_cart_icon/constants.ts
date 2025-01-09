export const POPUP_URL = 'https://ecom.wix.com/storefront/cartwidgetPopup';
export const EMPTY_CART_GUID = '00000000-000000-000000-000000000000';
export const CART_ICON_APP_NAME = 'wixstores-cart-icon';

export const SPECS = {
  USE_LIGHTBOXES: 'specs.stores.UseLightboxes',
  NoCssInOOIBundle: 'specs.stores.NoCssInOOIBundle',
  CartIconNoCssInOOIBundle: 'specs.stores.CartIconNoCssInOOIBundle',
  CartIconEditorFlowMigrate: 'specs.stores.CartIconEditorFlowMigrate',
  NavigateToCartWhenDontShowSideCartOnMobile: 'specs.stores.NavigateToCartWhenDontShowSideCartOnMobile',
  UseNavigateToCartFromCurrentCartService: 'specs.stores.UseNavigateToCartFromCurrentCartService',
  RemoveHrefFromCartIconOnSsr: 'specs.stores.RemoveHrefFromCartIconOnSsr',
  CartIconCssVarsCssOptimization: 'specs.stores.CartIconCssVarsCssOptimization',
  StopUsingCartActionInCartIcon: 'specs.stores.StopUsingCartActionInCartIcon',
  MoveMiniCartInitialization: 'specs.stores.MoveMiniCartInitialization',
};

// eslint-disable-next-line no-shadow
export enum FedopsInteraction {
  ADD_TO_CART = 'velo-add-to-cart',
  ADD_ITEMS_TO_CART = 'velo-add-items-to-cart',
  CART_ICON_LOADED = 'cart-icon-loaded',
}

export const origin = 'cart-icon';
