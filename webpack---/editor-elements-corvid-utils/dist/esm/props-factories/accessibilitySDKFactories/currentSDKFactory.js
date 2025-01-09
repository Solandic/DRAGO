import { withValidation } from '../../validations';
import { assert } from '../../assert';
const currentSDKFactory = ({ setProps, props }) => ({
    get current() {
        return props.ariaAttributes?.current;
    },
    set current(value) {
        setProps({
            ariaAttributes: {
                ...props.ariaAttributes,
                current: assert.isNil(value) ? undefined : String(value),
            },
        });
    },
});
export const createCurrentSDK = withValidation(currentSDKFactory, {
    type: ['object'],
    properties: {
        current: {
            type: ['string', 'boolean'],
            enum: ['step', 'page', 'true', 'false', 'location', 'date', 'time'],
        },
    },
});
//# sourceMappingURL=currentSDKFactory.js.map