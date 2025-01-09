import { assert } from '../..';
import { withValidation } from '../../validations';
const ariaRequiredSDKFactory = ({ setProps, props }) => ({
    get required() {
        return props.ariaAttributes?.required;
    },
    set required(value) {
        setProps({
            ariaAttributes: {
                ...props.ariaAttributes,
                required: assert.isNil(value) ? undefined : String(value),
            },
        });
    },
});
export const createAriaRequiredSDK = withValidation(ariaRequiredSDKFactory, {
    type: ['object'],
    properties: {
        required: {
            type: ['string', 'boolean'],
            enum: ['false', 'true'],
        },
    },
});
//# sourceMappingURL=ariaRequiredSDKFactory.js.map