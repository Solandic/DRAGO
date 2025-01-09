import type { ServerPerformanceEvent } from '@wix/thunderbolt-types/logger/'

export const SSRPerformanceStore = (initialData: Array<ServerPerformanceEvent> = []) => {
	const eventData: Array<ServerPerformanceEvent> = initialData

	const addSSRPerformanceEvent = (name: string) => {
		eventData.push({ name: `${name} (server)`, startTime: Date.now() })
	}
	const addSSRPerformanceEvents = (events: Array<ServerPerformanceEvent>) => {
		eventData.push(...events)
	}
	const getAllSSRPerformanceEvents = () => eventData

	return { addSSRPerformanceEvent, getAllSSRPerformanceEvents, addSSRPerformanceEvents }
}
