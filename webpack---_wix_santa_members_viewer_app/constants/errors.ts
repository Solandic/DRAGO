export enum PublicApiError {
  MissingMemberId = 'Error: please provide site member ID',
  RouteNotFound = 'Error: route not found by provided widgetId:',
  MissingMembersAreaPage = 'Error: missing members area page - failed to find prefix',
  MissingMembersAreaSettingsPage = 'Error: missing members area settings page - failed to find prefix',
  CannotNavigateToMemberNoPublicPage = 'Error: cannot navigate to member, no public page',
  MissingRoutes = 'Error: members area viewer has no routes',
  NotInitializedWixCodeApi = 'Error: wixCodeApi not properly initialized',
  CannotFindPageToNavigateTo = 'Error: cannot find page to navigate to by provided widgetId and appDefinitionId. Check if correct widgetId or appDefId is passed.',
  SectionUrlNotFound = 'Error: section URL was not found',
}
