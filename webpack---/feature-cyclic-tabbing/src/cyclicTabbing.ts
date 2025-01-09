import { named, withDependencies } from '@wix/thunderbolt-ioc'
import type { Experiments } from '@wix/thunderbolt-symbols'
import {
	BrowserWindow,
	BrowserWindowSymbol,
	ExperimentsSymbol,
	FeatureExportsSymbol,
	ICyclicTabbing,
} from '@wix/thunderbolt-symbols'
import { IFeatureExportsStore } from 'thunderbolt-feature-exports'
import { name } from './symbols'
import { createCyclicTabbing } from '@wix/cyclic-tabbing'

export const CyclicTabbing = withDependencies(
	[BrowserWindowSymbol, named(FeatureExportsSymbol, name), ExperimentsSymbol],
	(
		browserWindow: BrowserWindow,
		cyclicTabbingExports: IFeatureExportsStore<typeof name>,
		experiments: Experiments
	): ICyclicTabbing => {
		const { enableCyclicTabbing, disableCyclicTabbing } = createCyclicTabbing({
			browserWindow: browserWindow as Window,
			screenReaderFocus: !!experiments['specs.thunderbolt.screen_reader_focus'],
		})

		return {
			enableCyclicTabbing,
			disableCyclicTabbing,
			appWillMount: () => {
				cyclicTabbingExports.export({
					enableCyclicTabbing,
					disableCyclicTabbing,
				})
			},
		}
	}
)
