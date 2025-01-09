import { assert } from '../assert';
import { messageTemplates } from '../messages';
import { reportError } from '../reporters';
import { withValidation } from '../validations';
export const setLink = (url, target, linkUtils, setProps, rel) => {
    if (assert.isNil(url) || url === '') {
        setProps({
            link: undefined,
        });
        return;
    }
    try {
        setProps({
            link: linkUtils.getLinkProps(url, target, rel),
        });
    }
    catch (e) {
        reportError(`The link property that is passed to the link method cannot be set to the value "${url}" as this is not a supported link type.`);
    }
};
export const getLink = (props, linkUtils) => props.link ? linkUtils.getLink(props.link) : '';
const _linkPropsSDKFactory = ({ setProps, props, platformUtils: { linkUtils } }) => {
    return {
        set link(url) {
            setLink(url, props.link?.target, linkUtils, setProps, props.link?.rel);
        },
        get link() {
            return getLink(props, linkUtils);
        },
        set target(target) {
            setProps({
                link: { ...props.link, target },
            });
        },
        get target() {
            return props.link?.target ?? '_blank';
        },
        set preventLinkNavigation(preventLinkNavigation) {
            setProps({ preventLinkNavigation });
        },
        get preventLinkNavigation() {
            return props.preventLinkNavigation ?? false;
        },
        set rel(rel) {
            setProps({
                link: {
                    ...props.link,
                    rel: rel !== '' ? rel : undefined,
                    // Avoid rendering `rel` attribute with no value.
                    // The link dialog in the editor also sets `rel` to `undefined` when
                    // the value is empty.
                },
            });
        },
        get rel() {
            return props.link?.rel ?? '';
        },
    };
};
export const linkPropsSDKFactory = withValidation(_linkPropsSDKFactory, {
    type: ['object'],
    properties: {
        link: { type: ['string', 'nil'], warnIfNil: true },
        target: { type: ['string', 'nil'], warnIfNil: true },
        preventLinkNavigation: { type: ['boolean'] },
        rel: { type: ['string'] },
    },
}, {
    target: [
        (target) => {
            if (target === '_blank' || target === '_self') {
                return true;
            }
            reportError(messageTemplates.error_target_w_photo({ target }));
            if (assert.isNil(target)) {
                return true;
            }
            return false;
        },
    ],
    rel: [
        (rel) => {
            // Ensure that the listed keywords correspond to the type.
            const VALID_KEYWORDS = {
                noreferrer: 'noreferrer',
                noopener: 'noopener',
                nofollow: 'nofollow',
                sponsored: 'sponsored',
            };
            const validKeywords = Object.values(VALID_KEYWORDS);
            const keywords = rel.split(' ');
            for (let index = 0; index < keywords.length; index += 1) {
                const keyword = keywords[index];
                if (!validKeywords.includes(keyword) ||
                    index !== keywords.lastIndexOf(keyword)) {
                    reportError(messageTemplates.error_invalid_rel({ rel, validKeywords }));
                    return false;
                }
            }
            return true;
        },
    ],
});
//# sourceMappingURL=linkPropsSDKFactory.js.map