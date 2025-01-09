import { assert } from '../../assert';
import { withValidation } from '../../validations';
const busySDKFactory = ({ setProps, props }) => ({
    get busy() {
        return props.ariaAttributes?.busy;
    },
    set busy(value) {
        setProps({
            ariaAttributes: {
                ...props.ariaAttributes,
                busy: assert.isNil(value) ? undefined : String(value),
            },
        });
    },
});
export const createBusySDK = withValidation(busySDKFactory, {
    type: ['object'],
    properties: {
        busy: {
            type: ['boolean', 'string'],
            enum: ['false', 'true'],
        },
    },
});
//# sourceMappingURL=busySDKFactory.js.map