import * as React from 'react';
import type { ReactNode } from 'react';
import {
  activateBySpaceButton,
  activateByEnterButton,
  getAriaAttributes,
  getQaDataAttributes,
  getDataAttributes,
  useAnalyticsReportClicks,
} from '@wix/editor-elements-common-utils';
import type { LinkRef } from '@wix/thunderbolt-elements/components/Link';
import Link, { isValidLink } from '@wix/thunderbolt-elements/components/Link';
import type {
  IStylableButtonProps,
  IStylableButtonEventHandlers,
  IStylableButtonImperativeActions,
} from '../StylableButton.types';
import { TestIds } from '../constants';
import stylableButtonSemanticClassNames from '../StylableButton.semanticClassNames';
import ButtonContent from './StylableButtonContentCommon';
import { addPrefixToId, createIconFromString } from './utils';

const getEventHandlers = (
  {
    onClick,
    onDblClick,
    onMouseEnter,
    onMouseLeave,
    onFocus,
    onBlur,
  }: Partial<IStylableButtonEventHandlers>,
  isLink: boolean,
  isDisabled: boolean,
) => {
  return {
    onClick,
    onMouseEnter,
    onMouseLeave,
    onKeyDown: isLink ? activateBySpaceButton : activateByEnterButton,
    onDoubleClick: !isDisabled && onDblClick ? onDblClick : undefined,
    onFocus: !isDisabled && onFocus ? onFocus : undefined,
    onBlur: !isDisabled && onBlur ? onBlur : undefined,
  };
};

export type ClassNames = {
  root: string;
  link: string;
  label: string;
  icon: string;
  container: string;
};

const StylableButton: React.ForwardRefRenderFunction<
  IStylableButtonImperativeActions,
  IStylableButtonProps & { classNames: ClassNames }
> = (props, ref) => {
  const {
    id,
    link,
    type = 'button',
    svgString,
    label,
    isDisabled,
    className,
    isQaMode,
    fullNameCompType,
    reportBiOnClick,
    a11y,
    corvid,
    onDblClick,
    onMouseEnter,
    onMouseLeave,
    onFocus,
    onBlur,
    ariaAttributes,
    onClick: propsOnClick,
    preventLinkNavigation,
    classNames,
    compPreviewState,
  } = props;
  const isLink = isValidLink(link);
  const shouldPreventLinkNavigation = preventLinkNavigation && isLink;
  const shouldHaveOnClick =
    (!isDisabled && propsOnClick) || shouldPreventLinkNavigation;

  const semanticClassNames =
    props.semanticClassNames || stylableButtonSemanticClassNames;

  const buttonOrLinkRef = React.useRef<HTMLButtonElement | LinkRef>(null);

  React.useImperativeHandle(ref, () => {
    return {
      focus: () => {
        buttonOrLinkRef.current?.focus();
      },
      blur: () => {
        buttonOrLinkRef.current?.blur();
      },
    };
  });

  const a11yAttr = React.useMemo(
    () =>
      getAriaAttributes({
        ...ariaAttributes,
        ...a11y,
        label: ariaAttributes?.label ?? a11y.label ?? label,
      }),
    [a11y, label, ariaAttributes],
  );

  const onClick = useAnalyticsReportClicks({
    reportBiOnClick,
    onClick: shouldHaveOnClick
      ? (event: React.MouseEvent) => {
          shouldPreventLinkNavigation && event.preventDefault();
          !isDisabled && propsOnClick?.(event);
        }
      : undefined,
  });

  const eventHandlers = React.useMemo(
    () =>
      getEventHandlers(
        {
          onClick,
          onDblClick,
          onMouseLeave,
          onMouseEnter,
          onFocus,
          onBlur,
        },
        isLink,
        isDisabled,
      ),
    [
      onClick,
      onDblClick,
      onMouseLeave,
      onMouseEnter,
      onFocus,
      onBlur,
      isLink,
      isDisabled,
    ],
  );

  const { iconSvgString, iconCollapsed } = corvid || {};

  // TODO hasError - seems to be static in wix-ui-santa
  const rootClassName = classNames.root;

  let buttonIcon: ReactNode = null;
  let overrideIcon: boolean = false;
  // The null value in the iconSvgString indicates that iconSvgString is set in the Velo interface
  // and we have to hide any icon even there is the default value in svgString.
  // iconSvgString can be undefined - it means that it was not set in Velo.
  // Once iconSvgString is not null (from Velo) but undefined,
  // then show the default icon string if it is set
  if (!iconCollapsed && iconSvgString !== null) {
    if (iconSvgString) {
      buttonIcon = createIconFromString(addPrefixToId(iconSvgString, id));
      // this will prevent icon element from hiding by CSS rule
      // when the user set the button as text only but set up the icon property in Velo
      overrideIcon = true;
    } else if (svgString) {
      buttonIcon = createIconFromString(addPrefixToId(svgString, id));
    }
  }

  const renderLinkedButton = () => {
    const {
      onFocus: onFocusCapture,
      onBlur: onBlurCapture,
      ...restEvents
    } = eventHandlers;

    return (
      <div
        id={id}
        className={className}
        {...restEvents}
        {...getDataAttributes(props)}
        {...getQaDataAttributes(isQaMode, fullNameCompType)}
        data-semantic-classname={semanticClassNames.root}
      >
        <Link
          {...link}
          {...a11yAttr}
          href={isDisabled ? undefined : link!.href}
          className={classNames.link}
          onFocusCapture={onFocusCapture}
          onBlurCapture={onBlurCapture}
          ref={buttonOrLinkRef as React.RefObject<LinkRef>}
          dataPreview={compPreviewState}
        >
          <ButtonContent
            label={label}
            icon={buttonIcon}
            semanticClassNames={semanticClassNames}
            classNames={classNames}
          />
        </Link>
      </div>
    );
  };

  const renderRegularButton = (role?: IStylableButtonProps['role']) => (
    // TODO - should we reuse some Button component for unity?
    <div
      id={id}
      className={className}
      {...getQaDataAttributes(isQaMode, fullNameCompType)}
      {...getDataAttributes(props)}
      data-semantic-classname={semanticClassNames.root}
    >
      <button
        type={type}
        disabled={isDisabled}
        className={rootClassName}
        data-testid={TestIds.buttonContent}
        {...a11yAttr}
        {...eventHandlers}
        ref={buttonOrLinkRef as React.RefObject<HTMLButtonElement>}
        role={role}
        data-preview={compPreviewState}
      >
        <ButtonContent
          label={label}
          icon={buttonIcon}
          override={overrideIcon}
          semanticClassNames={semanticClassNames}
          classNames={classNames}
        />
      </button>
    </div>
  );

  if (isDisabled && isLink) {
    return renderRegularButton('link');
  }

  return isLink ? renderLinkedButton() : renderRegularButton();
};

export default React.forwardRef(StylableButton);
