export function onSwipe($swipe) {
  return {
    restrict: 'A',
    link: (scope, element, attrs) => {
      $swipe.bind(element, {
        start: (_coords, event) => {
          scope.$apply(() => {
            scope.$eval(attrs.onSwipe);
          });

          event.preventDefault();
        },
      });
    },
  };
}
