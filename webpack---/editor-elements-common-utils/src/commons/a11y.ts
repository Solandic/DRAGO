import type { AriaProps } from '@wix/editor-elements-types/a11y';
import type { UnpackValueTypes } from '@wix/editor-elements-types/utils';

export type { AriaProps };

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
} as const;

// see: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
export const keys = {
  space: ['Spacebar', ' '],
  enter: ['Enter'],
} as const;

export type Key = 'Spacebar' | ' ' | 'Enter';

type KeyCode = UnpackValueTypes<typeof keyCodes>;

function activateByKey(key: KeyCode): React.KeyboardEventHandler<HTMLElement> {
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
export const activateBySpaceOrEnterButton: React.KeyboardEventHandler<
  HTMLElement
> = event => {
  activateByEnterButton(event);
  activateBySpaceButton(event);
};
export const activateByEscapeButton = activateByKey(keyCodes.escape);

export const HAS_CUSTOM_FOCUS_CLASSNAME = 'has-custom-focus';

export type AriaAttributes = Pick<
  React.AriaAttributes,
  | 'aria-pressed'
  | 'aria-haspopup'
  | 'aria-label'
  | 'aria-live'
  | 'aria-expanded'
  | 'aria-disabled'
  | 'aria-hidden'
  | 'aria-relevant'
  | 'aria-atomic'
  | 'aria-current'
  | 'aria-busy'
  | 'aria-describedby'
  | 'aria-labelledby'
  | 'aria-errormessage'
  | 'aria-owns'
  | 'aria-controls'
  | 'aria-roledescription'
> &
  Pick<React.HTMLAttributes<any>, 'tabIndex' | 'role'> & {
    'aria-label-interactions'?: boolean;
    tabindex?: string;
  };

/**
 * @deprecated use useAccessibilityAttributes instead wherever you can
 */
export const getAriaAttributes = ({
  role,
  tabIndex,
  tabindex,
  ...ariaProps
}: AriaProps = {}): Partial<AriaAttributes> => {
  const result = Object.entries(ariaProps).reduce(
    (prev, [key, value]) => {
      return { ...prev, [`aria-${key}`.toLowerCase()]: value };
    },
    { role, tabIndex: tabIndex ?? tabindex } as Record<
      string,
      string | number | boolean
    >,
  );
  Object.keys(result).forEach(key => {
    if (result[key] === undefined || result[key] === null) {
      // eslint-disable-next-line
      delete result[key]
    }
  });
  return result;
};

export const getTabIndexAttribute = (
  a11y: { tabIndex?: number | string; tabindex?: number | string } = {},
) => {
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

export const getFocusRingValue = (isOuter = true) =>
  isOuter ? OUTER_FOCUS_RING : INNER_FOCUS_RING;
