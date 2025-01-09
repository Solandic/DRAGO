import { CartActions } from '../../../actions/CartActions/CartActions';
import { PageMap } from '@wix/wixstores-client-core';
import { SPECS } from '../../../constants';
export var toCart = function (_a) {
    var context = _a.context, origin = _a.origin;
    return function () {
        if (context.siteStore.experiments.enabled(SPECS.GetCurrentCartFromCacheInVelo)) {
            return context.siteStore.navigate({
                sectionId: PageMap.CART,
                queryParams: { origin: origin },
            }, true);
        }
        return new CartActions({ siteStore: context.siteStore, origin: origin }).navigateToCart(origin);
    };
};
//# sourceMappingURL=toCart.js.map