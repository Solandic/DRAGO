import * as angular from 'angular';

import '@wix/ecommerce-sf-sm-common/dist/src/common/eComSFSMCommonModule.js';
import 'ts-global-module-loader!@wix/wix-ecommerce-common-storefront/dist/statics/app.bundle.js';

try {
  angular.module('ngRaven');
} catch (e) {
  angular.module('ngRaven', []);
}

export const cartAppCommonModule = angular
  .module('cartAppCommon', [
    'eComSFSMCommon',
    'wix-ecommerce-common-storefront',
    'cartAppTranslations',
    'ngRaven',
    'cartAppCommonData',
    'ngAnimate',
  ])
  .config($qProvider => {
    $qProvider.errorOnUnhandledRejections(false);
  })
  .config($locationProvider => {
    $locationProvider.hashPrefix('');
  }).name;
