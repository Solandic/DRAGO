export const getStyleId = (stylableClassName: string): string =>
  stylableClassName.replace('__root', '');

// adding styleId prefix for css variables
export const createCssVarsObject = (
  styleId: string,
  ...varNames: [string]
): Record<string, string> => {
  return varNames.reduce(
    (acc, varName) => ({
      ...acc,
      [`--${varName}`]: `var(--${styleId}-${varName})`,
    }),
    {},
  );
};
