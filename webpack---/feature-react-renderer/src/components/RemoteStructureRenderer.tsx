import React, { ComponentType, useContext } from 'react'
import type { AppContext, RemoteStructureRendererProps } from '../types'
import { extendStoreWithSubscribe } from './extendStoreWithSubscribe'
import Context from './AppContext'
import StructureComponent from './StructureComponent'
import { AppStructure, PropsMap } from '@wix/thunderbolt-symbols'
import { getStore } from 'feature-stores'
import { getGhostComponents, getOverrides } from '../utils'

const RemoteStructureRenderer: ComponentType<RemoteStructureRendererProps> = (props) => {
	const {
		id,
		structure,
		compProps,
		rootCompId,
		innerElementsToRemove,
		innerElementsDataOverrides,
		nicknameToCompIdMaps,
		stateRefs,
		defaultVariant,
	} = props

	const context = useContext(Context)

	if (!structure || !compProps || !rootCompId) {
		return null
	}

	const structureStore = extendStoreWithSubscribe(
		getStore<AppStructure>(),
		context.batchingStrategy,
		context.layoutDoneService
	)

	structureStore.update({
		...structure,
		...getGhostComponents(nicknameToCompIdMaps, innerElementsToRemove, id, structure),
	})

	const propsStore = extendStoreWithSubscribe(
		getStore<PropsMap>(),
		context.batchingStrategy,
		context.layoutDoneService
	)

	propsStore.update({
		...compProps,
		...getOverrides(nicknameToCompIdMaps, innerElementsDataOverrides, id, compProps),
	})

	const stateRefsStore = extendStoreWithSubscribe(
		getStore<PropsMap>(),
		context.batchingStrategy,
		context.layoutDoneService
	)
	stateRefsStore.update(stateRefs)

	const scopedContextValue = {
		...context,
		structure: structureStore,
		props: propsStore,
	} as AppContext

	return (
		<Context.Provider value={scopedContextValue}>
			<div id={id} className={`${id} ${defaultVariant}`}>
				<StructureComponent
					id={rootCompId}
					scopeData={{
						scope: [],
						repeaterItemsIndexes: [],
					}}
				/>
			</div>
		</Context.Provider>
	)
}

export default RemoteStructureRenderer
