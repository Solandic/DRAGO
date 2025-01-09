import { classes as rootClasses } from '../../../StylableHorizontalMenu.component.st.css';
import style0 from './itemDepth0.st.css';
import style1 from './itemDepth1.st.css';
import { classes as submenuClasses, st as submenuSt } from './submenu.st.css';
import type { GetMenuItemClassesFunc } from './types';

const depthStyleMap = [style0, style1, style1];

export const getClasses_flyout: GetMenuItemClassesFunc = ({ depth }) => {
  const { st, classes } = depthStyleMap[depth] || style0;

  const submenuStyles = submenuSt(
    submenuClasses.root,
    // .root::columnsLayout - selector for stylable panel
    rootClasses.columnsLayout,
  );

  return {
    positionBox: classes.positionBox,
    animationBox: st(classes.animationBox, submenuStyles),
    alignBox: st(submenuClasses.pageWrapper, submenuClasses.overrideWidth),
    list: classes.list,
    subItem: submenuClasses.menuItem,
  };
};
