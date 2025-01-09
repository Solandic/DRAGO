import { withValidation } from '../../validations';
import { assert } from '../../assert';
const roleSDKFactory = ({ setProps, props, }) => ({
    get role() {
        return props.role;
    },
    set role(value) {
        setProps({
            role: assert.isNil(value) ? undefined : value,
        });
    },
});
export const createRoleSDK = withValidation(roleSDKFactory, {
    type: ['object'],
    properties: {
        role: {
            type: ['string'],
        },
    },
});
//# sourceMappingURL=roleSDKFactory.js.map