export function numbersOnly() {
  const limitNumberLengthTo = (transformedInput: string, digitLimit: string): string => {
    const limit = parseInt(digitLimit, 10);
    if (typeof limit === 'number') {
      transformedInput = transformedInput.length > limit ? transformedInput.substring(0, limit) : transformedInput;
    }
    return transformedInput;
  };

  return {
    restrict: 'A',
    require: 'ngModel',
    link: (_, __, attr, ngModelCtrl) => {
      function fromUser(text: string): string {
        if (typeof text !== 'string') {
          return;
        }

        let transformedInput = text.replace(/[^0-9]/g, '');

        // if only zeros
        if (/^0+$/.test(transformedInput)) {
          transformedInput = '';
        }

        if (attr.digitLimit) {
          transformedInput = limitNumberLengthTo(transformedInput, attr.digitLimit);
        }
        // if text was changed, make sure it's rendered in the view
        if (transformedInput !== text) {
          ngModelCtrl.$setViewValue(transformedInput);
          ngModelCtrl.$render();
        }
        return transformedInput;
      }

      ngModelCtrl.$parsers.push(fromUser);
    },
  };
}
