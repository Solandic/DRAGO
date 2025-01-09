import { withValidation } from '../../validations';
import { assert } from '../../assert';
const expandedSDKFactory = ({ setProps, props }) => ({
    get expanded() {
        return props.ariaAttributes?.expanded;
    },
    set expanded(value) {
        setProps({
            ariaAttributes: {
                ...props.ariaAttributes,
                expanded: assert.isNil(value) ? undefined : String(value),
            },
        });
    },
});
export const createExpandedSDK = withValidation(expandedSDKFactory, {
    type: ['object'],
    properties: {
        expanded: {
            type: ['boolean', 'string'],
            enum: ['false', 'true'],
        },
    },
});
//# sourceMappingURL=expandedSDKFactory.js.map