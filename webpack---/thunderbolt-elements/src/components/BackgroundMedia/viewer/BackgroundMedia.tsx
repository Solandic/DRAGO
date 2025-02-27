'use-client';
import * as React from 'react';
import type { BackgroundMediaProps } from '../BackgroundMedia.types';
import styles from './style/BackgroundMedia.scss';

const BackgroundMedia: React.FC<BackgroundMediaProps> = props => {
  const {
    id,
    containerId,
    pageId,
    children,
    bgEffectName = '',
    containerSize,
  } = props;

  return (
    // 	Custom element defined in: https://github.com/wix-private/santa-core/blob/master/wix-custom-elements/src/elements/wixBgMedia/wixBgMedia.js
    <wix-bg-media
      id={id}
      class={styles.mediaContainer}
      data-container-id={containerId}
      data-container-size={`${containerSize?.width || 0}, ${
        containerSize?.height || 0
      }`}
      data-page-id={pageId}
      data-bg-effect-name={bgEffectName}
      data-motion-part={`BG_MEDIA ${containerId}`}
    >
      {children}
    </wix-bg-media>
  );
};

export default BackgroundMedia;
