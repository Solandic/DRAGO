export const keyCodes = {
    enter: 13,
    space: 32,
    end: 35,
    home: 36,
    escape: 27,
    arrowLeft: 37,
    arrowUp: 38,
    arrowRight: 39,
    arrowDown: 40,
    tab: 9,
    delete: 46,
    a: 65,
    z: 90,
    pageUp: 33,
    pageDown: 34,
};
// see: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
export const keys = {
    space: ['Spacebar', ' '],
    enter: ['Enter'],
};
function activateByKey(key) {
    return event => {
        if (event.keyCode === key) {
            event.preventDefault();
            event.stopPropagation();
            event.currentTarget.click();
        }
    };
}
export const activateBySpaceButton = activateByKey(keyCodes.space);
export const activateByEnterButton = activateByKey(keyCodes.enter);
export const activateBySpaceOrEnterButton = event => {
    activateByEnterButton(event);
    activateBySpaceButton(event);
};
export const activateByEscapeButton = activateByKey(keyCodes.escape);
export const HAS_CUSTOM_FOCUS_CLASSNAME = 'has-custom-focus';
/**
 * @deprecated use useAccessibilityAttributes instead wherever you can
 */
export const getAriaAttributes = ({ role, tabIndex, tabindex, ...ariaProps } = {}) => {
    const result = Object.entries(ariaProps).reduce((prev, [key, value]) => {
        return { ...prev, [`aria-${key}`.toLowerCase()]: value };
    }, { role, tabIndex: tabIndex ?? tabindex });
    Object.keys(result).forEach(key => {
        if (result[key] === undefined || result[key] === null) {
            // eslint-disable-next-line
            delete result[key];
        }
    });
    return result;
};
export const getTabIndexAttribute = (a11y = {}) => {
    const tabIndex = a11y.tabIndex ?? a11y.tabindex ?? undefined;
    return tabIndex !== undefined ? { tabIndex: Number(tabIndex) } : {};
};
export const INNER_FOCUS_RING_CLASSNAME = 'has-inner-focus-ring';
const LINE1 = '0 0 0 1px';
const LINE2 = '0 0 0 3px';
const COLOR1 = '#ffffff';
const COLOR2 = '#116dff';
const OUTER_FOCUS_RING = `${LINE1}${COLOR1}, ${LINE2}${COLOR2}`;
const INNER_FOCUS_RING = `inset ${LINE1}${COLOR2}, inset ${LINE2}${COLOR1}`;
export const getFocusRingValue = (isOuter = true) => isOuter ? OUTER_FOCUS_RING : INNER_FOCUS_RING;
//# sourceMappingURL=a11y.js.map