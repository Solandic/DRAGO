import { named, withDependencies } from '@wix/thunderbolt-ioc'
import { FeatureStateSymbol } from '@wix/thunderbolt-symbols'
import { IFeatureState } from 'thunderbolt-feature-state'
import { name } from './symbols'
import type { PageState, IPageReflectorStateApi } from './types'

export const LogicalReflectorState = withDependencies(
	[named(FeatureStateSymbol, name)],
	(featureState: IFeatureState<PageState>): IPageReflectorStateApi => {
		return {
			isContainerExistsForContext: (contextId: string) => !!featureState.get()?.[contextId],
		}
	}
)
