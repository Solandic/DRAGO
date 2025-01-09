import { withValidation } from '../../validations';
import { assert } from '../../assert';
const tabIndexSDKFactory = ({ setProps, props }) => ({
    get tabIndex() {
        return props.tabIndex;
    },
    set tabIndex(value) {
        setProps({
            tabIndex: assert.isNil(value) ? undefined : value,
        });
    },
});
export const createTabIndexSDK = withValidation(tabIndexSDKFactory, {
    type: ['object'],
    properties: {
        tabIndex: {
            type: ['number'],
            enum: [0, -1],
        },
    },
});
//# sourceMappingURL=tabIndexSDKFactory.js.map