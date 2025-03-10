'use-client';
import * as React from 'react';
import classNames from 'clsx';
import { replaceCompIdPlaceholder } from '@wix/editor-elements-common-utils';
import Image from '../../Image/viewer/Image';
import hoverBoxUtils from '../../MediaContainers/HoverBox/utils';
import styles from './style/Video.scss';
const VIDEO_CLASS_FOR_LAYOUT = 'bgVideo';
const VIDEO_POSTER_CLASS_FOR_LAYOUT = 'bgVideoposter';
const POSTER_IMAGE_QUALITY = {
    quality: {
        unsharpMask: {
            radius: 0.33,
            amount: 1.0,
            threshold: 0.0,
        },
    },
    devicePixelRatio: 1,
};
const Video = props => {
    const { id, videoRef, videoInfo, posterImageInfo, muted, preload, loop, alt, isVideoEnabled, getPlaceholder, extraClassName = '', } = props;
    // fix containerId to support hoverBox component
    videoInfo.containerId = hoverBoxUtils.getDefaultId(videoInfo.containerId);
    const videoInfoString = React.useMemo(() => JSON.stringify(videoInfo), [videoInfo]);
    const VideoPosterImage = (React.createElement(React.Fragment, null,
        posterImageInfo.filterEffectSvgString && (React.createElement("svg", { id: `svg_${videoInfo.containerId}`, className: styles.filterEffectSvg },
            React.createElement("defs", { dangerouslySetInnerHTML: {
                    __html: replaceCompIdPlaceholder(posterImageInfo.filterEffectSvgString, videoInfo.containerId),
                } }))),
        React.createElement(Image, { key: `${videoInfo.videoId}_img`, id: `${posterImageInfo.containerId}_img`, className: classNames(styles.videoPoster, styles.videoPosterImg, VIDEO_POSTER_CLASS_FOR_LAYOUT, extraClassName), imageStyles: { width: '100%', height: '100%' }, ...posterImageInfo, ...POSTER_IMAGE_QUALITY, getPlaceholder: getPlaceholder })));
    if (!isVideoEnabled) {
        return VideoPosterImage;
    }
    return (
    // Custom element defined in: https://github.com/wix-private/santa-core/blob/master/wix-custom-elements/src/elements/wixVideo/wixVideo.js
    React.createElement("wix-video", { id: id, "data-video-info": videoInfoString, "data-motion-part": `BG_IMG ${videoInfo.containerId}`, class: classNames(styles.videoContainer, VIDEO_CLASS_FOR_LAYOUT, extraClassName) },
        React.createElement("video", { key: `${videoInfo.videoId}_video`, ref: videoRef, id: `${videoInfo.containerId}_video`, className: styles.video, crossOrigin: "anonymous", "aria-label": alt, playsInline: true, preload: preload, muted: muted, loop: loop, tabIndex: -1 }),
        VideoPosterImage));
};
export default Video;
//# sourceMappingURL=Video.js.map