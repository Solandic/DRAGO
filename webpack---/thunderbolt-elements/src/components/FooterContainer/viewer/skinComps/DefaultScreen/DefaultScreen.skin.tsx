'use-client';
import React from 'react';
import type { IFooterContainerProps } from '../../../FooterContainer.types';
import DefaultScreen from '../../../../ScreenWidthContainer/viewer/skinComps/DefaultScreen/DefaultScreen';
import FooterContainer from '../../FooterContainer';

const DefaultScreenFooter: React.FC<
  Omit<IFooterContainerProps, 'skin'>
> = props => (
  <FooterContainer {...props} skin={DefaultScreen}></FooterContainer>
);

export default DefaultScreenFooter;
