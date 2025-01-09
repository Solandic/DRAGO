import { withCompController } from '@wix/editor-elements-integrations';
import type {
  DropDownMenuControllerProps,
  IDropDownMenuItem,
  DropDownMenuStateRefs,
} from '../DropDownMenu.types';

const compController = withCompController<
  IDropDownMenuItem,
  DropDownMenuControllerProps,
  DropDownMenuStateRefs
>(({ stateValues, mapperProps }) => {
  const { currentUrl } = stateValues;
  return {
    ...mapperProps,
    currentUrl,
  };
});

export default compController;
