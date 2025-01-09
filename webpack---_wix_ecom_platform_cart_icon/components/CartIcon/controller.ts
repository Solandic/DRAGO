/* eslint-disable import/no-default-export */
import {CartIconController} from './Controller/CartIconController';
// eslint-disable-next-line import/no-extraneous-dependencies
import {controllerFactory} from '@wix/wixstores-client-storefront-sdk';

//@ts-expect-error
export default controllerFactory(CartIconController, {shouldSkipMultilingual: true});
