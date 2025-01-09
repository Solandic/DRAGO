import { withValidation } from '../validations';
import { reportError } from '../reporters';
import { messages } from '../messages';
import { createBackgroundColorPropsSDKFactory, createBorderColorPropsSDKFactory, createBorderRadiusPropsSDKFactory, createBorderWidthPropsSDKFactory, createForegroundColorPropsSDKFactory, createTextColorPropsSDKFactory, createFillColorPropsSDKFactory, createStrokeColorPropsSDKFactory, createIconColorPropsSDKFactory, } from './styleSDKFactories';
import { composeFactory } from './composeFactoryWithReset';
import { styleStates } from './styleSDKFactories/constants';
const STYLE_SDK_RESET_METHOD_NAME = 'reset';
function composeSDKFactoriesWithReset(...sources) {
    const compose = composeFactory(STYLE_SDK_RESET_METHOD_NAME);
    return api => {
        const sdks = sources.map(source => source(api));
        const styleStateComposedSdks = {};
        for (const styleState of styleStates) {
            if (!sdks.some(sdk => styleState in sdk)) {
                continue;
            }
            styleStateComposedSdks[styleState] = compose(...sdks.map(sdk => sdk[styleState] ?? {}));
            // we "hide" the reset method as it's not a public API
            Object.defineProperty(styleStateComposedSdks[styleState], STYLE_SDK_RESET_METHOD_NAME, { enumerable: false });
            sdks.forEach(sdk => {
                // we remove style state properties from the main sdk to prevent overrides after compose of all sdks
                // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                delete sdk[styleState];
            });
        }
        const composedSdk = compose(...sdks);
        // we "hide" the reset method as it's not a public API
        Object.defineProperty(composedSdk, STYLE_SDK_RESET_METHOD_NAME, {
            enumerable: false,
        });
        return Object.assign(composedSdk, styleStateComposedSdks);
    };
}
const _stylePropsSDKFactory = (supportedSDKFactories) => api => {
    const styleSDKs = supportedSDKFactories(api);
    styleSDKs.removeProperty = (propertyName) => {
        const [propName, styleState] = propertyName.includes('.')
            ? propertyName.split('.').reverse()
            : [propertyName, undefined];
        if ((!styleState && !(propName in styleSDKs)) ||
            (styleState && !(propName in (styleSDKs[styleState] ?? {})))) {
            const styleSdkPropNames = Object.keys(styleSDKs).filter(k => k !== 'removeProperty');
            reportError(messages.invalidEnumValueMessage({
                functionName: 'removeProperty',
                propertyName: 'propertyName',
                value: propertyName,
                enum: styleSdkPropNames,
                index: undefined,
            }));
            return;
        }
        const sdk = styleState
            ? styleSDKs[styleState]
            : styleSDKs;
        sdk[STYLE_SDK_RESET_METHOD_NAME]?.(propName);
    };
    return {
        get style() {
            return styleSDKs;
        },
    };
};
const styleFactories = {
    BackgroundColor: createBackgroundColorPropsSDKFactory,
    BorderColor: createBorderColorPropsSDKFactory,
    BorderWidth: createBorderWidthPropsSDKFactory,
    ForegroundColor: createForegroundColorPropsSDKFactory,
    BorderRadius: createBorderRadiusPropsSDKFactory,
    TextColor: createTextColorPropsSDKFactory,
    FillColor: createFillColorPropsSDKFactory,
    StrokeColor: createStrokeColorPropsSDKFactory,
    IconColor: createIconColorPropsSDKFactory,
};
const styleFactoriesDefaultOptions = {
    BackgroundColor: {
        supportOpacity: true,
    },
    BorderColor: {
        supportOpacity: true,
    },
    BorderWidth: {},
    ForegroundColor: {
        supportOpacity: true,
    },
    BorderRadius: {},
    TextColor: {},
    FillColor: {
        supportOpacity: true,
    },
    StrokeColor: {
        supportOpacity: true,
    },
    IconColor: {},
};
export const createStylePropsSDKFactory = (list, styleSDKOptions) => {
    const supported = Object.keys(list).filter(value => list[value]);
    const supportedSDKFactories = supported.map(value => {
        const stylePropertyOptions = typeof list[value] !== 'boolean'
            ? list[value]
            : styleFactoriesDefaultOptions[value];
        return styleFactories[value]({
            prefix: styleSDKOptions?.cssVarPrefix,
            withoutDefaultValue: stylePropertyOptions.withoutDefaultValue,
            supportOpacity: stylePropertyOptions.supportOpacity,
            supportedStates: stylePropertyOptions.supportedStates,
        });
    });
    return withValidation(_stylePropsSDKFactory(composeSDKFactoriesWithReset(...supportedSDKFactories)), {
        type: ['object'],
        properties: {
            style: {
                type: ['object'],
            },
        },
    });
};
//# sourceMappingURL=stylePropsSDKFactory.js.map