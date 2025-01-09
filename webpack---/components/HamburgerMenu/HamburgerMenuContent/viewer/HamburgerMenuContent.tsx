'use-client';
import React from 'react';
import MenuContent from '../../../Menu/MenuContent/viewer/MenuContent';
import type { HamburgerMenuContentProps } from '../HamburgerMenuContent.types';

const HamburgerMenuContent: React.FC<HamburgerMenuContentProps> = props => {
  const {
    id,
    onItemMouseIn,
    onItemMouseOut,
    onItemClick,
    onItemDblClick,
    containerRootClassName,
  } = props;
  return (
    <MenuContent
      id={id}
      className={containerRootClassName}
      // TODO: create MenuItemsEventHandlerPropsSDK and extend it in Velo for these functions to work
      onItemMouseIn={onItemMouseIn}
      onItemMouseOut={onItemMouseOut}
      onItemClick={onItemClick}
      onItemDblClick={onItemDblClick}
    />
  );
};

export default HamburgerMenuContent;
