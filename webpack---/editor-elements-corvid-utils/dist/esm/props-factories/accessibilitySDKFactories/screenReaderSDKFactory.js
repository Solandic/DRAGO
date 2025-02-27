import { withValidation } from '../..';
import { assert } from '../../assert';
import { reportError } from '../../reporters';
import { getInvalidScreenReaderValueError } from './constants';
export const screenReaderSDKFactory = ({ setProps, props }) => ({
    screenReader: {
        get prefix() {
            return props.screenReader?.prefix;
        },
        set prefix(value) {
            if (value !== null && !assert.isString(value)) {
                reportError(getInvalidScreenReaderValueError('prefix'));
                return;
            }
            setProps({ screenReader: { ...props.screenReader, prefix: value } });
        },
        get suffix() {
            return props.screenReader?.suffix;
        },
        set suffix(value) {
            if (value !== null && !assert.isString(value)) {
                reportError(getInvalidScreenReaderValueError('suffix'));
                return;
            }
            setProps({ screenReader: { ...props.screenReader, suffix: value } });
        },
        get hasHint() {
            return props.screenReader?.hasHint;
        },
        set hasHint(value) {
            setProps({
                screenReader: {
                    ...props.screenReader,
                    hasHint: assert.isNil(value) ? undefined : value,
                },
            });
        },
    },
});
export const createScreenReaderSDK = withValidation(screenReaderSDKFactory, {
    type: ['object'],
    properties: {
        prefix: {
            type: ['string'],
            minLength: 1,
            maxLength: 1000,
        },
        suffix: {
            type: ['string'],
            minLength: 1,
            maxLength: 1000,
        },
        hasHint: {
            type: ['boolean'],
        },
    },
});
//# sourceMappingURL=screenReaderSDKFactory.js.map