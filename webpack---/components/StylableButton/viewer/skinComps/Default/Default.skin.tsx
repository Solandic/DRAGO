'use-client';
import React from 'react';
import { formatClassNames } from '@wix/editor-elements-common-utils';
import StylableButtonCommon from '../../StylableButtonCommon';
import StylableButton from '../../StylableButton';
import type {
  IStylableButtonImperativeActions,
  IStylableButtonProps,
} from '../../../StylableButton.types';
import { classes, st } from '../../StylableButton.component.st.css';
import stylableButtonSemanticClassNames from '../../../StylableButton.semanticClassNames';
import { buildCorvidStyleStates } from '../../utils';

/**
 * This is skin for the old StylableButton, using stylable.js.
 * Will be eliminated in the future.
 */

const DefaultSkin: React.ForwardRefRenderFunction<
  IStylableButtonImperativeActions,
  IStylableButtonProps
> = (props: IStylableButtonProps, ref) => {
  const {
    isDisabled,
    stylableButtonClassName,
    customClassNames = [],
    corvid,
    isMaxContent = false,
    isWrapText = false,
    isUdpExperimentOn,
  } = props;

  if (!isUdpExperimentOn) {
    return <StylableButton {...props} ref={ref} />;
  }

  const { iconSvgString, iconCollapsed, ...corvidStyleProps } = corvid || {};

  const semanticClassNames =
    props.semanticClassNames || stylableButtonSemanticClassNames;

  const root = st(
    classes.root,
    {
      error: false,
      disabled: isDisabled,
      isMaxContent,
      isWrapText,
      ...buildCorvidStyleStates(corvidStyleProps),
    },
    stylableButtonClassName,
    formatClassNames(semanticClassNames.root, ...customClassNames),
  );

  const link = st(root, classes.link);

  const label = st(
    classes.label,
    formatClassNames(semanticClassNames.buttonLabel),
  );

  let overrideIcon: boolean = false;
  if (!iconCollapsed && iconSvgString !== null) {
    if (iconSvgString) {
      overrideIcon = true;
    }
  }

  const icon = st(
    classes.icon,
    { override: overrideIcon },
    formatClassNames(semanticClassNames.buttonIcon),
  );

  const extendedProps = {
    ...props,
    classNames: {
      root,
      link,
      label,
      icon,
      container: st(classes.container),
    },
  };

  return <StylableButtonCommon {...extendedProps} ref={ref} />;
};

export default React.forwardRef(DefaultSkin);
