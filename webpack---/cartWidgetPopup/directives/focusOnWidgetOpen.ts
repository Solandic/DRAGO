export function focusOnWidgetOpen($document) {
  return {
    restrict: 'A',
    link: $scope => {
      $scope.$watch('cartPopupVM.focusOnChange', () => {
        $document[0].body.focus();
      });
    },
  };
}
