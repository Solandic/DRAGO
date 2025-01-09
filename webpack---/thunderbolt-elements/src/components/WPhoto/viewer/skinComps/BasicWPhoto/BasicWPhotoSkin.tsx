import * as React from 'react';
import classNames from 'clsx';
import {
  formatClassNames,
  getDataAttributes,
  isEmptyObject,
  useAnalyticsReportClicks,
} from '@wix/editor-elements-common-utils';
import { WPhotoWrapper } from '../../WPhotoWrapper';
import Link from '../../../../Link/viewer/Link';
import semanticClassNames from '../../../WPhoto.semanticClassNames';
import type { BaseWPhotoSkinProps } from '../../../WPhoto.types';
import { selectProperComponent, getPropsForLink } from '../../../utils';
import styles from './styles/BasicWPhotoSkin.scss';
import { TestIds } from '../../../constants';

const BasicWPhotoSkin: React.FC<BaseWPhotoSkinProps> = props => {
  const {
    skinsStyle,
    id,
    className,
    customClassNames = [],
    link,
    imageProps,
    title,
    onClick: originalOnClick,
    hasPlatformClickHandler = false,
    onClickBehavior,
    onDblClick,
    onMouseEnter,
    onMouseLeave,
    reportBiOnClick,
    filterEffectSvgString,
    filterEffectSvgUrl,
    magnifyKeyboardOperabilityEnabled,
    popupA11yExperimentEnabled,
    translations,
  } = props;

  const ImageComp = selectProperComponent(onClickBehavior);

  const isPopUp = onClickBehavior === 'zoomMode';

  let imageLink;
  if (isPopUp) {
    imageLink = link;
  }

  const hasLink = !isEmptyObject(link);
  const withOnClickHandler = hasLink || hasPlatformClickHandler || isPopUp;

  const handleClick = useAnalyticsReportClicks({
    onClick: originalOnClick,
    reportBiOnClick,
  });

  let onClickHandler;
  if (withOnClickHandler || Boolean(originalOnClick)) {
    onClickHandler = handleClick;
  }

  const shouldShowPopupButton = isPopUp && popupA11yExperimentEnabled;

  const linkProps = getPropsForLink({
    onClickBehavior,
    className: skinsStyle.link,
    link,
  });

  return (
    <WPhotoWrapper
      id={id}
      {...getDataAttributes(props)}
      className={classNames(
        skinsStyle.root,
        className,
        formatClassNames(semanticClassNames.root, ...customClassNames),
      )}
      title={title}
      onClick={onClickHandler}
      onDblClick={onDblClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      withOnClickHandler={withOnClickHandler}
      filterEffectSvgString={filterEffectSvgString}
      filterEffectSvgUrl={filterEffectSvgUrl}
    >
      <Link {...linkProps}>
        <ImageComp
          id={`img_${id}`}
          {...imageProps}
          className={skinsStyle.image}
          magnifyKeyboardOperabilityEnabled={magnifyKeyboardOperabilityEnabled}
          translations={translations}
          link={imageLink}
        />
      </Link>
      {shouldShowPopupButton && (
        <button
          data-testid={TestIds.expandButton}
          onClick={onClickHandler}
          className={styles.expandButton}
          aria-haspopup="dialog"
          aria-label={translations?.expandAriaLabel}
          aria-describedby={imageProps.alt ? imageProps.containerId : undefined}
        >
          <svg
            width="24px"
            height="24px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M12 4V5H5.5C5.224 5 5 5.225 5 5.5V18.5C5 18.775 5.224 19 5.5 19H18.5C18.776 19 19 18.775 19 18.5V12H20V18.5C20 19.327 19.327 20 18.5 20H5.5C4.673 20 4 19.327 4 18.5V5.5C4 4.673 4.673 4 5.5 4H12ZM20 4V9H19V5.707L12.71 11.997L12.003 11.29L18.293 5H15V4H20Z"
            />
          </svg>
        </button>
      )}
    </WPhotoWrapper>
  );
};

export default BasicWPhotoSkin;
