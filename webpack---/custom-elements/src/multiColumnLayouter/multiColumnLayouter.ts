import fastdom from 'fastdom'
import { findMinHeight } from './utils'

function multiColumnLayouterWrapper() {
	class MultiColumnLayouter extends HTMLElement {
		containerWidthObserver?: ResizeObserver
		mutationObserver?: MutationObserver
		isActiveObserver?: ResizeObserver
		childResizeObserver?: ResizeObserver
		containerWidth: number = 0
		isActive: boolean = false
		isDuringCalc: boolean = false

		setContainerHeight(height: number) {
			this.style.setProperty('--flex-columns-height', `${height}px`)
		}
		removeContainerHeight() {
			this.style.removeProperty('--flex-columns-height')
		}

		// TODO cache computed style to recalculate only when inactive -> active
		getColumnCount(computedStyle: CSSStyleDeclaration): number {
			const val = computedStyle.getPropertyValue('--flex-column-count')
			return parseInt(val, 10)
		}

		getRowGap(computedStyle: CSSStyleDeclaration): number {
			const val = computedStyle.getPropertyValue('row-gap')
			return parseInt(val || '0', 10)
		}

		activate() {
			this.isActive = true
			this.attachObservers()
			this.recalcHeight()
		}

		deactivate() {
			this.isActive = false
			this.detachHeightCalcObservers()
			this.removeContainerHeight()
		}

		calcActive(): boolean {
			const cs = getComputedStyle(this)
			return cs.getPropertyValue('--container-layout-type') === 'multi-column-layout'
		}

		attachObservers = () => {
			this.mutationObserver?.observe(this, { childList: true, subtree: true })
			this.containerWidthObserver?.observe(this)
			Array.from(this.children).forEach((child) => {
				this.handleItemAdded(child)
			})
		}

		detachHeightCalcObservers = () => {
			this.mutationObserver?.disconnect()
			this.containerWidthObserver?.disconnect()
			this.childResizeObserver?.disconnect()
		}

		get itemsHeights(): Array<{ height: number }> {
			return Array.from(this.children).map((child) => {
				const computedStyle = getComputedStyle(child)
				let height = parseFloat(computedStyle.height || '0')
				height += parseFloat(computedStyle.marginTop || '0')
				height += parseFloat(computedStyle.marginBottom || '0')
				return { height }
			})
		}

		recalcHeight = () => {
			if (!this.isActive) {
				return
			}
			fastdom.measure(() => {
				if (!this.isActive || this.isDuringCalc) {
					return
				}
				this.isDuringCalc = true

				const cs = getComputedStyle(this)
				const bestHeight = findMinHeight(this.itemsHeights, this.getRowGap(cs), this.getColumnCount(cs))
				this.isDuringCalc = false
				fastdom.mutate(() => {
					this.setContainerHeight(bestHeight)
					this.style.setProperty('visibility', null)
				})
			})
		}

		setIsActive() {
			const shouldBeActive = this.calcActive()
			if (this.isActive !== shouldBeActive) {
				if (shouldBeActive) {
					this.activate()
				} else {
					this.deactivate()
				}
			}
		}

		connectedCallback() {
			this.cleanUp()
			this.createObservers()
			this.setIsActive()
			if (window.document.body) {
				this.isActiveObserver?.observe(window.document.body)
			}
		}

		cleanUp = () => {
			this.detachHeightCalcObservers()
			this.removeContainerHeight()
			this.isActiveObserver?.disconnect()
		}

		handleItemAdded = (node: Node) => {
			if (node instanceof window.HTMLElement) {
				this.childResizeObserver?.observe(node)
			}
		}
		handleItemRemoved = (node: Node) => {
			if (node instanceof window.HTMLElement) {
				this.childResizeObserver?.unobserve(node)
			}
		}

		createObservers = () => {
			this.containerWidthObserver = new ResizeObserver((entries) => {
				const container = entries[0]
				if (container.contentRect.width !== this.containerWidth) {
					if (this.containerWidth === 0) {
						this.containerWidth = container.contentRect.width
						return
					}
					this.containerWidth = container.contentRect.width
					this.recalcHeight()
				}
			})

			this.mutationObserver = new MutationObserver((entries) => {
				entries.forEach((mutation) => {
					Array.from(mutation.removedNodes).forEach(this.handleItemRemoved)
					Array.from(mutation.addedNodes).forEach(this.handleItemAdded)
				})
				this.recalcHeight()
			})

			this.childResizeObserver = new ResizeObserver(() => {
				this.recalcHeight()
			})

			this.isActiveObserver = new ResizeObserver(() => {
				this.setIsActive()
			})
		}
		disconnectedCallback() {
			this.cleanUp()
		}
	}
	return MultiColumnLayouter
}

export { multiColumnLayouterWrapper }
