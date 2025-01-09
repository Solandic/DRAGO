import { withValidation } from '../../validations';
import { assert } from '../../assert';
const roleDescriptionSDKFactory = ({ setProps, props }) => ({
    get roleDescription() {
        return props.ariaAttributes?.roleDescription;
    },
    set roleDescription(value) {
        setProps({
            ariaAttributes: {
                ...props.ariaAttributes,
                roleDescription: assert.isNil(value) ? undefined : value,
            },
        });
    },
});
export const createRoleDescriptionSDK = withValidation(roleDescriptionSDKFactory, {
    type: ['object'],
    properties: {
        roleDescription: {
            type: ['string'],
            minLength: 1,
            maxLength: 100,
        },
    },
});
//# sourceMappingURL=roleDescriptionSDKFactory.js.map