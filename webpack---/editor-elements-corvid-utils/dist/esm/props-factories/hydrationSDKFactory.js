import { registerCorvidEvent } from '../corvidEvents';
export const hydrationSDKFactory = api => {
    return {
        onHydrationComplete: handler => registerCorvidEvent('onHydrationComplete', api, handler),
    };
};
//# sourceMappingURL=hydrationSDKFactory.js.map