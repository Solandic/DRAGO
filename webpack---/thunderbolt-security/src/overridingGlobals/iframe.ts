import { makeStringClear } from '../helpers'

const createElement = document.createElement

const createElementReplacement = (elementType: string, options: any) => {
	const newElement = createElement.call(document, elementType, options)
	const originalSetAttribute = Element.prototype.setAttribute
	const originalSetAttributeNS = Element.prototype.setAttributeNS

	if (makeStringClear(elementType) === 'iframe') {
		// @ts-expect-error
		globalThis.defineStrictProperty(
			'srcdoc',
			{
				get: () => {},
				set: () => {
					console.error('`srcdoc` is not allowed in iframe elements.')
				},
			},
			newElement,
			false
		)

		const setAttributeReplacement = function (name: string, value: any) {
			if (name.toLowerCase() === 'srcdoc') {
				console.error('`srcdoc` attribute is not allowed to be set.')
				return
			}
			originalSetAttribute.call(newElement, name, value)
		}

		const setAttributeNSReplacement = function (namespace: string, name: string, value: any) {
			if (name.toLowerCase() === 'srcdoc') {
				console.error('`srcdoc` attribute is not allowed to be set.')
				return
			}
			originalSetAttributeNS.call(newElement, namespace, name, value)
		}

		newElement.setAttribute = setAttributeReplacement
		newElement.setAttributeNS = setAttributeNSReplacement
	}

	return newElement
}

export const overrideIframe = () => {
	// @ts-expect-error
	globalThis.defineStrictProperty('createElement', createElementReplacement, document, true)
}
