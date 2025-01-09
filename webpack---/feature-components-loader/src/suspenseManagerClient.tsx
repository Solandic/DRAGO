import { createPromise, isForwardRef } from '@wix/thunderbolt-commons'
import React, { Suspense, useEffect, useMemo } from 'react'
import type { CreateSuspenseWrapperParams, WithDeferredHydrateOptionsCSR, WithDeferredHydrateWrapper } from './types'
import { ILogger } from '@wix/thunderbolt-symbols'

export const EmptyDiv = ({ logger, debugRendering, id }: { logger?: ILogger; debugRendering?: boolean; id: any }) => {
	useEffect(() => {
		logger?.meter(`react_render_error`, {
			customParams: {
				compId: id,
				type: 'Suspense Fallback',
			},
		})
		if (debugRendering) {
			console.error('suspense rendered fallback for - ', id)
		}
	}, [logger, debugRendering, id])
	return <div />
}

function wrapPromise(promise: Promise<any>) {
	let status = 'pending'
	let response: any

	const suspender = promise.then(
		(res: any) => {
			status = 'success'
			response = res
		},
		(err: any) => {
			status = 'error'
			response = err
		}
	)

	const read = () => {
		switch (status) {
			case 'pending':
				throw suspender
			case 'error':
				throw response
			default:
				return response
		}
	}

	return { read, status }
}

function SuspenseInnerDeferred(props: any) {
	const ReactComponent = props.api.read()
	if (props.debugRendering) {
		console.log(`rendering { compId: ${props.id}}`)
	}
	return props.children(ReactComponent)
}
// called once per comp type when the component is loaded to the store
export const WithHydrateWrapperCSR: WithDeferredHydrateWrapper<WithDeferredHydrateOptionsCSR> = ({
	deferredComponentLoaderFactory,
	debugRendering,
	setIsWaitingSuspense,
	logger,
}) => {
	// called for each render
	const ViewportHydrator = (props: any, ref: any) => {
		const suspender = useMemo(() => {
			const { promise, resolver } = createPromise<React.ComponentType<any> | (() => React.ReactNode)>()
			const api = wrapPromise(promise)
			return { api, resolver }
		}, [])

		useEffect(() => {
			setIsWaitingSuspense(props.id, true)
			const { componentPromise, onUnmount } = deferredComponentLoaderFactory!(props.id, props.children)
			componentPromise.then((...args) => {
				setIsWaitingSuspense(props.id, false)
				suspender.resolver(...args)
			})
			return () => onUnmount && onUnmount()
		}, [props.id, suspender, suspender.resolver, props.children])

		return (
			<Suspense fallback={<EmptyDiv logger={logger} debugRendering={debugRendering} id={props.id} />}>
				<SuspenseInnerDeferred api={suspender.api} debugRendering={debugRendering} id={props.id}>
					{(Comp: React.ComponentType<any>) => <Comp {...props} ref={isForwardRef(Comp) ? ref : null} />}
				</SuspenseInnerDeferred>
			</Suspense>
		)
	}

	return React.forwardRef(ViewportHydrator)
}

const LazyCompInner = ({
	setIsWaitingSuspense,
	...props
}: {
	setIsWaitingSuspense: CreateSuspenseWrapperParams['setIsWaitingSuspense']
	id: string
}) => {
	useEffect(() => {
		setIsWaitingSuspense(props.id, false)
	}, [props.id, setIsWaitingSuspense])
	return <></>
}

export const createSuspenseWrapper = ({
	LazyComp,
	setIsWaitingSuspense,
	getIsWaitingSuspense,
}: CreateSuspenseWrapperParams) => (props: any) => {
	useEffect(() => {
		// In case the LazyComp was already loaded, LazyCompInner useEffect will run before
		if (getIsWaitingSuspense(props.id) === false) {
			return
		}
		setIsWaitingSuspense(props.id, true)
	}, [props.id])
	return (
		<Suspense fallback={<EmptyDiv id={props.id} />}>
			<LazyCompInner setIsWaitingSuspense={setIsWaitingSuspense} {...props} />
			<LazyComp {...props} />
		</Suspense>
	)
}
