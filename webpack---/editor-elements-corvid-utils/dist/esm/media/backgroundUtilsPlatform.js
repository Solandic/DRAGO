import { parseVideoFileInfo } from '@wix/background-media-utils';
import { HttpClient } from '@wix/http-client';
import { isValidMediaSrc, parseMediaSrc } from './mediaSrcHandler';
export const CORVID_BG_VIDEO_DEFAULTS = {
    loop: true,
    preload: 'auto',
    muted: true,
    isVideoEnabled: true,
};
const getVideoPosterObject = ({ mediaId, posterId, width, height, title, }) => {
    return {
        type: 'WixVideo',
        videoId: mediaId,
        posterImageRef: {
            type: 'Image',
            uri: posterId,
            width,
            height,
            title,
        },
    };
};
export const getScrollEffect = (fillLayers = {}) => {
    const { bgEffectName = '' } = fillLayers.backgroundMedia || {};
    return {
        hasBgScrollEffect: bgEffectName ? 'true' : '',
        bgEffectName,
    };
};
export const hasVideo = (props) => {
    const { fillLayers = {} } = props;
    return fillLayers?.video?.videoInfo?.videoId;
};
const getVideoId = (videoId) => {
    return videoId.replace('video/', '');
};
const getFullVideoObject = (fileInfo, info) => {
    const MEDIA_OBJECT_DEFAULTS = {
        animatePoster: 'none',
        autoPlay: true,
        playbackRate: 1,
        fittingType: 'fill',
        hasBgScrollEffect: '',
        bgEffectName: '',
        isVideoDataExists: '1',
        alignType: 'center',
        videoFormat: 'mp4',
        playerType: 'html5',
        isEditorMode: false,
        isViewerMode: true,
        videoHeight: fileInfo.file_input.height,
        videoWidth: fileInfo.file_input.width,
    };
    const mediaObject = parseVideoFileInfo(fileInfo, info);
    return {
        mediaObject: {
            ...MEDIA_OBJECT_DEFAULTS,
            ...mediaObject,
        },
        ...CORVID_BG_VIDEO_DEFAULTS,
    };
};
export const getMediaDataFromSrc = (value) => {
    if (isValidMediaSrc(value, 'video')) {
        const parseMediaItem = parseMediaSrc(value, 'video');
        if (parseMediaItem.error) {
            return null;
        }
        return {
            ...getVideoPosterObject(parseMediaItem),
            ...{
                name: parseMediaItem.title,
                fileName: parseMediaItem.title,
                type: 'WixVideo',
            },
        };
    }
    else {
        const parseMediaItem = parseMediaSrc(value, 'image');
        if (parseMediaItem.error) {
            return null;
        }
        return {
            ...parseMediaItem,
            ...{
                name: parseMediaItem.title,
                type: 'Image',
            },
        };
    }
};
export const getVideoDataByVideoId = async (videoId) => {
    videoId = getVideoId(videoId);
    const VIDEO_INFO_END_POINT = `https://files.wix.com/site/media/files/${videoId}/info`;
    const httpClient = new HttpClient();
    const videoData = await httpClient.get(VIDEO_INFO_END_POINT);
    return getFullVideoObject(videoData.data, {});
};
//# sourceMappingURL=backgroundUtilsPlatform.js.map