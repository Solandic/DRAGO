export const query = `query getAppSettingsData($externalId: String!) {
  appSettings(externalId: $externalId) {
    widgetSettings
  }
}`;
