import { withValidation } from '../../validations';
import { assert } from '../../assert';
const atomicSDKFactory = ({ setProps, props }) => ({
    get atomic() {
        return props.ariaAttributes?.atomic;
    },
    set atomic(value) {
        setProps({
            ariaAttributes: {
                ...props.ariaAttributes,
                atomic: assert.isNil(value) ? undefined : String(value),
            },
        });
    },
});
export const createAtomicSDK = withValidation(atomicSDKFactory, {
    type: ['object'],
    properties: {
        atomic: {
            type: ['boolean', 'string'],
            enum: ['false', 'true'],
        },
    },
});
//# sourceMappingURL=atomicSDKFactory.js.map