import type { ReactNode } from 'react';
import React from 'react';
import { TestIds } from '../constants';
import type { StylableButtonSemanticClassNames } from '../StylableButton.types';
import type { ClassNames } from './StylableButtonCommon';

const ButtonContent: React.FC<{
  icon?: ReactNode;
  label?: string;
  override?: boolean;
  semanticClassNames: StylableButtonSemanticClassNames;
  classNames: ClassNames;
}> = props => {
  const { label, icon, classNames } = props;
  return (
    <span className={classNames.container}>
      {label && (
        <span className={classNames.label} data-testid={TestIds.buttonLabel}>
          {label}
        </span>
      )}
      {icon && (
        <span
          className={classNames.icon}
          aria-hidden="true"
          data-testid={TestIds.buttonIcon}
        >
          {icon}
        </span>
      )}
    </span>
  );
};
export default ButtonContent;
