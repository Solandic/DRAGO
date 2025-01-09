const { ownKeys } = Reflect

const makePropertyReadOnly = (prototype: any, prop: string | symbol, descriptor: PropertyDescriptor, key: string) => {
	if ('value' in descriptor && descriptor.configurable) {
		const { value, enumerable } = descriptor

		// Define a getter and setter to make the property read-only
		Object.defineProperty(prototype, prop, {
			get() {
				return value
			},
			set(newValue: any) {
				// Prevent assignment to the read-only property on the prototype
				if (prototype === this) {
					console.warn(`Cannot assign to read-only property '${String(prop)}' of '${key}.prototype'`)
				}

				// Define the new property
				Object.defineProperty(this, prop, {
					value: newValue,
					writable: true,
					enumerable: true,
					configurable: true,
				})
			},
			enumerable,
			configurable: false,
		})
	}
}

/**
 * Freezes the properties of an object within a given context to make them read-only.
 *
 * @param key - The key of the object within the context to be frozen.
 * @param context - The context containing the object to be frozen.
 *
 * This function performs the following steps:
 * 1. Retrieves the object from the context using the provided key.
 * 2. Defines a strict property on the global object to protect the object.
 * 3. Retrieves the prototype of the object and logs a warning if it is not found.
 * 4. Iterates over the properties of the prototype and makes them read-only.
 * 5. Defines getters and setters on the original object to prevent redefinition of properties.
 */
const softFreeze = (key: string, context: Record<string, any>, excludedProps: Array<string | symbol> = []) => {
	const protectedObj = context[key]

	const { enumerable } = Object.getOwnPropertyDescriptor(context, key) || { enumerable: false }

	// Define a strict property on the global object to protect the object
	// @ts-expect-error
	globalThis.defineStrictProperty(key, protectedObj, context, enumerable)

	const prototype = protectedObj?.prototype
	if (prototype) {
		const prototypeDescriptors = Object.getOwnPropertyDescriptors(prototype)

		// Iterate over the properties of the prototype and make them read-only
		Object.keys(prototypeDescriptors).forEach((prop) => {
			const descriptor = prototypeDescriptors[prop]

			if (descriptor) {
				makePropertyReadOnly(prototype, prop, descriptor, key)
			}
		})
	}

	// Go over all property keys (string and symbol)
	ownKeys(protectedObj).forEach((prop) => {
		const descriptor = Object.getOwnPropertyDescriptor(protectedObj, prop)
		if (descriptor && !excludedProps.includes(prop) && (descriptor.writable || descriptor.configurable)) {
			// Define getters and setters on the original object to prevent redefinition of properties
			// @ts-expect-error
			globalThis.defineStrictProperty(prop.toString(), protectedObj[prop], protectedObj, descriptor.enumerable)
		}
	})
}

export default softFreeze
