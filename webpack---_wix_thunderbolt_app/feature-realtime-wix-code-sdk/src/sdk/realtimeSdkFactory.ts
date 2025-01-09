import { WixCodeApiFactoryArgs } from '@wix/thunderbolt-symbols'
import { namespace, RealtimeWixCodeSdkWixCodeApi } from '..'
import { realtime } from './realtime'
import { Environment } from './environment'

type RealtimeNamespace = { [namespace]: RealtimeWixCodeSdkWixCodeApi }

export function RealtimeSdkFactory({
	wixCodeNamespacesRegistry,
	onPageWillUnmount,
	platformUtils,
	platformEnvData,
}: WixCodeApiFactoryArgs): RealtimeNamespace {
	const environment = new Environment(wixCodeNamespacesRegistry, platformUtils, platformEnvData)
	const duplexerSocketsServiceUrl = 'duplexer.wix.com'
	const isAddRevisionToChannelNameInRealtimeEnabled = Boolean(
		platformEnvData.site.experiments['specs.core-services.AddRevisionToChannelNameInRealtime']
	)
	return {
		[namespace]: realtime(
			duplexerSocketsServiceUrl,
			environment,
			onPageWillUnmount,
			isAddRevisionToChannelNameInRealtimeEnabled
		),
	}
}
