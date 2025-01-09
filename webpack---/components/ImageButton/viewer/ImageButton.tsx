'use-client';
import * as React from 'react';
import type { ImageProps } from '@wix/thunderbolt-components-native';
import classNames from 'clsx';
import {
  formatClassNames,
  getAriaAttributes,
  getDataAttributes,
  useAnalyticsReportClicks,
} from '@wix/editor-elements-common-utils';
import Image from '@wix/thunderbolt-elements/src/components/Image/viewer/Image';
import Link, {
  isValidLink,
} from '@wix/thunderbolt-elements/src/components/Link/viewer/Link';
import type { ImageButtonProps } from '../ImageButton.types';
import { TestIds } from '../constants';
import semanticClassNames from '../ImageButton.semanticClassNames';
import style from './style/ImageButton.scss';

const ImageButton: React.FC<ImageButtonProps> = props => {
  const {
    id,
    className,
    customClassNames = [],
    link,
    alt,
    transition,
    onClick: propsOnClick,
    onDblClick,
    onMouseEnter,
    onMouseLeave,
    hasPlatformClickHandler,
    isDisabled,
    getPlaceholder,
    reportBiOnClick,
    containerWidth,
    containerHeight,
    ariaAttributes,
    preventLinkNavigation,
  } = props;
  const isLink = isValidLink(link);
  const shouldPreventLinkNavigation = preventLinkNavigation && isLink;
  const shouldHaveOnClick =
    (!isDisabled && propsOnClick) || shouldPreventLinkNavigation;

  const images: Array<{ props: ImageProps; className: string }> = [
    { props: props.defaultImage, className: style.defaultImage },
    { props: props.hoverImage, className: style.hoverImage },
    { props: props.activeImage, className: style.activeImage },
  ];

  const handleClick = useAnalyticsReportClicks({
    reportBiOnClick,
    onClick: shouldHaveOnClick
      ? (event: React.MouseEvent) => {
          shouldPreventLinkNavigation && event.preventDefault();
          !isDisabled && propsOnClick?.(event);
        }
      : undefined,
  });

  return (
    <div
      id={id}
      {...getDataAttributes(props)}
      className={classNames(
        className,
        {
          [style.transition_none]: transition === 'none',
          [style.transition_fade]: transition === 'fade',
          [style.clickable]: hasPlatformClickHandler,
        },
        formatClassNames(semanticClassNames.root, ...customClassNames),
      )}
      onClick={handleClick}
      onDragStart={e => e.preventDefault()}
      onDoubleClick={!isDisabled ? onDblClick : undefined}
      onMouseEnter={!isDisabled ? onMouseEnter : undefined}
      onMouseLeave={!isDisabled ? onMouseLeave : undefined}
    >
      <Link
        {...link}
        {...getAriaAttributes(ariaAttributes)}
        className={style.link}
        dataTestId={TestIds.link}
        title={alt}
        role="img"
      >
        {images.map((image, index) => (
          <div className={style.correctPositioning} key={index}>
            <Image
              id={`img_${id}_${index}`}
              {...image.props}
              displayMode="fit"
              alt=""
              role="none"
              containerId={id}
              className={image.className}
              getPlaceholder={getPlaceholder}
              containerWidth={containerWidth}
              containerHeight={containerHeight}
            />
          </div>
        ))}
      </Link>
    </div>
  );
};

export default ImageButton;
