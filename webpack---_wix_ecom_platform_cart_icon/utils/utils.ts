export const getCatalogAppId = (lineItems: any) => {
  return [...new Set([...lineItems])]
    .map(({catalogAppId}) => catalogAppId)
    .filter((catalogAppId) => !!catalogAppId)
    .toString();
};
