import { withCompController } from '@wix/editor-elements-integrations';

const compController = withCompController(({ stateValues, mapperProps }) => {
  const { currentUrl } = stateValues;
  return {
    ...mapperProps,
    currentUrl,
  };
});

export default compController;
