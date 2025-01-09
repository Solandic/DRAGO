import { withValidation } from '../../validations';
import { assert } from '../../assert';
const relevantSDKFactory = ({ setProps, props }) => ({
    get relevant() {
        return props.ariaAttributes?.relevant;
    },
    set relevant(value) {
        setProps({
            ariaAttributes: {
                ...props.ariaAttributes,
                relevant: assert.isNil(value) ? undefined : value,
            },
        });
    },
});
export const createRelevantSDK = withValidation(relevantSDKFactory, {
    type: ['object'],
    properties: {
        relevant: {
            type: ['string'],
            enum: ['additions', 'additions text', 'all', 'removals', 'text'],
        },
    },
});
//# sourceMappingURL=relevantSDKFactory.js.map