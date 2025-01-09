
import { withCompController } from '@wix/editor-elements-integrations';
import type {
  IHamburgerMenuRootProps,
  IHamburgerMenuRootMapperProps,
  IHamburgerMenuRootControllerProps,
  IHamburgerMenuRootStateValues,
} from '../../../../components/HamburgerMenu/HamburgerMenuRoot/HamburgerMenuRoot.props';

export default withCompController<
  IHamburgerMenuRootMapperProps,
  IHamburgerMenuRootControllerProps,
  IHamburgerMenuRootProps,
  IHamburgerMenuRootStateValues
>(({ mapperProps, controllerUtils, stateValues }) => {
  const { editorType } = stateValues
  return {
    ...mapperProps,
    editorType,
    updateComponentPropsInViewer: props => {
      controllerUtils.updateProps(props);
    }
  }
});
