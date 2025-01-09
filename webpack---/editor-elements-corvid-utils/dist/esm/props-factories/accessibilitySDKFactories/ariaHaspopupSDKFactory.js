import { assert } from '../..';
import { withValidation } from '../../validations';
const ariaHaspopupSDKFactory = ({ setProps, props }) => ({
    get haspopup() {
        return props.ariaAttributes?.haspopup;
    },
    set haspopup(value) {
        setProps({
            ariaAttributes: {
                ...props.ariaAttributes,
                haspopup: assert.isNil(value) ? undefined : String(value),
            },
        });
    },
});
export const createAriaHaspopupSDK = withValidation(ariaHaspopupSDKFactory, {
    type: ['object'],
    properties: {
        haspopup: {
            type: ['string', 'boolean'],
            enum: ['false', 'true'],
        },
    },
});
//# sourceMappingURL=ariaHaspopupSDKFactory.js.map