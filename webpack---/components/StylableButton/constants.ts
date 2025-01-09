import { scalePreset } from '../../common/constants/defaultPresets';
import type {
  PhysicalToLogicalAlignment,
  FlexDirection,
  PhysicalAlignment,
  LogicalAlignment,
} from './StylableButton.types';

export const TestIds = {
  buttonContent: 'buttonContent',
  buttonLabel: 'stylablebutton-label',
  buttonIcon: 'stylablebutton-icon',
  layoutPanel: {
    root: 'stylablebutton-layoutPanel',
    buttonFlowThumbnails: 'stylablebutton-layoutPanel-buttonFlow',
    buttonFlowDropdown: 'stylablebutton-layoutPanel-buttonFlow',
    alignmentThumbnails: 'stylablebutton-layoutPanel-alignment',
    iconLabelSpacingSlider: 'stylablebutton-layoutPanel-iconLabelSpacing',
    buttonTypeDropDown: 'stylablebutton-layoutPanel-buttonType',
    buttonMaxContentBtnGroup: 'stylablebutton-layoutPanel-buttonMaxContent',
    buttonIsWrapTextToggle: 'stylablebutton-layoutPanel-wrapText',
    buttonTypeLabel: 'stylablebutton-layoutPanel-buttonTypeLabel',
    directionLTR: 'direction_ltr',
    directionRTL: 'direction_rtl',
  },
};

export const stylableSelectors = {
  root: '.root',
  container: '.root::container',
  label: '.root::label',
  icon: '.root::icon',
};

export const sizingBehaviorPresets = {
  Scale: scalePreset,
  RelativeWidth: {
    key: 'RelativeWidth',
    propsToApply: {
      componentLayout: {
        width: 'percentage',
        height: 'px',
        minWidth: 'none',
        maxWidth: 'none',
        minHeight: 'none',
        maxHeight: 'none',
      },
    },
    propsToValidate: {
      componentLayout: ['width', 'minWidth', 'maxWidth'],
    },
  },
  Fixed: {
    key: 'Fixed',
    propsToApply: {
      componentLayout: {
        height: 'px',
        width: 'px',
        minHeight: 'none',
        maxHeight: 'none',
        minWidth: 'none',
        maxWidth: 'none',
      },
    },
    propsToValidate: {
      componentLayout: ['width', 'height', 'minWidth', 'maxWidth', 'maxHeight'],
    },
  },
};

const commonPhysicalToLogicalAlignment: PhysicalToLogicalAlignment = {
  left: 'flex-start',
  right: 'flex-end',
  center: 'center',
  'space-between': 'space-between',
};

export const flexDirectionToLogicalAlignmentMap: Record<
  FlexDirection,
  Record<PhysicalAlignment, LogicalAlignment>
> = {
  row: commonPhysicalToLogicalAlignment,
  'row-reverse': {
    ...commonPhysicalToLogicalAlignment,
    left: 'flex-end',
    right: 'flex-start',
  },
  column: commonPhysicalToLogicalAlignment,
  'column-reverse': commonPhysicalToLogicalAlignment,
};

const commonLogicalToPhysicalAlignment: Record<
  LogicalAlignment,
  PhysicalAlignment
> = {
  'flex-start': 'left',
  'flex-end': 'right',
  center: 'center',
  'space-between': 'space-between',
};

export const flexDirectionToPhysicalAlignmentMap: Record<
  FlexDirection,
  Record<LogicalAlignment, PhysicalAlignment>
> = {
  row: commonLogicalToPhysicalAlignment,
  'row-reverse': {
    ...commonLogicalToPhysicalAlignment,
    'flex-start': 'right',
    'flex-end': 'left',
  },
  column: commonLogicalToPhysicalAlignment,
  'column-reverse': commonLogicalToPhysicalAlignment,
};
