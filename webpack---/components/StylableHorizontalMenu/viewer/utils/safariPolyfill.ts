// @ts-nocheck
export const addFocusPolyfill = () => {
  const capturedEvents = [];
  let capturing = false;
  let captureTarget = null;
  let deferredDispatch;

  const faultyElementSelector = [
    'a[href]',
    'area[href]',
    'audio[controls]',
    'button',
    'input[type="button"]',
    'input[type="checkbox"]',
    'input[type="file"]',
    'input[type="image"]',
    'input[type="radio"]',
    'input[type="range"]',
    'input[type="reset"]',
    'input[type="submit"]',
    'video[controls]',
  ].join(', ');

  // interactive content is a term of art defined by the whatwg spec:
  // https://html.spec.whatwg.org/multipage/dom.html#interactive-content
  // (note: focusable elements are not necessarily interactive elements and vice versa)
  const interactiveElementSelector = [
    'a[href]',
    'audio[controls]',
    'button',
    'details',
    'embed',
    'iframe',
    'img[usemap]',
    'input:not([type="hidden"])',
    'label',
    'select',
    'textarea',
    'video[controls]',
  ].join(', ');

  function captureEvent(e) {
    if (capturing && getEventTarget(e) === captureTarget) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      capturedEvents.unshift(e);
    }
  }

  /**
   * Gets the target element
   */
  function getEventTarget(event) {
    return event.target;
  }

  function isLabelableElement(element) {
    return (
      element.matches(
        'button, input, select, textarea, progress, meter, output',
      ) || element.constructor.formAssociated
    ); // custom elements that are form associated can be labeled
  }

  function canBeDisabled(element) {
    return (
      element.matches(
        'button, fieldset, optgroup, option, select, textarea, input',
      ) || element.constructor.formAssociated
    ); // custom elements that are form associated can be disabled
  }

  /**
   * "being rendered" is a term of art in [WHATWG](https://html.spec.whatwg.org/multipage/rendering.html#being-rendered).
   * An element is "being rendered" _unless_ it or an ancestor has:
   * 1. display: none
   * 2. content-visibility: hidden
   * 3. visibility: hidden
   *
   * Note:
   * There was some debate whether an element with "display: contents" meant that it was being rendered,
   * but the issue was resolved in this (CSSWG thread](https://github.com/w3c/csswg-drafts/issues/2632)
   */
  function isBeingRendered(element) {
    let el = element;
    let isVisibilityOverridden = false;
    while (el) {
      if (el.style.visibility === 'visible') {
        isVisibilityOverridden = true;
      }
      if (
        el.style.display === 'none' ||
        el.style.contentVisibility === 'hidden' ||
        (!isVisibilityOverridden && el.style.visibility === 'hidden')
      ) {
        return false;
      }
      el = el.parentElement;
    }
    return true;
  }

  function isFocusable(element) {
    // is natively focusable element
    const isNativelyFocusableElement =
      element.matches(
        'button, input:not([type="hidden"]), select, textarea, a[href], area[href], audio[controls], video[controls]',
      ) || element.constructor.formAssociated;
    /* elements can be made focusable in two ways:
     * 1. by adding a tabindex attribute that can be parsed as an integer
     * 2. by adding a contenteditable attribute with a value of either "true" or "plaintext-only" (adding an empty attribute is the same as "true")
     */
    const isArtificiallyFocusable =
      !Number.isNaN(parseInt(element.getAttribute('tabindex'), 10)) || // 1
      ['plaintext-only', 'true'].includes(element.contentEditable); // 2

    /*
     * An element's focusability may be overridden due to:
     * 1. Being disabled via the "disabled" attribute, but only if the element is a form associated element
     * 2. Being contained by a fieldset that is disabled, but only if the element is a form associated element
     * 3. The element or an ancestor is inert
     * 4. The element or an ancestor is not "being rendered"
     */
    const isDisabled =
      canBeDisabled(element) &&
      (element.disabled || element.closest('fieldset:disabled')); // 1, 2
    const isInert = element.closest('[inert]'); // 3
    const isHidden = !isBeingRendered(element); // 4
    const isFocusabilityOverridden = isDisabled || isInert || isHidden;

    return (
      (isNativelyFocusableElement || isArtificiallyFocusable) &&
      !isFocusabilityOverridden
    );
  }

  function focusAndRedispatchMouseEvents(element) {
    /*
     * enqueue the focus event _after_ the current batch of events, which
     * includes any blur events but before the mouseup and click events.
     * The correct order of events is:
     *
     * [this element] MOUSEDOWN               <-- this event
     * [previously active element] BLUR
     * [previously active element] FOCUSOUT
     * [this element] FOCUS                   <-- forced event
     * [this element] FOCUSIN                 <-- triggered by forced event
     * [this element] MOUSEUP                 <-- possibly captured event (it may have been dispatched _before_ the FOCUS event)
     * [this element] CLICK                   <-- possibly captured event (it may have been dispatched _before_ the FOCUS event)
     */
    setTimeout(() => {
      // stop capturing possible out-of-order mouse events
      capturing = false;
      captureTarget = null;

      // trigger focus event
      element.focus();

      // re-dispatch captured mouse events in order
      while (capturedEvents.length > 0) {
        const capturedEvent = capturedEvents.pop();
        capturedEvent.target.dispatchEvent(
          new MouseEvent(capturedEvent.type, capturedEvent),
        );
      }
    }, 0);
  }

  function detectFaultyElementAndScheduleFix(event) {
    const target = getEventTarget(event);
    const labelElement = target.closest('label');
    const interactiveAncestor = target.closest(interactiveElementSelector);
    const faultyAncestor = target.closest(faultyElementSelector);
    let focusTarget = null; // element expected to recieve focus
    let faultyFocusTarget = null; // focusTarget that matches the faulty parameters
    let waitForRedirectedFocus = false; // should defer focusing and re-dispatching captured events until the target's click event is dispatched

    if (labelElement) {
      const labelTargetId = labelElement.getAttribute('for');

      if (
        labelElement !== interactiveAncestor &&
        labelElement.contains(interactiveAncestor) &&
        interactiveAncestor.contains(faultyAncestor)
      ) {
        // labels must not redirect focus or re-dispatch events if the click occurs within an interactive descendant
        // https://html.spec.whatwg.org/multipage/forms.html#the-label-element:activation-behaviour-2
        faultyFocusTarget = faultyAncestor;
      } else if (labelTargetId != null) {
        // if the label has a "for" attribute, ignore any wrapped labelable elements even if the target referenced is not labelable or doesn't exist
        focusTarget =
          labelTargetId !== ''
            ? document.querySelector(`#${CSS.escape(labelTargetId)}`)
            : null;

        if (focusTarget && isLabelableElement(focusTarget)) {
          waitForRedirectedFocus = true;
          // all labelable elements getting redirected focus from a label click are faulty because they dispatch events out of order
          faultyFocusTarget = focusTarget;
          captureTarget = focusTarget;
        }
      } else {
        // check for wrapped labelable elements
        focusTarget = Array.from(labelElement.querySelectorAll('*')).find(
          isLabelableElement,
        );
        if (focusTarget) {
          waitForRedirectedFocus = true;
          // all labelable elements getting redirected focus from a label click are faulty because they dispatch events out of order
          faultyFocusTarget = focusTarget;
          captureTarget = focusTarget;
        } else if (faultyAncestor) {
          // ignore the label since it doesn't have a "for" attribute __and__ doesn't wrap a labelable element
          faultyFocusTarget = faultyAncestor;
          captureTarget = target;
        }
      }
    } else if (faultyAncestor) {
      faultyFocusTarget = faultyAncestor;
      captureTarget = target;
    }

    if (faultyFocusTarget && isFocusable(faultyFocusTarget)) {
      if (faultyFocusTarget === document.activeElement) {
        // mousedown is happening on the currently focused element;
        // __do not__ dispatch the 'focus' event in this case AND
        // call preventDefault() to stop the browser from transferring
        // focus to the body element
        event.preventDefault();
      } else {
        // start capturing possible out-of-order mouse events
        capturing = true;

        if (waitForRedirectedFocus) {
          deferredDispatch = focusAndRedispatchMouseEvents.bind(
            null,
            faultyFocusTarget,
          );
        } else {
          focusAndRedispatchMouseEvents(faultyFocusTarget);
        }
      }
    }
  }

  function fulfillDeferments() {
    if (typeof deferredDispatch === 'function') {
      deferredDispatch();
      deferredDispatch = null;
    }
  }

  if (/apple/i.test(navigator.vendor)) {
    window.addEventListener('mousedown', detectFaultyElementAndScheduleFix, {
      capture: true,
    });
    window.addEventListener('click', fulfillDeferments, {
      capture: true,
    });
    window.addEventListener('mouseup', captureEvent, { capture: true });
    window.addEventListener('click', captureEvent, { capture: true });
    return () => {
      // clear listerners
      window.removeEventListener(
        'mousedown',
        detectFaultyElementAndScheduleFix,
        { capture: true },
      );
      window.removeEventListener('click', fulfillDeferments, {
        capture: true,
      });
      window.removeEventListener('mouseup', captureEvent, {
        capture: true,
      });
      window.removeEventListener('click', captureEvent, {
        capture: true,
      });
    };
  }
};
