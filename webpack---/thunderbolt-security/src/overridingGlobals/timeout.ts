export const overrideTimeout = () => {
	// Preventing string arguments in setTimeout thus skipping the no eval behavior
	// @ts-expect-error
	defineStrictProperty(
		'preventStringArgument',
		// This prevents calling any function that shouldn't accept string arguments to do so
		(functionName: string, argumentNumber: number, accessObject: any) => {
			const context = accessObject || globalThis
			const originalFunction = context[functionName]
			const replacementFunction = function replacer() {
				const args = Array.from(arguments)
				if (typeof args[argumentNumber] === 'string') {
					console.warn(
						`Calling ${functionName} with a String Argument at index ${argumentNumber} is not allowed`
					)
				} else {
					return originalFunction.apply(context, args)
				}
			}
			// @ts-expect-error
			defineStrictProperty(functionName, replacementFunction, context)
		}
	)

	// @ts-expect-error
	preventStringArgument('setTimeout', 0)

	// @ts-expect-error
	preventStringArgument('setInterval', 0)
}
