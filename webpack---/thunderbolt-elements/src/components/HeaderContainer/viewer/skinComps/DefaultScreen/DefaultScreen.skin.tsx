'use-client';
import React from 'react';
import type { IHeaderContainerProps } from '../../../HeaderContainer.types';
import DefaultScreen from '../../../../ScreenWidthContainer/viewer/skinComps/DefaultScreen/DefaultScreen';
import HeaderContainer from '../../HeaderContainer';

const DefaultScreenHeader: React.FC<
  Omit<IHeaderContainerProps, 'skin'>
> = props => (
  <HeaderContainer {...props} skin={DefaultScreen}></HeaderContainer>
);

export default DefaultScreenHeader;
