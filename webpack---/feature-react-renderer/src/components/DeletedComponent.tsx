import { withDependencies } from '@wix/thunderbolt-ioc'
import React, { FC } from 'react'
import { IRendererPropsExtender } from '@wix/thunderbolt-symbols'
import { ComponentDidMountWrapperSymbol, IWrapComponent } from '@wix/thunderbolt-components-loader'

interface IProps {
	BaseComponent: FC<any>
}

const DeletedComponent = ({ BaseComponent }: IProps) => {
	return (
		<BaseComponent
			style={{
				visibility: 'hidden',
				overflow: 'hidden',
				pointerEvents: 'none',
			}}
		/>
	)
}

export const DeletedCompPropsProvider = withDependencies(
	[ComponentDidMountWrapperSymbol],
	(componentDidMountWrapper: IWrapComponent): IRendererPropsExtender => {
		return {
			async extendRendererProps() {
				return {
					// @ts-ignore
					DeletedComponent: componentDidMountWrapper.wrapComponent(DeletedComponent) as FC<any>,
				}
			},
		}
	}
)
