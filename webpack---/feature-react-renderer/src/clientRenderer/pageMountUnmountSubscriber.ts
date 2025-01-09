import { yieldToMain } from '@wix/thunderbolt-commons'
import {
	BrowserWindow,
	BrowserWindowSymbol,
	IPageDidLoadHandler,
	IAppWillLoadPageHandler,
	IPageDidMountHandler,
	IPageDidUnmountHandler,
	IPropsStore,
	IStructureAPI,
	LifeCycle,
	Props,
	StructureAPI,
	RegisterToUnmount,
	IAppDidLoadPageHandler,
	ExperimentsSymbol,
	Experiments,
} from '@wix/thunderbolt-symbols'
import { multi, optional, withDependencies } from '@wix/thunderbolt-ioc'
import { PageProviderSymbol, IPageProvider } from 'feature-pages'
import { ComponentCssSym, PageTransitionsHandlerSymbol } from '../symbols'
import { IPageTransitionsHandler, IThunderboltCssComponentRenderer } from '../types'

export const PageMountUnmountSubscriber = withDependencies(
	[
		Props,
		StructureAPI,
		PageProviderSymbol,
		BrowserWindowSymbol,
		PageTransitionsHandlerSymbol,
		ExperimentsSymbol,
		multi(LifeCycle.AppDidLoadPageHandler),
		optional(ComponentCssSym),
	],
	(
		props: IPropsStore,
		structureApi: IStructureAPI,
		pageReflectorProvider: IPageProvider,
		window: BrowserWindow,
		pageTransitionHandler: IPageTransitionsHandler,
		experiments: Experiments,
		appDidLoadPageHandlers: Array<IAppDidLoadPageHandler>,
		ComponentCss?: IThunderboltCssComponentRenderer
	): IAppWillLoadPageHandler & RegisterToUnmount => {
		const renderCompCssInSiteRoot = Boolean(experiments['specs.thunderbolt.renderCompCssInPagesContainer'])
		let dynamicllyRegisteredUnmountHandlers: Array<IPageDidUnmountHandler['pageDidUnmount']> = []
		return {
			name: 'pageMountUnmountSubscriber',
			registerToPageDidUnmount: (pageDidUnmount: IPageDidUnmountHandler['pageDidUnmount']) => {
				dynamicllyRegisteredUnmountHandlers.push(pageDidUnmount)
			},
			appWillLoadPage: async ({ pageId, contextId }) => {
				const pageReflector = await pageReflectorProvider(contextId, pageId)
				const pageDidMountHandlers = pageReflector.getAllImplementersOf<IPageDidMountHandler>(
					LifeCycle.PageDidMountHandler
				)
				const pageDidUnmountHandlers = pageReflector
					.getAllImplementersOf<IPageDidUnmountHandler>(LifeCycle.PageDidUnmountHandler)
					.map((m) => m.pageDidUnmount)

				const pageDidLoadHandlers = pageReflector.getAllImplementersOf<IPageDidLoadHandler>(
					LifeCycle.PageDidLoadHandler
				)

				const triggerAppDidLoadPageHandlers = () => {
					pageDidLoadHandlers.map((handler) => handler.pageDidLoad({ pageId, contextId: contextId! }))
					appDidLoadPageHandlers.map((handler) => handler.appDidLoadPage({ pageId, contextId: contextId! }))
				}

				const wrapperId = structureApi.getPageWrapperComponentId(pageId, contextId)

				const { componentsCss = [] } = props.get('site-root') || {}

				props.update({
					...(renderCompCssInSiteRoot && {
						'site-root': {
							componentsCss: [{ contextId, CSS: ComponentCss?.render(pageId) }, ...componentsCss],
						},
					}),
					[wrapperId]: {
						ComponentCss: ComponentCss?.render(pageId),
						pageDidMount: async (isMounted: boolean) => {
							await yieldToMain()
							if (isMounted) {
								if (!pageTransitionHandler.hasPageTransitions()) {
									triggerAppDidLoadPageHandlers()
								}

								const funcs = await Promise.all(
									pageDidMountHandlers.map((pageDidMountHandler) =>
										pageDidMountHandler.pageDidMount(pageId)
									)
								)

								const unsubscribeFuncs = funcs.filter((x) => x) as Array<
									Exclude<typeof funcs[number], void>
								>
								pageDidUnmountHandlers.push(...unsubscribeFuncs)
								if (renderCompCssInSiteRoot) {
									pageDidUnmountHandlers.push(() => {
										const pagesContainerProps = props.get('site-root')
										props.update({
											'site-root': {
												componentsCss:
													pagesContainerProps?.componentsCss?.filter(
														(c: { contextId: string }) => c.contextId !== contextId
													) || [],
											},
										})
									})
								}
							} else if (window) {
								// Make sure all the descendants are unmounted (window is always defined on unmount flow)
								window.requestAnimationFrame(async () => {
									await Promise.all(
										[
											...dynamicllyRegisteredUnmountHandlers,
											...pageDidUnmountHandlers,
										].map((pageDidUnmount) => pageDidUnmount(pageId))
									)
									// TODO: verify if needed
									dynamicllyRegisteredUnmountHandlers = []
								})
							}
						},
					},
				})
			},
		}
	}
)
