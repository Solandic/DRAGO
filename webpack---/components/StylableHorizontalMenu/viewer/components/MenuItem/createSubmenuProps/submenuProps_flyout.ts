import { useMemo } from 'react';
import type { ICreateSubmenuProps } from '../../../../StylableHorizontalMenu.types';
import { getClasses_flyout } from '../styles/getClasses_flyout';
import { depth0PositionUpdaters_flyout } from '../positionUpdaters/itemDepth0_flyout';
import { depth1PositionUpdaters_flyout } from '../positionUpdaters/itemDepth1_flyout';
import { createInjectCssVars_flyout } from '../styles/injectCssVars_flyout';

export const createSubmenuProps_flyout: ICreateSubmenuProps =
  stylableClassName => ({
    flyout: {
      positionUpdaters: [
        depth0PositionUpdaters_flyout,
        depth1PositionUpdaters_flyout,
      ],
      getClasses: getClasses_flyout,
      injectCssVars: createInjectCssVars_flyout(stylableClassName),
    },
  });

export const useCreateSubmenuProps_flyout: ICreateSubmenuProps = (
  stylableClassName,
  menuMode,
) =>
  useMemo(
    () => createSubmenuProps_flyout(stylableClassName, menuMode),
    [stylableClassName, menuMode],
  );
