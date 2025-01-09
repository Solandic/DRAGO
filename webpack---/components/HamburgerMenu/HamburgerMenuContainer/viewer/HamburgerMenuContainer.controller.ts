
import { withCompController } from '@wix/editor-elements-integrations';
import type {
  IHamburgerMenuContainerProps,
  IHamburgerMenuContainerMapperProps,
  IHamburgerMenuContainerControllerProps,
  IHamburgerMenuContainerStateValues,
} from '../../../../components/HamburgerMenu/HamburgerMenuContainer/HamburgerMenuContainer.props';

export default withCompController<
  IHamburgerMenuContainerMapperProps,
  IHamburgerMenuContainerControllerProps,
  IHamburgerMenuContainerProps,
  IHamburgerMenuContainerStateValues
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
