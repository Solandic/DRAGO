import { isHexaColor, isRGBAColor, convertColorToRGBAUnits, } from '@wix/editor-elements-common-utils';
import { withValidation } from '../../validations';
import { getScopedVar } from './styleUtils';
import { createColorValidator } from './validation';
import { cssVars, styleStateCssVars } from './constants';
import { capitalize } from './capitalize';
const TEXT_COLOR_STATE_PROPERTY_NAME = 'textColor';
const getStyleStatePropertyName = (styleState) => styleState + capitalize(TEXT_COLOR_STATE_PROPERTY_NAME);
const TEXT_COLOR_INITIAL_STATE_PROPERTY_NAME = 'color';
const getInitialStatePropertyName = (styleState) => styleState + capitalize(TEXT_COLOR_INITIAL_STATE_PROPERTY_NAME);
export const createTextColorPropsSDKFactory = (options = {}) => {
    const { prefix, withoutDefaultValue, supportedStates = [] } = options;
    const _createTextColorPropsSDKFactory = (cssRule, statePropertyName = TEXT_COLOR_STATE_PROPERTY_NAME, initialStatePropertyName = TEXT_COLOR_INITIAL_STATE_PROPERTY_NAME) => {
        const validateColor = createColorValidator({
            propertyName: 'color',
            cssProperty: 'rgbColor',
            supportAlpha: false,
        });
        const _textColorPropsSDKFactory = ({ setStyles, sdkData, createSdkState, }) => {
            const editorInitialColor = sdkData?.initialSdkStyles?.[initialStatePropertyName];
            const initialColor = withoutDefaultValue ? undefined : editorInitialColor;
            const [state, setState] = createSdkState({ [statePropertyName]: initialColor }, statePropertyName);
            return {
                set color(value) {
                    let textColor = value;
                    // RGBA values are casted to RGB by default
                    if (isHexaColor(value) || isRGBAColor(value)) {
                        const [r, g, b] = convertColorToRGBAUnits(value);
                        textColor = `rgb(${r}, ${g}, ${b})`;
                    }
                    setState({ [statePropertyName]: textColor });
                    setStyles({ [cssRule]: textColor });
                },
                get color() {
                    return state[statePropertyName];
                },
                reset() {
                    setState({ [statePropertyName]: initialColor });
                    setStyles({ [cssRule]: undefined });
                },
            };
        };
        return withValidation(_textColorPropsSDKFactory, {
            type: ['object'],
            properties: {
                color: {
                    type: ['string', 'nil'],
                },
            },
        }, {
            color: [validateColor],
        });
    };
    const styleStateSDKFactories = supportedStates.map(styleState => {
        const _createStyleStateFactory = api => {
            const styleStateSDK = _createTextColorPropsSDKFactory(getScopedVar({
                name: styleStateCssVars[styleState].textColor,
                prefix,
            }), getStyleStatePropertyName(styleState), getInitialStatePropertyName(styleState))(api);
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
    const regularSDKFactory = _createTextColorPropsSDKFactory(getScopedVar({ name: cssVars.textColor, prefix }));
    return api => Object.assign(regularSDKFactory(api), styleStateSDKFactories.reduce((sdk, styleStateSDKFactory) => Object.assign(sdk, styleStateSDKFactory(api)), {}));
};
//# sourceMappingURL=textColorPropsSDKFactory.js.map