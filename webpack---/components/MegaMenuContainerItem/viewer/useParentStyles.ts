import { useMemo } from 'react';
import { getClasses_column as getClasses } from '../../StylableHorizontalMenu/viewer/components/MenuItem/styles/getClasses_column';
import { createInjectCssVars_column } from '../../StylableHorizontalMenu/viewer/components/MenuItem/styles/injectCssVars_column';
import menuClasses from '../../Menu/viewer/components/MenuItem/style/MenuItem.scss';
import type { ParentType } from '../MegaMenuContainerItem.types';

export const useParentStyles = (parentType: ParentType, shmClassName: string) =>
  useMemo(() => {
    switch (parentType) {
      case 'wixui.Menu':
        return { className: menuClasses.megaMenuComp, cssVars: {} };
      case 'wixui.StylableHorizontalMenu':
        const shmClasses = getClasses({ depth: 0, containsChildren: true });
        const shmCssVars = createInjectCssVars_column(shmClassName)(0);

        return {
          className: shmClasses.megaMenuComp,
          cssVars: shmCssVars.megaMenuComp,
        };
      default:
        return {
          className: '',
          cssVars: {},
        };
    }
  }, [parentType, shmClassName]);
