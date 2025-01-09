import React, { ComponentType } from 'react'
import { withDependencies } from '@wix/thunderbolt-ioc'
import { CompProps, Experiments, ExperimentsSymbol } from '@wix/thunderbolt-symbols'

const isCsr = !!process.env.browser

let useControllerHook: (
	displayedId: string,
	compType: string,
	_compProps: CompProps,
	compId: string,
	takePropsNotOnlyFromDisplayedAndFull: boolean
) => {
	[x: string]: any
}
;(async () => {
	isCsr && (await window.externalsRegistry.react.loaded)
	useControllerHook = require('./hooks').useControllerHook
})()
export const RunControllersWrapper = withDependencies([ExperimentsSymbol], (experiments: Experiments) => {
	const takePropsNotOnlyFromDisplayedAndFull = Boolean(
		experiments['specs.thunderbolt.takePropsNotOnlyFromDisplayedAndFull']
	)
	return {
		wrapComponent: (Component: ComponentType<any>) => {
			const Wrapper = ({
				compProps: storeProps,
				...restProps
			}: {
				compProps: any
				compId: string
				compClassType: string
				id: string
			}) => {
				const { id: displayedId, compId, compClassType } = restProps
				const compProps = useControllerHook(
					displayedId,
					compClassType,
					storeProps,
					compId,
					takePropsNotOnlyFromDisplayedAndFull
				)

				return (
					<Component
						{...compProps}
						className={compProps?.className ? `${compProps.className} ${compId}` : compId}
						{...restProps}
					/>
				)
			}
			return Wrapper
		},
	}
})
