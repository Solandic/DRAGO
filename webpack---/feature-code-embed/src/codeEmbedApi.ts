import _ from 'lodash'
import type {
	ChildNodeArray,
	EmbedsLocationsInfo,
	HtmlEmbeds,
	LocationToNodeScript,
	Window,
	HtmlEmbedPosition,
	HtmlServerEmbed,
} from './types'
import {
	BODY_END,
	BODY_START,
	HEAD,
	locations,
	locationToHtmlEmbedsSectionBeginIds,
	locationToHtmlEmbedsSectionEndIds,
} from './symbols'

const isLoadOnce = (script: HtmlServerEmbed) => script.loadOnce && !script.pages
const shouldRemoveScriptFromDom = (script: HtmlServerEmbed) => !isLoadOnce(script)

const getContextByLocation = (location: string, window: Window) => {
	switch (location) {
		case HEAD: {
			return window.document.head
		}
		case BODY_START:
		case BODY_END: {
			return window.document.body
		}
		default:
			return undefined
	}
}

const getHtmlEmbedsSectionNodes = (location: string, window: Window) => {
	const htmlEmbedsSectionBegin = window.document.getElementById(locationToHtmlEmbedsSectionBeginIds[location])
	const htmlEmbedsSectionEnd = window.document.getElementById(locationToHtmlEmbedsSectionEndIds[location])

	return { htmlEmbedsSectionBegin, htmlEmbedsSectionEnd, location: location as HtmlEmbedPosition }
}

const getNodesBetween = (htmlEmbedsSectionStart: HTMLElement | null, htmlEmbedsSectionEnd: HTMLElement | null) => {
	const nodesBetween = []
	let currentNode: Element | null = htmlEmbedsSectionStart

	// eslint-disable-next-line no-cond-assign
	while (currentNode && (currentNode = currentNode.nextElementSibling)) {
		if (currentNode === htmlEmbedsSectionEnd) {
			return nodesBetween
		}
		nodesBetween.push(currentNode)
	}
	return nodesBetween
}

const getScriptsForPage = (embeds: any, location: HtmlEmbedPosition, pageId: string | undefined) => {
	return _(embeds)
		.filter({ position: location })
		.filter((embed) => !embed.pages || _.some(embed.pages, (page) => page === pageId) || isLoadOnce(embed))
		.value()
}

const removeNodes = (context: HTMLElement | undefined, nodeListToDelete: ChildNodeArray | undefined) => {
	_.forEach(nodeListToDelete, (nodeToDelete) => {
		context && nodeToDelete && context.removeChild(nodeToDelete)
	})
}

const removePreviousScriptNodes = (nodesToDelete: LocationToNodeScript) => {
	_.forEach(locations, (_location) => {
		const location = _location as HtmlEmbedPosition
		const context = getContextByLocation(location, window)
		removeNodes(context, nodesToDelete[location])
	})
}

const copyChildren = (fromElem: any, toElem: any, window: Window) => {
	const { COMMENT_NODE, ELEMENT_NODE, TEXT_NODE } = window.Node
	const windowNodeTypes = { COMMENT_NODE, ELEMENT_NODE, TEXT_NODE }

	_.forEach(fromElem.childNodes, (orig) => {
		let copy: any = null
		if (orig.nodeType === windowNodeTypes.ELEMENT_NODE) {
			copy = window.document.createElement(orig.tagName)
			_.forEach(orig.attributes, (attr) => {
				copy.setAttribute(attr.name, attr.value)
			})
			copyChildren(orig, copy, window)
		} else if (orig.nodeType === windowNodeTypes.TEXT_NODE) {
			copy = window.document.createTextNode(orig.textContent)
		} else if (orig.nodeType === windowNodeTypes.COMMENT_NODE) {
			copy = window.document.createComment(orig.textContent)
		}
		if (copy) {
			toElem.appendChild(copy)
		}
	})
}

