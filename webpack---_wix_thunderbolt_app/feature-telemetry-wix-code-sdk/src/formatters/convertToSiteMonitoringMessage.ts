import type { ConsoleMessageData } from '../types'
import { LogLevel } from '../types'

function convertToSiteMonitoringSeverity(logLevel: LogLevel): string {
	switch (logLevel) {
		case LogLevel.WARN:
			return 'WARNING'
		case LogLevel.ERROR:
		case LogLevel.ASSERT:
			return 'ERROR'
		case LogLevel.DEBUG:
			return 'DEBUG'
		default:
			return 'INFO'
	}
}

function normalizeArgs(value: any): any {
	if (value === null) {
		return String(value)
	} else if (value === undefined) {
		return String(undefined)
	} else if (typeof value === 'object') {
		return JSON.stringify(value)
	} else {
		return value
	}
}

export type SiteMonitoringMessage = {
	severity: string
	message: string
}

export const convertToSiteMonitoringMessage = ({
	logLevel,
	args,
}: ConsoleMessageData): SiteMonitoringMessage | undefined => {
	const severity = convertToSiteMonitoringSeverity(logLevel)

	if (logLevel === LogLevel.ASSERT) {
		const assertion = args[0]
		if (assertion) {
			const joinedAssertionArgs = args.slice(1).map(normalizeArgs).join(' ')

			return {
				message: joinedAssertionArgs,
				severity,
			}
		}
	} else if (logLevel !== LogLevel.VERBOSE) {
		const message = args.map(normalizeArgs).join(' ')

		return { message, severity }
	}
}
