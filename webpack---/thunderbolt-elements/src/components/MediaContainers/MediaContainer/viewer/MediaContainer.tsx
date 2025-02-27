'use-client';
import React from 'react';
import classNames from 'clsx';
import {
  formatClassNames,
  useVideoAPI,
  getDataAttributes,
} from '@wix/editor-elements-common-utils';
import type { MediaContainerVideoAPI } from '@wix/editor-elements-types/components';
import repeaterSemanticClassNames from '@wix/editor-elements-library/src/components/Repeater/Repeater.semanticClassNames';
import type { MediaContainerCompProps } from '../MediaContainer.types';
import { ARIA_LABEL_DEFAULT } from './constants';
import MediaContainerContent from './MediaContainerContent';
import styles from './styles/MediaContainer.scss';

// TODO: replace with import when MediaContainer will be moved to editor-elements-library
const stripSemanticClassNames = {
  root: 'column-strip',
  column: 'column-strip__column',
} as const;

const MediaContainer: React.ForwardRefRenderFunction<
  MediaContainerVideoAPI,
  MediaContainerCompProps
> = (props: MediaContainerCompProps, compRef) => {
  const {
    id,
    className,
    customClassNames = [],
    children,
    onClick,
    onDblClick,
    onMouseEnter,
    onMouseLeave,
    shouldAddTabIndex0: shouldAddA11yAttributes,
    hasPlatformClickHandler,
    translations,
    fillLayers,
    onStop,
    isRepeaterItem,
    columnOverrides,
  } = props;

  const getRootSemanticClasses = () => {
    if (isRepeaterItem) {
      return repeaterSemanticClassNames.repeaterItem;
    }
    if (columnOverrides) {
      return stripSemanticClassNames.column;
    }
    return '';
  };

  const rootClassName = classNames(
    className,
    styles.mediaContainer,
    formatClassNames(getRootSemanticClasses(), ...customClassNames),
    {
      [styles.clickable]: hasPlatformClickHandler,
    },
  );

  const a11yAttributes = shouldAddA11yAttributes
    ? {
        tabIndex: 0,
        role: 'region',
        'aria-label': translations?.ariaLabel || ARIA_LABEL_DEFAULT,
      }
    : {};

  const hasVideo = !!fillLayers.video;
  const videoRef = useVideoAPI(compRef, hasVideo, onStop);

  return (
    <div
      id={id}
      {...getDataAttributes(props)}
      className={rootClassName}
      onClick={onClick}
      onDoubleClick={onDblClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      {...a11yAttributes}
    >
      <MediaContainerContent {...props} videoRef={videoRef}>
        {children}
      </MediaContainerContent>
    </div>
  );
};

export default React.forwardRef(MediaContainer);
