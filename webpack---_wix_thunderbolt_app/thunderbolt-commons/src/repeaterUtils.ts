import type { IPropsStore } from '@wix/thunderbolt-symbols'

export const REPEATER_DELIMITER = '__'

export const isRepeatedComponent = (compId: string) => compId.includes(REPEATER_DELIMITER)

export const getDisplayedId = (originalId: string, itemId: string) => `${originalId}${REPEATER_DELIMITER}${itemId}`

export const getInflatedItemId = (itemId: string, outerItemId: string) =>
	outerItemId ? `${itemId}${REPEATER_DELIMITER}${outerItemId}` : itemId

export const getFullId = (id: string) => id.split(REPEATER_DELIMITER, 1)[0]

export const getTemplateItemId = (id: string) => id.split(REPEATER_DELIMITER, 2)[1]

export const getDisplayedItemId = (id: string) => {
	const [_compId, ...restItemIds] = id.split(REPEATER_DELIMITER) // eslint-disable-line @typescript-eslint/no-unused-vars
	return restItemIds.join(REPEATER_DELIMITER)
}

export const getInnerMostItemId = (itemId: string) => itemId.split(REPEATER_DELIMITER, 1)[0]

export const getTemplateCompIdAndRepeaterScope = (id: string) => {
	const [templateCompId, ...itemIds] = id.split(REPEATER_DELIMITER)
	return { templateCompId, scope: itemIds }
}

export const getFullItemId = (id: string) => {
	const delimiterIndex = id.indexOf(REPEATER_DELIMITER)
	return delimiterIndex !== -1 ? id.slice(delimiterIndex + REPEATER_DELIMITER.length) : ''
}

export const getOuterItemId = (id: string) => {
	const [_compId, _innerItemId, ...outerItemIds] = id.split(REPEATER_DELIMITER) // eslint-disable-line @typescript-eslint/no-unused-vars
	return outerItemIds.join(REPEATER_DELIMITER)
}

export const getItemOuterItemId = (id: string) => {
	const [_innerItemId, ...outerItemIds] = id.split(REPEATER_DELIMITER) // eslint-disable-line @typescript-eslint/no-unused-vars
	return outerItemIds.join(REPEATER_DELIMITER)
}

export const isDisplayedOnly = (id: string) => getFullId(id) !== id

export const isRepeater = (compType: string) => {
	const tail = compType.split('.').pop()
	return tail === 'Repeater' || tail === 'DynamicRepeater'
}

export const isRepeatedComponentOfTemplate = (templateCompId: string) => {
	const templatePrefix = `${templateCompId}${REPEATER_DELIMITER}`
	return (compId: string) => compId.startsWith(templatePrefix)
}

export const getRepeatedCompSelector = (compId: string) => `[id^="${compId}${REPEATER_DELIMITER}"]`

// 'itemInner__itemMiddle__itemOuter' => [ 'itemInner__itemMiddle__itemOuter', 'itemInner__itemMiddle', 'itemInner' ]
export const getRepeaterItemsAncestorChain = (itemId: string) => {
	const repeaterItemsAncestorChain: Array<string> = []
	itemId
		.split(REPEATER_DELIMITER)
		.forEach((item, index) =>
			index === 0
				? repeaterItemsAncestorChain.push(item)
				: repeaterItemsAncestorChain.push(getDisplayedId(repeaterItemsAncestorChain[index - 1], item))
		)
	return repeaterItemsAncestorChain.reverse()
}

export const getRepeaterItemsFromProps = (
	repeaterId: string,
	getProps: IPropsStore['get'],
	shouldInflateRepeaterItemsInRender: boolean
): Array<string> | undefined => {
	const items = getProps(repeaterId)?.items as Array<string> | undefined
	if ((!shouldInflateRepeaterItemsInRender && items) || !isDisplayedOnly(repeaterId)) {
		return items
	}
	if (items && shouldInflateRepeaterItemsInRender) {
		const { scope } = getTemplateCompIdAndRepeaterScope(repeaterId)
		return items.map((itemId) => {
			return getInflatedItemId(itemId, scope.join(REPEATER_DELIMITER))
		})
	}
	const { templateCompId: repeaterTemplate, scope } = getTemplateCompIdAndRepeaterScope(repeaterId)
	scope.pop()
	const outerScope = scope.join(REPEATER_DELIMITER)
	return getRepeaterItemsFromProps(
		outerScope ? getDisplayedId(repeaterTemplate, outerScope) : repeaterTemplate,
		getProps,
		shouldInflateRepeaterItemsInRender
	)
}
