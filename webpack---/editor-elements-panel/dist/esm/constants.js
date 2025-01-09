import { TranslationKeys } from './sections/translationKeys';
import { ColorDropBold, BorderBold, CornersBold, ShadowBold, TextBold, } from '@wix/wix-ui-icons-common/classic-editor';
import IconIcon from './icons/icon.svg';
import LayoutIcon from './icons/layout.svg';
import { SizeAndRatio } from '@wix/wix-ui-icons-common';
export { cssPropertyToDefaultValueMap } from '@wix/editor-elements-common-utils/src/skinDefaults';
export const DATA_BINDING_APP_ID = 'dataBinding';
export const REGULAR_STATE = {
    id: 'regular',
    label: TranslationKeys.states.regularLabel,
    default: true,
};
export const HOVER_STATE = {
    id: 'hover',
    label: TranslationKeys.states.native.hoverLabel,
};
export const DISABLED_STATE = {
    id: 'disabled',
    label: TranslationKeys.states.native.disabledLabel,
    displayOnlyOnDevMode: true,
};
export const SELECTED_STATE = {
    id: 'selected',
    label: TranslationKeys.states.native.focusLabel,
};
export const ExtensionTypes = {
    ComponentData: 'ComponentData',
    ComponentParts: 'ComponentParts',
    ComponentStates: 'ComponentStates',
    ComponentPreviewState: 'ComponentPreviewState',
    SiteData: 'SiteData',
    WixBI: 'WixBI',
};
export const SectionTypes = {
    TextDesign: 'TextDesign',
    BackgroundDesign: 'BackgroundDesign',
    BorderDesign: 'BorderDesign',
    CornerDesign: 'CornerDesign',
    ShadowDesign: 'ShadowDesign',
    PaddingDesign: 'PaddingDesign',
    IconDesign: 'IconDesign',
    DividerDesign: 'DividerDesign',
    Size: 'Size',
    PartPicker: 'PartPicker',
    StatePicker: 'StatePicker',
    Banner: 'Banner',
};
export const SectionsMetadata = {
    TextDesign: {
        sectionCategory: 'data',
        icon: TextBold,
        translationName: 'text',
    },
    BackgroundDesign: {
        sectionCategory: 'data',
        icon: ColorDropBold,
        translationName: 'fills',
    },
    BorderDesign: {
        sectionCategory: 'data',
        icon: BorderBold,
        translationName: 'borders',
    },
    CornerDesign: {
        sectionCategory: 'data',
        icon: CornersBold,
        translationName: 'corners',
    },
    ShadowDesign: {
        sectionCategory: 'data',
        icon: ShadowBold,
        translationName: 'shadows',
    },
    PaddingDesign: {
        sectionCategory: 'data',
        icon: LayoutIcon,
        translationName: 'padding',
    },
    IconDesign: {
        sectionCategory: 'data',
        icon: IconIcon,
        translationName: 'icon',
    },
    DividerDesign: {
        sectionCategory: 'data',
        // TODO: replace with the correct icon
        icon: BorderBold,
        translationName: 'dividers',
    },
    Size: {
        sectionCategory: 'data',
        icon: SizeAndRatio,
        translationName: 'size',
    },
    StatePicker: {
        sectionCategory: 'config',
    },
    PartPicker: {
        sectionCategory: 'config',
    },
    Banner: {
        sectionCategory: 'config',
    },
};
export const ComponentStates = {
    Regular: REGULAR_STATE,
    Hover: HOVER_STATE,
    Disabled: DISABLED_STATE,
    Selected: SELECTED_STATE,
};
export const BUILDER_FLOW_SPEC = 'specs.responsive-editor.udpInBuilderFlow';
//# sourceMappingURL=constants.js.map