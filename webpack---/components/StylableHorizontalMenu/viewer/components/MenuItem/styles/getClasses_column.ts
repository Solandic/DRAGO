import { classes as rootClasses } from '../../../StylableHorizontalMenu.component.st.css';
import style0 from './itemDepth0.st.css';
import style1 from './itemDepth1.st.css';
import { classes as submenuClasses, st as submenuSt } from './submenu.st.css';
import type { GetMenuItemClassesFunc } from './types';

const depthStyleMap = [style0, style1, style1];

export const getClasses_column: GetMenuItemClassesFunc = ({
  depth,
  isStretched = false,
  containsChildren = false,
  hasColumnSubSubs = false,
}) => {
  const { st, classes } = depthStyleMap[depth] || style0;
  const states = { isStretched, isColumn: true };

  const submenuStyles = submenuSt(
    submenuClasses.root,
    // .root::columnsLayout - selector for stylable panel
    rootClasses.columnsLayout,
  );

  if (containsChildren) {
    // handle MegaMenu container
    return {
      positionBox: st(
        classes.positionBox,
        states,
        isStretched ? rootClasses.containerPositionBox : '',
      ),
      animationBox: classes.animationBox,
      alignBox: st(
        rootClasses.megaMenuWrapper,
        isStretched ? submenuClasses.containerPageStretchWrapper : '',
      ),
      megaMenuComp: st(classes.megaMenuComp, submenuStyles),
    };
  }

  if (depth === 0) {
    return {
      positionBox: st(
        classes.positionBox,
        states,
        // root::positionBox defines left and right margins to stretched submenu
        isStretched ? rootClasses.positionBox : '',
      ),
      animationBox: st(submenuStyles, classes.animationBox),
      alignBox: st(
        classes.alignBox,
        submenuClasses.pageWrapper,
        isStretched
          ? submenuClasses.pageStretchWrapper
          : submenuClasses.overrideWidth,
      ),
      list: st(classes.list, submenuClasses.listWrapper),
      // .root::columnsLayout::menuItem or .root::columnsLayout::heading
      subItem: hasColumnSubSubs
        ? submenuClasses.heading
        : submenuClasses.menuItem,
    };
  }

  return {
    hasSubItems: submenuClasses.rowItem,
    positionBox: classes.positionBox,
    alignBox: classes.alignBox,
    list: classes.list,
    subItem: submenuClasses.menuItem,
  };
};
