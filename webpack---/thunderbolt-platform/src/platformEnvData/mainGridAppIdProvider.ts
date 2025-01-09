import { Environment } from '@wix/thunderbolt-environment'
import { optional, withDependencies } from '@wix/thunderbolt-ioc'
import { MainGridAppIdFetchSymbol, PlatformEnvDataProvider } from '@wix/thunderbolt-symbols'

export const mainGridAppIdProvider = withDependencies(
	[optional(MainGridAppIdFetchSymbol)],
	(mainGridAppId?: Environment['mainGridAppId']): PlatformEnvDataProvider => {
		return {
			async platformEnvData() {
				return {
					mainGridAppId: await mainGridAppId,
				}
			},
		}
	}
)
