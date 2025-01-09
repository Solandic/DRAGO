export const rootItemDepthLevel = 0;
export const subItemDepthLevel = 1;
export const subSubItemDepthLevel = 2;

export const getItemDepthSelector = (depth: number) =>
  `[data-item-depth="${depth}"]`;