const addNewScripts = (
	htmlEmbeds: HtmlEmbeds,
	location: HtmlEmbedPosition,
	htmlEmbedsSectionBegin: ChildNode | null,
	remainingScriptsIdsInDom: ChildNodeArray,
	nodesInDom: ChildNodeArray,
	window: Window,
	pageId: string
) => {
	let nodeToAddAfter = htmlEmbedsSectionBegin
	const context = getContextByLocation(location, window)

	let nextAvailableScriptIndexInDom = 0
	_.forEach(getScriptsForPage(htmlEmbeds, location, pageId), (script) => {
		const tempDiv = window.document.createElement('div')

		if (
			remainingScriptsIdsInDom.length > 0 &&
			remainingScriptsIdsInDom[nextAvailableScriptIndexInDom] === script.id
		) {
			nodeToAddAfter = nodesInDom[nextAvailableScriptIndexInDom]
			nextAvailableScriptIndexInDom++
		} else {
			const element = window.document.createElement('div')
			element.innerHTML = script.content.html
			copyChildren(element, tempDiv, window)

			while (tempDiv?.children.length) {
				context && context.insertBefore(tempDiv.children[0], nodeToAddAfter!.nextSibling)
			}
			nodeToAddAfter = nodeToAddAfter!.nextSibling
		}
	})
}

const addNewScriptsInEmbedsSectionLocations = (
	embedsScriptsLocations: Array<EmbedsLocationsInfo>,
	htmlEmbeds: HtmlEmbeds,
	remainingScriptsIdsInDom: LocationToNodeScript,
	remainingNodesInDom: LocationToNodeScript,
	window: Window,
	pageId: string
) => {
	_.forEach(embedsScriptsLocations, (nodeLocation) => {
		addNewScripts(
			htmlEmbeds,
			nodeLocation.location,
			nodeLocation.htmlEmbedsSectionBegin,
			remainingScriptsIdsInDom[nodeLocation.location] as ChildNodeArray,
			remainingNodesInDom[nodeLocation.location] as ChildNodeArray,
			window,
			pageId
		)
	})
}

const calcDomNodesState = (
	embedsScriptsLocations: Array<EmbedsLocationsInfo>,
	htmlEmbeds: HtmlEmbeds,
	prevPageId?: string
) => {
	const nodesToDelete: LocationToNodeScript = {}
	const remainingScriptsIdsInDom: LocationToNodeScript = {}
	const remainingNodesInDom: LocationToNodeScript = {}
	_.forEach(embedsScriptsLocations, (commentNodeLocation) => {
		const location = commentNodeLocation.location
		const nodesInDom = getNodesBetween(
			commentNodeLocation.htmlEmbedsSectionBegin,
			commentNodeLocation.htmlEmbedsSectionEnd
		)

		nodesToDelete[location] = []
		remainingScriptsIdsInDom[location] = []
		remainingNodesInDom[location] = []

		if (_.isEmpty(nodesInDom)) {
			return { nodesToDelete, remainingScriptsIdsInDom, remainingNodesInDom }
		}

		const scriptsInServer = getScriptsForPage(htmlEmbeds, location, prevPageId)

		_.forEach(scriptsInServer, (scriptInServer, i) => {
			if (shouldRemoveScriptFromDom(scriptInServer)) {
				nodesToDelete[location]!.push(nodesInDom[i])
			} else {
				remainingScriptsIdsInDom[location]!.push(scriptInServer.id)
				remainingNodesInDom[location]!.push(nodesInDom[i])
			}
		})
	})
	return { nodesToDelete, remainingScriptsIdsInDom, remainingNodesInDom }
}

export const handleCodeEmbeds = (htmlEmbeds: HtmlEmbeds, pageId: string, window: Window, prevPageId?: string) => {
	const embedsScriptsLocations = _(locations)
		.map((location) => getHtmlEmbedsSectionNodes(location, window))
		.compact()
		.value()

	const { nodesToDelete, remainingScriptsIdsInDom, remainingNodesInDom } = calcDomNodesState(
		embedsScriptsLocations,
		htmlEmbeds,
		prevPageId
	)

	removePreviousScriptNodes(nodesToDelete)

	return () =>
		addNewScriptsInEmbedsSectionLocations(
			embedsScriptsLocations,
			htmlEmbeds,
			remainingScriptsIdsInDom,
			remainingNodesInDom,
			window,
			pageId
		)
}
