import { withCompController } from '@wix/editor-elements-integrations';
import type {
  IHamburgerOverlayMapperProps,
  IHamburgerOverlayControllerProps,
  IHamburgerOverlayProps,
  IHamburgerOverlayStateValues,
} from '../HamburgerOverlay.props';

export default withCompController<
  IHamburgerOverlayMapperProps,
  IHamburgerOverlayControllerProps,
  IHamburgerOverlayProps,
  IHamburgerOverlayStateValues
>(({ mapperProps, stateValues }) => {
  const { compId } = mapperProps;

  const { setSiteScrollingBlocked, enableCyclicTabbing, disableCyclicTabbing } =
    stateValues;

  const onOpenStateChange = (isOpen: boolean) => {
    setSiteScrollingBlocked(isOpen, compId);
    isOpen ? enableCyclicTabbing(compId) : disableCyclicTabbing(compId); // focus traping in preview/live-site
  };

  return {
    ...mapperProps,
    onOpenStateChange,
  };
});
