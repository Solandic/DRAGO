import { ClientGlobals } from './types'
import hardenObjectDefineProperty from './hardenObjectDefineProperty'
import softFreeze from './softFreeze'

export const freezeClientGlobals = (isExcludedFromSecurityExperiments: boolean) => {
	// APIs to freeze in the old manner of using Object.freeze for merged experiments
	let globalAPIsToStrictlyFreeze: Array<ClientGlobals> = []

	let globalMethodsToFreeze: Array<ClientGlobals> = []
	let globalObjectsToFreeze: Array<ClientGlobals> = []

	// @ts-expect-error
	const { experiments } = window.viewerModel

	// Check which freeze to apply
	if (experiments['specs.thunderbolt.softFreeze_TextDecoder_TextEncoder']) {
		globalObjectsToFreeze = globalObjectsToFreeze.concat(['TextEncoder', 'TextDecoder'])
	} else {
		globalAPIsToStrictlyFreeze = globalAPIsToStrictlyFreeze.concat(['TextEncoder', 'TextDecoder'])
	}

	if (experiments['specs.thunderbolt.hardenClientGlobals_EventTarget'] && !isExcludedFromSecurityExperiments) {
		globalObjectsToFreeze = globalObjectsToFreeze.concat(['XMLHttpRequestEventTarget', 'EventTarget'])
	}

	if (experiments['specs.thunderbolt.softFreeze_Array_URL_JSON']) {
		globalObjectsToFreeze = globalObjectsToFreeze.concat(['Array', 'URL', 'JSON'])
	} else {
		globalAPIsToStrictlyFreeze = globalAPIsToStrictlyFreeze.concat(['Array', 'URL', 'JSON'])
	}

	if (experiments['specs.thunderbolt.hardenClientGlobals_EventListener'] && !isExcludedFromSecurityExperiments) {
		globalMethodsToFreeze = globalMethodsToFreeze.concat(['addEventListener', 'removeEventListener'])
	}

	if (experiments['specs.thunderbolt.hardenEncodingDecoding']) {
		globalMethodsToFreeze = globalMethodsToFreeze.concat([
			'encodeURI',
			'encodeURIComponent',
			'decodeURI',
			'decodeURIComponent',
		])
	}

	if (experiments['specs.thunderbolt.hardenStringAndNumber']) {
		globalObjectsToFreeze = globalObjectsToFreeze.concat(['String', 'Number'])
	}

	if (experiments['specs.thunderbolt.hardenObject']) {
		globalObjectsToFreeze.push('Object')
	}

	// Remove once specs.thunderbolt.softFreeze_Array_URL_JSON & specs.thunderbolt.softFreeze_TextDecoder_TextEncoder are merged
	globalAPIsToStrictlyFreeze.forEach((key) => {
		// Freeze the object
		const value = Object.freeze(globalThis[key])
		// Freezing prototype if exists excluding Array because of ooiLoadComponentsPageWillMountClient.ts using chunkLoadingGlobal
		// which on webpack is override push function for a specific instance
		if (value.hasOwnProperty('prototype') && key !== 'Array') {
			// @ts-expect-error
			Object.freeze(value.prototype)
		}

		// @ts-expect-error
		globalThis.defineStrictProperty(key, globalThis[key], globalThis, true)
	})

	globalMethodsToFreeze.forEach((key) => {
		// Freeze the object
		Object.freeze(globalThis[key])

		if (['addEventListener', 'removeEventListener'].includes(key)) {
			// @ts-expect-error
			globalThis.defineStrictProperty(key, document[key], document, true)
		}

		// @ts-expect-error
		globalThis.defineStrictProperty(key, globalThis[key], globalThis, true)
	})

	globalObjectsToFreeze.forEach((key) => {
		/**
		 * We are freezing objects in a specific way for the following reasons:
		 * 1. Object.freeze does not allow extending the object with new properties.
		 * 2. Freezing Object.prototype can prevent changes to the prototype chain, including property additions or
		 * 		modifications. When Object.prototype is frozen, attempts to set properties on objects that inherit from it
		 * 		can lead to unexpected behavior.
		 * 		For more details, see: https://esdiscuss.org/topic/set-and-inherited-readonly-data-properties
		 */
		softFreeze(key, globalThis, ['defineProperty'])
	})

	hardenObjectDefineProperty(globalObjectsToFreeze, globalThis)
}
