import { convertColorToRGBAUnits, extractOpacity, applyOpacity, isHexaColor, isRGBAColor, roundToTwoDecimals, } from '@wix/editor-elements-common-utils';
import { withValidation } from '../../validations';
import { createColorValidator } from './validation';
import { getScopedVar } from './styleUtils';
import { cssVars, styleStateCssVars } from './constants';
import { capitalize } from './capitalize';
export const buildColorPropsSDKFactoryCreator = (propertyName) => (options = { supportOpacity: true }) => {
    const { prefix, supportOpacity, withoutDefaultValue, supportedStates = [], } = options;
    const _createColorPropsSDKFactory = (cssRule, statePropertyName = propertyName) => {
        const validateColor = createColorValidator({
            propertyName,
            cssProperty: supportOpacity ? 'rgbaColor' : 'rgbColor',
            supportAlpha: supportOpacity,
        });
        const _colorPropsSDKFactory = ({ setStyles, sdkData, createSdkState }) => {
            const editorInitialColor = sdkData?.initialSdkStyles?.[statePropertyName];
            const editorOpacity = extractOpacity(editorInitialColor);
            const initialValue = withoutDefaultValue
                ? undefined
                : editorInitialColor;
            const [state, setState] = createSdkState({ [statePropertyName]: initialValue }, statePropertyName);
            return Object.defineProperty({
                reset() {
                    setState({ [statePropertyName]: initialValue });
                    setStyles({ [cssRule]: undefined });
                },
            }, propertyName, {
                enumerable: true,
                set(value) {
                    let colorValue = value;
                    /**
                     * !Alert! This feature is intended.
                     * if mixin does not support opacity - cast it to RGB
                     */
                    if (!supportOpacity &&
                        (isHexaColor(value) || isRGBAColor(value))) {
                        const [r, g, b] = convertColorToRGBAUnits(value);
                        colorValue = `rgb(${r}, ${g}, ${b})`;
                    }
                    /**
                     * !Alert! This feature is intended.
                     *  Editor color alpha gets modified by the amount of user color alpha
                     */
                    if (typeof editorOpacity === 'number' && editorOpacity !== 1) {
                        const userOpacity = extractOpacity(value);
                        const opacity = Number.isFinite(userOpacity)
                            ? roundToTwoDecimals(editorOpacity * userOpacity)
                            : editorOpacity;
                        colorValue = applyOpacity(colorValue, opacity);
                    }
                    setState({ [statePropertyName]: colorValue });
                    setStyles({ [cssRule]: colorValue });
                },
                get() {
                    return state[statePropertyName];
                },
            });
        };
        return withValidation(_colorPropsSDKFactory, {
            type: ['object'],
            properties: {
                [propertyName]: {
                    type: ['string', 'nil'],
                },
            },
        }, {
            [propertyName]: [validateColor],
        });
    };
    const styleStateSDKFactories = supportedStates.map(styleState => {
        const _createStyleStateFactory = api => {
            const styleStateSDK = _createColorPropsSDKFactory(getScopedVar({
                name: styleStateCssVars[styleState][propertyName],
                prefix,
            }), styleState + capitalize(propertyName))(api);
            return {
                [styleState]: styleStateSDK,
            };
        };
        return withValidation(_createStyleStateFactory, {
            type: ['object'],
            properties: {
                [styleState]: {
                    type: ['object', 'nil'],
                },
            },
        });
    });
    const regularSDKFactory = _createColorPropsSDKFactory(getScopedVar({ name: cssVars[propertyName], prefix }));
    return api => Object.assign(regularSDKFactory(api), styleStateSDKFactories.reduce((sdk, styleStateSDKFactory) => Object.assign(sdk, styleStateSDKFactory(api)), {}));
};
//# sourceMappingURL=colorPropsSDKFactoryBuilder.js.map