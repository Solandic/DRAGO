import { MenuAnimationName } from '../../constants';
import type { MenuAnimationNameType } from '../../Menu.types';

export const getAnimationPackage = (id: string) => {
  const elem = document.getElementById(id) as HTMLDivElement;
  const computedValue =
    elem &&
    (getComputedStyle(elem).getPropertyValue(
      '--animation-name',
    ) as MenuAnimationNameType);
  return computedValue || MenuAnimationName.None;
};
