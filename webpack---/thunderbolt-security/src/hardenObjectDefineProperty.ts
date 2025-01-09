// We need to harden Object.defineProperty to prevent modifications to the soft frozen prototypes since we're not using Object.freeze
const hardenObjectDefineProperty = (objectsToFreeze: Array<string>, context: Record<string, any>) => {
	const prototypesToFreeze = objectsToFreeze.map((key) => context[key]?.prototype).filter(Boolean)

	const originalDefineProperty = Object.defineProperty

	Object.defineProperty = function <T>(obj: T, prop: PropertyKey, descriptor: PropertyDescriptor & ThisType<any>): T {
		// Check if the object being modified is a frozen prototype
		if (prototypesToFreeze.includes(obj)) {
			throw new TypeError(`Cannot modify ${(obj as Function).name}.prototype: it is frozen`)
		}

		return originalDefineProperty.call(this, obj, prop, descriptor) as T
	}
}

export default hardenObjectDefineProperty
