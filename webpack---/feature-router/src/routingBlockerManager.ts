import { createPromise } from '@wix/thunderbolt-commons'
import { withDependencies } from '@wix/thunderbolt-ioc'
import { ILogger, LoggerSymbol, Experiments, ExperimentsSymbol, IRendererPropsExtender } from '@wix/thunderbolt-symbols'
import { IRoutingBlockerManager } from './types'

const interactionName = 'navigation_blocker_manager'
const msTimeout = 500

const routingBlockerManager = (
	logger: ILogger,
	experiments: Experiments
): IRoutingBlockerManager & IRendererPropsExtender => {
	let timeoutId: NodeJS.Timeout
	let listenersWithIds: Record<
		string,
		{ promise: Promise<any>; resolver: (resolvedData: void | PromiseLike<void>) => void }
	> = {}
	function timeoutPromise(timeout: number): Promise<never> {
		return new Promise((_, reject) => {
			timeoutId = setTimeout(() => {
				logger.meter(interactionName, {
					paramsOverrides: {
						evid: '26',
						errorInfo: `Reslove promise all taking too long`,
						errorType: 'navigation_blocker_manager_timedout',
						eventString: 'error',
					},
				})
				listenersWithIds = {}
				reject(new Error('waitForAllListenersToResolve: Operation timed out'))
			}, timeout)
		})
	}

	async function resolveAllWithTimeout<T>(promises: Array<Promise<T>>, timeout: number) {
		await Promise.race([Promise.all(promises), timeoutPromise(timeout)])
		clearTimeout(timeoutId)
	}

	const isExperiemntOpen = experiments['specs.thunderbolt.allowRoutingBlockerManager']

	const registerWithId = (id: string) => {
		const { promise, resolver } = createPromise()
		listenersWithIds[id] = { promise, resolver }
		return resolver
	}
	const resolveById = async (id: string) => {
		const listener = listenersWithIds[id]
		if (listener) {
			listener.resolver()
			delete listenersWithIds[id]
		}
	}
	return {
		async waitForAllListenersToResolve() {
			if (!isExperiemntOpen) {
				return
			}
			logger.interactionStarted(interactionName)
			try {
				await resolveAllWithTimeout(
					[...Object.values(listenersWithIds).map(({ promise }) => promise)],
					msTimeout
				)
				logger.interactionEnded(interactionName)
			} catch (error) {
				console.error('Error:', error.message)
			}
		},
		registerWithId,
		resolveById,
		extendRendererProps: async () => {
			return {
				registerRoutingBlocker: registerWithId,
				resolveRoutingBlocker: resolveById,
			}
		},
	}
}

export const RoutingBlockerManager = withDependencies([LoggerSymbol, ExperimentsSymbol], routingBlockerManager)
