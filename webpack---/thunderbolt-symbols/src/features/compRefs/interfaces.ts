import type { CompRef, CompRefPromise } from './types'
import { IAppWillMountHandler } from '../thunderbolt/LifeCycle'
import { CyclicTabbing } from '@wix/cyclic-tabbing'

export type AddCompRefById = (compId: string, compRef: CompRef) => void
export type GetCompRefById = (compId: string) => CompRefPromise
export type CompRefAPI = {
	getCompRefById: GetCompRefById
}

export const CompRefAPISym = Symbol.for('GetCompRefById')

export type ICyclicTabbing = CyclicTabbing & IAppWillMountHandler

export interface ITriggersAndReactions {
	applyEffects(compId: string, effects: Array<string>): void

	removeEffects(compId: string, effects: Array<string>): void

	observeChildListChange(parentId: string, target: HTMLElement): void

	observeChildListChangeMaster(parentId: string, target: HTMLElement): void
}
