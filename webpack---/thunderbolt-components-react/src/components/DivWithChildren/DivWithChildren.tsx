import React, { ComponentType, ReactNode } from 'react'

export type DivWithChildrenCompProps = {
	children: () => ReactNode
	id: string
	className: string
	renderCompCssInSiteRoot?: boolean
	componentsCss?: Array<{
		CSS: string
		contextId: string
	}>
}

const DivWithChildren: ComponentType<DivWithChildrenCompProps> = ({
	children,
	id,
	className,
	renderCompCssInSiteRoot,
	componentsCss,
}) => {
	return (
		<div id={id} className={className}>
			{renderCompCssInSiteRoot &&
				componentsCss &&
				componentsCss.map(({ CSS }) => {
					return CSS
				})}
			{children()}
		</div>
	)
}

export default DivWithChildren
