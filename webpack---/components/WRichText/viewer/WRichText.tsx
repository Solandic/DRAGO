'use-client';
import classNames from 'clsx';
import * as React from 'react';

import {
  formatClassNames,
  getAriaAttributes,
  getQaDataAttributes,
  getDataAttributes,
} from '@wix/editor-elements-common-utils';
import type { IWRichTextProps } from '../WRichText.types';
import { TestIds } from '../constants';
import semanticClassNames from '../WRichText.semanticClassNames';
import skinsStyle from './style/WRichText.scss';
import { usePopupLinkEvents } from './providers/usePopupLinkEvents';

interface ScreenReaderAffixProps {
  text: string;
  testId: string;
}

// Prefix or suffix that are only visible to screen readers
const ScreenReaderAffix: React.FC<ScreenReaderAffixProps> = ({
  text,
  testId,
}) => (
  <div className={skinsStyle.srOnly} data-testid={testId}>
    {text}
  </div>
);

const WRichText: React.ForwardRefExoticComponent<IWRichTextProps> =
  React.forwardRef((props, ref) => {
    const {
      id,
      className,
      customClassNames = [],
      html,
      skin = 'WRichTextSkin',
      a11y,
      isQaMode,
      fullNameCompType,
      screenReader,
      ariaAttributes,
      onClick,
      onDblClick,
      shouldFixVerticalTopAlignment, // Should be removed after the specs.thunderbolt.WRichTextVerticalAlignTopSafariAndIOS experiment is open to 100%
      isListInRtlEnabled, // Should be removed after the specs.thunderbolt.wrichtextListInRtl experiment is open to 100%
      isClassNameToRootEnabled,
      corvid,
    } = props;

    const [isInteractive, setIsInteractive] = React.useState(false);

    const { prefix, suffix } = screenReader || {};

    const htmlWrapperRef = React.useRef<HTMLDivElement | null>(null);

    usePopupLinkEvents(htmlWrapperRef, [html]);

    const skinsWithContainer: Array<IWRichTextProps['skin']> = [
      'WRichTextSkin',
      'WRichTextClickableSkin',
    ];
    const isContainerSkin = skinsWithContainer.includes(skin);
    const isInContainer = isContainerSkin || prefix || suffix;

    const sdkEventHandlers = {
      onMouseEnter: props.onMouseEnter,
      onMouseLeave: props.onMouseLeave,
      onClick: props.onClick,
      onDoubleClick: props.onDblClick,
    };

    React.useEffect(() => {
      setIsInteractive(Boolean(onClick) || Boolean(onDblClick));
    }, [onClick, onDblClick]);

    const rootStyles = classNames(
      skinsStyle.wrapper,
      skinsStyle[skin],
      skinsStyle.supportTableDesign,
      {
        [skinsStyle.clickable]: isInteractive,
        [skinsStyle.safariFix]: shouldFixVerticalTopAlignment, // Should be removed after the experiment is open to 100%
        [skinsStyle['list-direction-spec']]: isListInRtlEnabled, // Should be removed after the specs.thunderbolt.wrichtextListInRtl experiment is open to 100%
      },
    );

    const wrapperAttributes = isInContainer
      ? {
          id,
          ...(isContainerSkin
            ? {
                ...getDataAttributes(props),
                className: classNames(
                  rootStyles,
                  className,
                  formatClassNames(
                    semanticClassNames.root,
                    ...customClassNames,
                  ),
                  getCorvidOverrideClassName(corvid),
                ),
                'data-testid': TestIds.richTextElement,
                ...sdkEventHandlers,
                ...a11y,
                ...getAriaAttributes(ariaAttributes),
                ...getQaDataAttributes(isQaMode, fullNameCompType),
              }
            : {
                className: isClassNameToRootEnabled ? className : '',
              }),
        }
      : undefined;

    const richTextAttributes = {
      ...(!isInContainer
        ? {
            id,
            ...getDataAttributes(props),
            ...getQaDataAttributes(isQaMode, fullNameCompType),
          }
        : undefined),
      dangerouslySetInnerHTML: { __html: html },
      ref: (element: HTMLDivElement) => {
        htmlWrapperRef.current = element;

        if (ref) {
          (ref as React.MutableRefObject<HTMLDivElement>).current = element;
        }
      },
      ...(isContainerSkin
        ? {
            className: classNames(
              skinsStyle.richTextContainer,
              isClassNameToRootEnabled ? '' : className,
              getCorvidOverrideClassName(corvid),
            ),
            'data-testid': TestIds.containerElement,
          }
        : {
            className: classNames(
              rootStyles,
              isClassNameToRootEnabled && isInContainer ? '' : className,
              formatClassNames(semanticClassNames.root, ...customClassNames),
              getCorvidOverrideClassName(corvid),
            ),
            'data-testid': TestIds.richTextElement,
            ...sdkEventHandlers,
            ...a11y,
            ...getAriaAttributes(ariaAttributes),
          }),
    };

    const prefixElement = prefix && (
      <ScreenReaderAffix
        text={prefix}
        testId={TestIds.screenReaderPrefixElement}
      />
    );

    const suffixElement = suffix && (
      <ScreenReaderAffix
        text={suffix}
        testId={TestIds.screenReaderSuffixElement}
      />
    );

    const richTextElement = <div {...richTextAttributes} />;

    if (isInContainer) {
      return (
        <div {...wrapperAttributes}>
          {prefixElement}
          {richTextElement}
          {suffixElement}
        </div>
      );
    }

    return richTextElement;
  });

function getCorvidOverrideClassName(corvid: IWRichTextProps['corvid'] = {}) {
  return classNames(Boolean(corvid.hasColor) && skinsStyle.corvidColorOverride);
}

export default WRichText;
