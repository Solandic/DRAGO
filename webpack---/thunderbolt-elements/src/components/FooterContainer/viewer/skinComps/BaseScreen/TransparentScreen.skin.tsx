'use-client';
import React from 'react';
import type { IFooterContainerProps } from '../../../FooterContainer.types';
import TransparentScreen from '../../../../ScreenWidthContainer/viewer/skinComps/BaseScreen/TransparentScreen';
import FooterContainer from '../../FooterContainer';

const TransparentScreenFooter: React.FC<
  Omit<IFooterContainerProps, 'skin'>
> = props => (
  <FooterContainer {...props} skin={TransparentScreen}></FooterContainer>
);

export default TransparentScreenFooter;
