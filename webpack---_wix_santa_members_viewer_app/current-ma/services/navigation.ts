import type { RawRouter } from '../../types';

export function getNavigatableHomePage(routers: RawRouter[]) {
  const publicRouter = routers.find(
    (r) => JSON.parse(r.config).type === 'public',
  );

  if (!publicRouter) {
    return;
  }

  const config = JSON.parse(publicRouter.config);
  const routerPrefix = publicRouter.prefix;
  const patternsKeys = Object.keys(config.patterns ?? {});

  const socialHomePage = patternsKeys.find(
    (key) => config.patterns[key].socialHome === true,
  );

  if (socialHomePage) {
    return {
      routerPrefix,
      patternKey: socialHomePage,
      pageData: config.patterns[socialHomePage],
    };
  } else if (patternsKeys.length > 0) {
    const publicPage = patternsKeys[0];
    return {
      routerPrefix,
      patternKey: publicPage,
      pageData: config.patterns[publicPage],
    };
  }
}
