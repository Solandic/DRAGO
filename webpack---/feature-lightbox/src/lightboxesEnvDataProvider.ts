import { withDependencies } from '@wix/thunderbolt-ioc'
import { ExperimentsSymbol, PlatformEnvDataProvider } from '@wix/thunderbolt-symbols'
import type { ILightboxUtils } from './types'
import { LightboxUtilsSymbol } from './symbols'

export const LightboxesEnvDataProvider = withDependencies(
	[LightboxUtilsSymbol, ExperimentsSymbol],
	(lightboxUtils: ILightboxUtils): PlatformEnvDataProvider => {
		return {
			platformEnvData() {
				return {
					popups: {
						popupPages: lightboxUtils.getLightboxPages(),
						lightboxRouteData: lightboxUtils.getLightboxRouteData(),
					},
				}
			},
		}
	}
)
