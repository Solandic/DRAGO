const CONSTANTS = {
  APP_DEF_ID: '46b2ad43-5720-41d2-8436-2058979cb53f',
  SENTRY: {
    DSN: 'https://69fbdb10071647948ccff7dce7d7ccc6@sentry-next.wixpress.com/530',
  },
  LOGGER: {
    PREFIX: 'blocks-client-viewer-app_',
  },
  INTERACTIONS: {
    CREATE_CONTROLLERS: 'create-controllers',
  },
  PHASES: {
    LOAD_WIDGET: 'load-widget',
  },
  EXPERIMENTS_SCOPE: 'blocks-client',
} as const;

export default CONSTANTS;
